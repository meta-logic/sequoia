(*  Sequoia  Copyright (C) 2020  Zan Naeem
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure htmlImpl : EXPORTHTML = struct

    structure Dat = datatypesImpl
    structure D = Dat

    type der_tree = Dat.der_tree

    structure App = applyunifierImpl

    fun der_tree_toHtml (D.DerTree(id, s, NONE, pq)) =
            "<div id=\"prooftree_"^id^"\" class=\"tree\">"^
                "<div id=\"exp_"^id^"\" class=\"sequence\">"^
                    "<div id=\"conc_"^id^"\" class=\"leaf\">$$"^(D.seq_toString s)^"$$</div>"^
                "</div>"^
            "</div>"
        | der_tree_toHtml (D.DerTree(id, s, SOME nm, [])) = 
            "<div id=\"prooftree_"^id^"\" class=\"tree\">"^
                "<div id=\"exp_"^id^"\" class=\"sequence\">"^
                    "<div id=\"delete_"^id^"\" class=\"premises\"></div>"^
                    "<div id=\"conc_"^id^"\" class=\"conclusion\">$$"^(D.seq_toString s)^"$$</div>"^
                "</div>"^
                "<div id=\"applied_"^id^"\" class=\"rule\">$$\\scriptsize{"^nm^"}$$</div>"^
            "</div>"
        | der_tree_toHtml (D.DerTree(id, s, SOME nm, pq)) = 
            "<div id=\"prooftree_"^id^"\" class=\"tree\">"^
                "<div id=\"exp_"^id^"\" class=\"sequence\">"^
                    "<div id=\"delete_"^id^"\" class=\"premises\">"^(List.foldl(fn (prem, st) => st^(der_tree_toHtml prem))("")pq)^"</div>"^
                    "<div id=\"conc_"^id^"\" class=\"conclusion\">$$"^(D.seq_toString s)^"$$</div>"^
                "</div>"^
                "<div id=\"applied_"^id^"\" class=\"rule\">$$\\scriptsize{"^nm^"}$$</div>"^
            "</div>"

    fun der_tree_toHtml2 (D.DerTree(id, s, NONE, pq)) =
            "DerTree(\""^id^"\", "^(D.seq_stringify s)^", NONE, [])"
        | der_tree_toHtml2 (D.DerTree(id, s, SOME nm, [])) = 
            "DerTree(\""^id^"\", "^(D.seq_stringify s)^", SOME(\""^nm^"\"), [])"
        | der_tree_toHtml2 (D.DerTree(id, s, SOME nm, pq)) = 
            "DerTree(\""^id^"\", "^(D.seq_stringify s)^", SOME(\""^nm^"\"), ["^(String.concatWith (",") (List.map(der_tree_toHtml2)pq))^"])"

end