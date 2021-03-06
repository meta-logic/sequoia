structure Rules = 
struct
    structure D = datatypesImpl
    
    val A = D.FormVar("Ar")
    val B = D.FormVar("Br")
    val C = D.FormVar("Cr")
    val G1 = D.CtxVar(NONE, "G1")
    val G2 = D.CtxVar(NONE, "G2")
    val G3 = D.CtxVar(NONE, "G3")
    val G4 = D.CtxVar(NONE, "G4")
    val D1 = D.CtxVar(NONE, "D1")
    val and_con = D.Con("\\wedge")
    val or_con = D.Con("\\vee")
    val imp_con = D.Con("\\supset")
    val seq_con = D.Con("\\vdash")

    val id = 
        let
            val left_side = D.Single(D.Ctx([G1],[A]))
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[A])))    
        in
            D.Rule("id",D.None,conc,[])
        end
    
    val id_no_ctx = 
        let
            val left_side = D.Single(D.Ctx([],[A]))
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[A])))    
        in
            D.Rule("id",D.None,conc,[])
        end


    val andR = 
        let
            val left_side = D.Single(D.Ctx([G1],[]))
            val and_form = D.Form(and_con,[A,B])
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[and_form])))    
            val prem1 = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[A])))    
            val prem2 = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[B])))    
        in
            D.Rule("\\wedge_R",D.Right,conc,[prem1,prem2])
        end
    
    val andRs = 
        let
            val left_side_conc = D.Single(D.Ctx([G1,G2],[]))
            val left_side_prem1 = D.Single(D.Ctx([G1],[]))
            val left_side_prem2 = D.Single(D.Ctx([G2],[]))
            val and_form = D.Form(and_con,[A,B])
            val conc = D.Seq(left_side_conc,seq_con,D.Single(D.Ctx([],[and_form])))    
            val prem1 = D.Seq(left_side_prem1,seq_con,D.Single(D.Ctx([],[A])))    
            val prem2 = D.Seq(left_side_prem2,seq_con,D.Single(D.Ctx([],[B])))    
        in
            D.Rule("\\wedge_R",D.Right,conc,[prem1,prem2])
        end

    val andL = 
        let
            val right_side = D.Single(D.Ctx([],[C]))
            val and_form = D.Form(and_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1],[and_form])),seq_con,right_side)    
            val prem = D.Seq(D.Single(D.Ctx([G1],[A,B])),seq_con,right_side)
        in
            D.Rule("\\wedge_L",D.Left,conc,[prem])
        end

    val orR1 = 
        let
            val left_side = D.Single(D.Ctx([G1],[]))
            val or_form = D.Form(or_con,[A,B])
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[or_form])))    
            val prem1 = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[A])))    
        in
            D.Rule("\\vee_R1",D.Right,conc,[prem1])
        end

    val orR2 = 
        let
            val left_side = D.Single(D.Ctx([G1],[]))
            val or_form = D.Form(or_con,[A,B])
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[or_form])))    
            val prem1 = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[B])))    
        in
            D.Rule("\\vee_R2",D.Right,conc,[prem1])
        end

    val orLc = 
        let
            val right_side = D.Single(D.Ctx([],[C]))
            val or_form = D.Form(or_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1],[or_form])),seq_con,right_side)    
            val prem1 = D.Seq(D.Single(D.Ctx([G1],[A])),seq_con,right_side)    
            val prem2 = D.Seq(D.Single(D.Ctx([G1],[B])),seq_con,right_side)    
        in
            D.Rule("\\vee_Lc",D.Left,conc,[prem1,prem2])
        end

    val orLs = 
        let
            val right_side = D.Single(D.Ctx([],[C]))
            val or_form = D.Form(or_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1,G2],[or_form])),seq_con,right_side)    
            val prem1 = D.Seq(D.Single(D.Ctx([G1],[A])),seq_con,right_side)    
            val prem2 = D.Seq(D.Single(D.Ctx([G2],[B])),seq_con,right_side)    
        in
            D.Rule("\\vee_Ls",D.Left,conc,[prem1,prem2])
        end

    val impR = 
        let
            val imp_form = D.Form(imp_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1],[])),seq_con,D.Single(D.Ctx([],[imp_form])))
            val prem = D.Seq(D.Single(D.Ctx([G1],[A])),seq_con,D.Single(D.Ctx([],[B])))
        in
            D.Rule("\\supset_R",D.Right,conc,[prem])
        end
    val impL = 
        let
            val imp_form = D.Form(imp_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1],[imp_form])),seq_con,D.Single(D.Ctx([],[C])))
            val prem1 = D.Seq(D.Single(D.Ctx([G1],[])),seq_con,D.Single(D.Ctx([],[A])))
            val prem2 = D.Seq(D.Single(D.Ctx([G1],[B])),seq_con,D.Single(D.Ctx([],[C])))
        in
            D.Rule("\\supset_L",D.Left,conc,[prem1,prem2])
        end
    
    val impLs = 
        let
            val imp_form = D.Form(imp_con,[A,B])
            val conc = D.Seq(D.Single(D.Ctx([G1,G2],[imp_form])),seq_con,D.Single(D.Ctx([],[C])))
            val prem1 = D.Seq(D.Single(D.Ctx([G1],[])),seq_con,D.Single(D.Ctx([],[A])))
            val prem2 = D.Seq(D.Single(D.Ctx([G2],[B])),seq_con,D.Single(D.Ctx([],[C])))
        in
            D.Rule("\\supset_L",D.Left,conc,[prem1,prem2])
        end

    val split_left = 
        let
            val conc = D.Seq(D.Single(D.Ctx([G1,G2],[])),seq_con,D.Single(D.Ctx([D1],[])))
            val prem1 = D.Seq(D.Single(D.Ctx([G1],[])),seq_con,D.Single(D.Ctx([D1],[])))
            val prem2 = D.Seq(D.Single(D.Ctx([G2],[])),seq_con,D.Single(D.Ctx([D1],[])))
        in
            D.Rule("split_L",D.Left,conc,[prem1,prem2])
        end
    
    val copy = 
        let
            val conc = D.Seq(D.Single(D.Ctx([G1],[])),seq_con,D.Single(D.Ctx([D1],[])))
        in
            D.Rule("copy",D.None,conc,[conc])
        end

    val cut = 
        let
            val left_side = D.Single(D.Ctx([G3,G4],[]))
            val conc = D.Seq(left_side,seq_con,D.Single(D.Ctx([],[C])))    
            val prem1 = D.Seq(D.Single(D.Ctx([G3],[])),seq_con,D.Single(D.Ctx([],[A])))    
            val prem2 = D.Seq(D.Single(D.Ctx([G4],[A])),seq_con,D.Single(D.Ctx([],[C])))
        in
            D.Rule("cut",D.None,conc,[prem1,prem2])
        end
    
    val cut_form = A

    val rules = #[andR,andL,orR1,orR2,orLc,orLs,impR,impL]
    
end