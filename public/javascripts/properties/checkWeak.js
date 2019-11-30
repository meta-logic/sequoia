function checkWeak() {
    
    $.get("/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var rule_list = []
        for (var i = 0; i < rules.length; i++) {
            var fin_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var fin_prem = "["
            for (var j = 0; j < rules[i].sml_prem.length; j++) {
                fin_prem += rules[i].sml_prem[j].replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;") + ", "
            }
            fin_prem = fin_prem.slice(0,-2) + "]"
            var rule_sml = "Rule(\""+rules[i].rule+"\",None,"+fin_conc+","+fin_prem+")"
            rule_list.push(rule_sml)
        }
        var rule_strings = "["
        for (var j = 0; j < rule_list.length; j++) {
            rule_strings += rule_smlInit + ","
        }
        rule_strings = rule_strings.slice(0,rule_strings.length-1) + "]"
        $.post("/weakenSides", { rules: rule_list }, function(data, status) {
            var output = data.output.split("###")
            var left_bools = output[0].split("$$$")
            var right_bools = output[1].split("$$$")
        })
    })
}