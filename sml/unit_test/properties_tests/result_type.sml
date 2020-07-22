structure RT =
struct
    (* yes if all the cases are positive *)
    (* no if all the cases are negative *)
    (* maybe for some positive and some negative cases *)
    datatype results = Yes | No | Maybe
end