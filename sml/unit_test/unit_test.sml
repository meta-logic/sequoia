structure UnitTest = 
struct
    structure Q = QCheck
    structure G = Gen
    structure U = U_Pred
    structure AT = App_Pred
    structure D = datatypesImpl

    (* needed for QCheck function: *)
    (* reader: ('a gen * ('a -> string) option) *)
    (* 'a pred: 'a -> bool *)
    (* 'a prop: (string * 'a pred) *)
    


end
