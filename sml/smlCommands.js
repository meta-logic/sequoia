const cmd2 = require("child_process")

function smlInvoke(sml_command, res) {
    const smlTerminalInput = 
    "CM.make \"sml/unify.cm\";\n"
    +"Control.Print.printDepth :=100;\n"
    +"open datatypesImpl;\n"
    +sml_command
    +"OS.Process.exit(OS.Process.success);\n"
    var processRef = cmd2.spawn("sml",[],{stdio: ['pipe' , 'inherit' , 'ignore' , 'pipe' ] })
    processRef.stdio[3].on('data' , (data) => {
        try {
            var answer = data.toString()
            try {
                return res.status(200).json({
                    status: 'success',
                    output: answer
                })
            } catch(err) {
                console.error(err)
            }
        } catch(err) {
            console.error(err)
        }
    })
    processRef.stdin.write(smlTerminalInput)
}

function applyRule(rule, tree, id, index, subs, res) {
    var sml_command = "treefuncImpl.translate_premises("+tree+","+rule+","+id+","+index+","+subs+");\n"
    smlInvoke(sml_command, res)
}

function initRules(connective_rules, init_rules, axiom_rules, res) {
    var sml_command = "Properties.init_coherence_print("+connective_rules+","+init_rules+","+axiom_rules+");\n"
    smlInvoke(sml_command, res)
}

function weakenSides(rules, res) {
    var sml_command = "Properties.weakening_print("+rules+");\n"
    smlInvoke(sml_command, res)
}

function permuteRules(rule1, rule2, init_rules, wL, wR, res) {
    var sml_command = "Properties.permute_print("+rule1+","+rule2+","+init_rules+",("+wL+","+wR+"));\n"
    smlInvoke(sml_command, res)
}


module.exports = { smlInvoke, applyRule, initRules, weakenSides, permuteRules }