structure htmlImpl : EXPORTHTML = struct

    structure Dat = datatypesImpl

    type dev_tree = Dat.dev_tree
    
    structure App = applyunifierImpl

    fun dev_tree_toHtml(Dat.DevTree(id, s, Dat.NoRule, pq)) = 
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
    | dev_tree_toHtml(Dat.DevTree(id, s, Dat.RuleName nm, [])) = 
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
    | dev_tree_toHtml(Dat.DevTree(id, s, Dat.RuleName nm, pq)) = 
        "<table>\n"^
            "<tr>\n"^
            List.foldl(fn (prem, txt) => txt^
                "<td>\n"^dev_tree_toHtml prem^"</td>\n")("")pq^
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
            val html_tree = (dev_tree_toHtml tree)
            val _ = TextIO.output (fd, html_tree) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

end