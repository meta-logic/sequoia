var parser_copy = pt
var parser = ""
var seq_symbols = {}

function clear() {
    document.getElementById("seq").remove()
    document.getElementById("apply").remove()
    document.getElementById("table").remove()
    document.getElementById("warning").innerHTML =""
}

function useSequent() {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "

    $.get("/api/get-certain_symbols", function(sb, status) {
        syms = sb
        syms = syms.sort(function(a, b){
            return b.symbol.length - a.symbol.length
        })
        for (var i = 0; i < syms.length; i++) {
            var symbol = syms[i].symbol
            var type = syms[i].type
            if (symbol.includes("\\")) {
                symbol = "\\" + symbol
            }
            if (type == "sequent sign") {
                arrow += "/ \"" + symbol + "\" "
            }
            else if (type == "context separator") {
                sep += "/ \"" + symbol + "\" "
            }
            else if (type == "connective") {
                conn += "/ \"" + symbol + "\" "
            }
            else if (type == "context variable") {
                set += "/ \"" + symbol + "\" "
            }
            else if (type == "formula variable") {
                form += "/ \"" + symbol + "\" "
            }
            else if (type == "atom variable") {
                atom_var += "/ \"" + symbol + "\" "
            }
            else if (type == "atom") {
                atom += "/ \"" + symbol + "\" "
            }
        }
    extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    var temp_parser = peg.generate(parser_text)
    parse_and_use(temp_parser)
    })
}


function parse_and_use(temp_parser) {
    var warning_text = "<div id=\"parse warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Unrecognized Symbols</div>"+
    "<p>All symbols used in calculus should be inputted to table</p></div>"
    
    var sequent = document.getElementById("Sequent").value.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
    try {
        var sequent_final = temp_parser.parse(sequent).replace(/\\/g, "\\\\")
    }   
    catch(error) {
        var warning = document.getElementById("warning")
        warning.innerHTML = warning_text
        return
    }
    clear()
    parser = temp_parser
    var undo_button = document.getElementById("undo")
    undo_button.innerHTML += "<button class=\"ui fluid huge icon button red\" onclick=\"undo()\"><i class=\"icon undo\"></i></button>"
    $(".conc-temp").click(function() {
        leaf_id = this.id.split("_")[1]
        seq_text = $(this).find("script")[0].innerText
        console.log(seq_text)
    })
    document.getElementById("style").innerHTML = 
    "<style> td {text-align:center;height: 1em;vertical-align:bottom;}"+
        "td.conc {border-top: solid 1px;} div.rulename {margin-top:-2em;}"+
        "td.prem {}.MJXc-display, .MathJax_Display {margin:0px !important;} </style>"
}
