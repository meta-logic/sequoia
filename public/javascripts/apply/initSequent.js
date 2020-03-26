var parser_copy = pt
var parser = ""
var formula_parser = ""

function useSequent() {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    var calc_id = $("#calc_id").text()
    $.get("/api/parsing_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
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
    var extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    var temp_parser = peg.generate(parser_text)
    parse_and_use(temp_parser)
    })
}


function parse_and_use(temp_parser) {
    var sequent = $("#Sequent").val().replace(/\(/g, " ( ").replace(/\)/g, " ) ")
    try {
        temp_parser.parse(sequent)
    }
    catch(error) {
        $("#warning_header").html("Sequent Parsing Error")
        $("#warning_text").html("Sequents must be structurally valid and contain term symbols from the sequent term symbols table.")
        $("#warning").css("visibility","visible")
        return
    }
    $("#seq").css("display","none")
    $("#submit").css("visibility","hidden")
    $("#warning").css("visibility","hidden")
    $("#export").attr("class","ui fluid huge icon button green")
    $("#undo").attr("class","ui fluid huge icon button red")
    parser = temp_parser
    $(".leaf").click(function() {
        leaf_id = this.id.split("_")[1]
        seq_text = $(this).find("script")[0].innerText
        $("#warning").css("visibility","hidden")
    })
}
