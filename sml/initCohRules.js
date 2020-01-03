var cmd = require("node-cmd")
const cmd2 = require("child_process")

function initRules(connective_rules, init_rules, axiom_rules, res) {
    var sml_command = "Properties.init_coherence_print("+connective_rules+","+init_rules+","+axiom_rules+");\n"
    const smlTerminalInput = 
    "CM.make \"sml/unify.cm\";\n"
    +"Control.Print.printDepth :=100;\n"
    +"open datatypesImpl;\n"
    +sml_command
    +"OS.Process.exit(OS.Process.success);\n"
    console.log(sml_command)
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


module.exports = { initRules }