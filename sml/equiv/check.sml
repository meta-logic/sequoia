structure Popen :>
      sig
          (* Parent wants to write to stdin, read stdout, or read stdout + stderr *)
          datatype pipe_type = PIPE_W | PIPE_R | PIPE_RE
          val popen : string * pipe_type -> Posix.IO.file_desc
          val pclose : Posix.IO.file_desc -> (Posix.Process.pid*Posix.Process.exit_status) option
      end =
struct

  datatype pipe_type = PIPE_W | PIPE_R | PIPE_RE

  type pinfo = { fd : Posix.ProcEnv.file_desc, pid : Posix.Process.pid }

  val pids : pinfo list ref = ref []

  (* Implements popen(3) *)
  fun popen (cmd, t) =
    let val { infd = readfd, outfd = writefd } = Posix.IO.pipe ()
    in case (Posix.Process.fork (), t)
        of (NONE, t) => (* Child *)
       (( case t
           of PIPE_W => Posix.IO.dup2 { old = readfd, new = Posix.FileSys.stdin }
            | PIPE_R => Posix.IO.dup2 { old = writefd, new = Posix.FileSys.stdout }
            | PIPE_RE => ( Posix.IO.dup2 { old = writefd, new = Posix.FileSys.stdout }
                         ; Posix.IO.dup2 { old = writefd, new = Posix.FileSys.stderr })
        ; Posix.IO.close writefd
        ; Posix.IO.close readfd
        ; Posix.Process.execp ("/bin/sh", ["sh", "-c", cmd]))
        handle OS.SysErr (err, _) =>
               ( print ("Fatal error in child: " ^ err ^ "\n")
               ; OS.Process.exit OS.Process.failure ))
         | (SOME pid, t) => (* Parent *)
       let val fd = case t of PIPE_W => (Posix.IO.close readfd; writefd)
                            | PIPE_R => (Posix.IO.close writefd; readfd)
                            | PIPE_RE => (Posix.IO.close writefd; readfd)
           val _ = pids := ({ fd = fd, pid = pid } :: !pids)
       in fd end
    end

  (* Implements pclose(3) *)
  fun pclose fd =
    case List.partition (fn { fd = f, pid = _ } => f = fd) (!pids)
     of ([], _) => NONE
      | ([{ fd = _, pid = pid }], pids') =>
        let val _ = pids := pids'
        val status = Posix.Process.waitpid_nh (Posix.Process.W_CHILD pid, [])
        val _ = Posix.IO.close fd
        in status end
      | _ => raise Bind (* This should be impossible. *)
end

(*TODO proper name*)
structure Check :>
  sig
    val main_check : string -> bool
    val test : string
  end
   = 
struct
  
  fun check (cmd)= let
    val f = Popen.popen(cmd, Popen.PIPE_R)
    val _ = Posix.Process.waitpid_nh (Posix.Process.W_ANY_CHILD, [])
    val output = Substring.full (Byte.bytesToString (Posix.IO.readVec (f,1)))
    val _ = Popen.pclose f
  in
    Substring.isSubstring "1" output
  end


  (*given a file with the starting facts, checks for a condition (defined in the starting facts)*)
  fun main_check (file) = check ("python3 ../equiv/milp/milp.py "^file)

  (*can be used to test stuff*)
  val test = "currently unused"
end
