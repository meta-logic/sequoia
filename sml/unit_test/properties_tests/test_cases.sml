structure TestCases = 
struct
    structure R = Rules
    structure D = datatypesImpl
    

    type results = RT.results

    val permute_cases = PTCases.permute_cases
    val weakening_cases = WTCases.weakening_cases
    val id_expansion_cases = IDTCases.id_expansion_cases
    val cut_elim_axiom_cases = CETCases.cut_elim_axiom_cases
    val cut_elim_rank_cases = CETCases.cut_elim_rank_cases
    val cut_elim_grade_cases = CETCases.cut_elim_grade_cases
    val cut_elim_cases = CETCases.cut_elim_cases
end