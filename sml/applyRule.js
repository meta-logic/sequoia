var cmd = require("node-cmd")
const cmd2 = require("child_process")
const fs = require('fs')

function applyRule(rule, tree, id, res) {
    var sml_command = "treefuncImpl.translate_premises("+tree+","+rule+","+id+");\n"
    const smlTerminalInput = 
    "CM.make \"sml/unify.cm\";\n"
    +"Control.Print.printDepth :=100;\n"
    +"open datatypesImpl;\n"
    +sml_command
    +"OS.Process.exit(OS.Process.success);\n"
    console.log(sml_command)
    const processRef = cmd2.spawn("sml")
    processRef.stdin.write(smlTerminalInput)
    processRef.on('close', function (code) {
        try {
            fs.readFile('sml/test.sml', (err, data) => {
            var answer = data.toString()
            try {
                fs.unlinkSync('sml/test.sml')
                return res.status(200).json({
                    status: 'success',
                    output: answer
                })
            } catch(err) {
                console.error(err)
            }
        })
        } catch(err) {
            console.error(err)
        }
    })
        
}


module.exports = { applyRule }