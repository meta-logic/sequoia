structure UnitTest = 
struct
    structure D = DatatypesTest
    structure Q = QCheck
    structure G = Gen
    structure U = U_Pred
    structure AP = App_Pred
    structure TP = T_Pred
    structure D = datatypesImpl
    structure OK = OrdKeysTest
    structure DT = DatatypesTest
    structure HT = HelpersTest
    structure PT = PropertiesTest

    (* needed for QCheck function: *)
    (* reader: ('a gen * ('a -> string) option) *)
    (* 'a pred: 'a -> bool *)
    (* 'a prop: (string * 'a pred) *)
    


end
