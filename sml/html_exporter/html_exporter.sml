(*  Sequoia  Copyright (C) 2020  Zan Naeem
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure htmlImpl : EXPORTHTML = struct

    structure Dat = datatypesImpl

    type der_tree = Dat.der_tree
    
    structure App = applyunifierImpl

    fun der_tree_toHtml(Dat.DerTree(id, s, Dat.NoRule, pq)) = 
    "<table>\n"^
        "<tr>\n"^
            "<td></td>\n"^
            "<td class=\"rulename\" rowspan=\"2\">\n"^
                "<div class=\"rulename\"></div>\n"^
            "</td>\n"^
        "</tr>\n"^
        "<tr>\n"^
            "<td class=\"prem\">"^Dat.seq_toString s^"</td>\n"^
        "</tr>\n"^
    "</table>\n"
    | der_tree_toHtml(Dat.DerTree(id, s, Dat.RuleName nm, [])) = 
    "<table>\n"^
        "<tr>\n"^
            "<td></td>\n"^
            "<td class=\"rulename\" rowspan=\"2\">\n"^
                "<div class=\"rulename\">"^nm^"</div>\n"^
            "</td>\n"^
        "</tr>\n"^
        "<tr>\n"^
            "<td class=\"conc\">"^Dat.seq_toString s^"</td>\n"^
        "</tr>\n"^
    "</table>\n"
    | der_tree_toHtml(Dat.DerTree(id, s, Dat.RuleName nm, pq)) = 
        "<table>\n"^
            "<tr>\n"^
            List.foldl(fn (prem, txt) => txt^
                "<td>\n"^der_tree_toHtml prem^"</td>\n")("")pq^
            "<td class=\"rulename\" rowspan=\"2\">\n"^
                    "<div class=\"rulename\">"^nm^"</div>\n"^
                "</td>\n"^
            "</tr>\n"^
            "<tr>\n"^
                "<td class=\"conc\" colspan="^Int.toString(List.length(pq))^">"^Dat.seq_toString s^"</td>\n"^
            "</tr>\n"^
        "</table>\n"

    fun export_toHtml filename tree =
        let val fd = TextIO.openOut filename
            val html_tree = (der_tree_toHtml tree)
            val _ = TextIO.output (fd, html_tree) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

end