(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure Popen :>
      sig
          (* Parent wants to write to stdin, read stdout, or read stdout + stderr *)
          datatype pipe_type = PIPE_W | PIPE_R | PIPE_RW
          type my_fd = {infd : Posix.IO.file_desc, outfd : Posix.IO.file_desc}
          val popen : string * pipe_type -> my_fd
          val pclose : my_fd -> (Posix.Process.pid*Posix.Process.exit_status) option
      end =
struct

  datatype pipe_type = PIPE_W | PIPE_R | PIPE_RW
  type my_fd = {infd : Posix.IO.file_desc, outfd : Posix.IO.file_desc}
  type pinfo = { fd :my_fd, pid : Posix.Process.pid , t : pipe_type}

  val pids : pinfo list ref = ref []

  (* Implements popen(3) *)
  fun popen (cmd, t) =
    let val { infd = readfd, outfd = writefd } = Posix.IO.pipe ()
        val { infd = readfd2, outfd = writefd2 } = Posix.IO.pipe ()
        val base = {outfd = readfd, infd = writefd2 }
    in case (Posix.Process.fork (), t)
        of (NONE, t) => (* Child *)
       (( case t
           of PIPE_W => Posix.IO.dup2 { old = readfd2, new = Posix.FileSys.stdin }
            | PIPE_R => Posix.IO.dup2 { old = writefd, new = Posix.FileSys.stdout }
            | PIPE_RW => ( Posix.IO.dup2 { old = writefd, new = Posix.FileSys.stdout }
                         ; Posix.IO.dup2 { old = readfd2, new = Posix.FileSys.stdin })
        ; Posix.IO.close writefd
        ; Posix.IO.close readfd
        ; Posix.IO.close writefd2
        ; Posix.IO.close readfd2
        ; Posix.Process.execp ("/bin/sh", ["sh", "-c", cmd]))
        handle OS.SysErr (err, _) =>
               ( print ("Fatal error in child: " ^ err ^ "\n")
               ; OS.Process.exit OS.Process.failure ))
         | (SOME pid, t) => (* Parent *)
       let val fd = case t of PIPE_W => (Posix.IO.close readfd2
                                         ;Posix.IO.close writefd
                                         ;Posix.IO.close readfd
                                         ; base)
                            | PIPE_R => (Posix.IO.close writefd
                                         ;Posix.IO.close writefd2
                                         ;Posix.IO.close readfd2
                                         ; base)
                            | PIPE_RW =>  (Posix.IO.close writefd
                                         ; Posix.IO.close readfd2
                                         ; base)
           val _ = pids := ({ fd = fd, pid = pid, t=t } :: !pids)
       in fd end
    end

  (* Implements pclose(3) *)
  fun pclose fd =
    case List.partition (fn { fd = f, pid = _, t=t } => f = fd) (!pids)
     of ([], _) => NONE
      | ([{ fd = _, pid = pid ,t = t}], pids') =>
        let val _ = pids := pids'
        val status = Posix.Process.waitpid_nh (Posix.Process.W_CHILD pid, [])
        val _ = (case t of
           PIPE_W => Posix.IO.close (#infd fd)
         | PIPE_R => Posix.IO.close (#outfd fd)
         | PIPE_RW => (Posix.IO.close (#outfd fd);Posix.IO.close (#infd fd)))
        in status end
      | _ => raise Bind (* This should be impossible. *)
end

(*TODO proper name*)
structure Check :>
  sig
    val main_check : string ref -> bool
    val test : string
  end
   = 
struct
  
  fun check (inp)= let
    val cmd = "python3 sml/equiv/milp/milp.py"
    val f = Popen.popen(cmd, Popen.PIPE_RW)
    val _ = Posix.IO.writeVec (#infd f, Word8VectorSlice.full (Byte.stringToBytes (!inp)));
    val _ = Posix.Process.waitpid_nh (Posix.Process.W_ANY_CHILD, [])
    val output =  Substring.full (Byte.bytesToString (Posix.IO.readVec (#outfd f,10000)))
    
    val _ = Popen.pclose f
    val res = Substring.isSubstring "1" output
  in
    res
  end


  (*given a file with the starting facts, checks for a condition (defined in the starting facts)*)
  val main_check = check
  (*can be used to test stuff*)
  val test = "currently unused"
end
