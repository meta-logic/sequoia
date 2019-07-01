var parser_text = 
`
// Sequent
SEQ 
  = ctx1:CTX _ arrow:ARROW _ ctx2:CTX { return "(" + ctx1 + ', Con ("' + arrow + '"), ' + ctx2 + ")" }
  / CTX

// Context
CTX 
  = list:List _ sep:SEP _ ctx:CTX { return "Mult (" + list + ', Con ("' + sep + '"), ' + ctx + ")" }
  / list:List { return "Single (" + list + ")" }

List 
  = set:SET _ "," _ list:List {
      if (list.includes("::nil")) {
        return list.slice(0, -5) + "::" + set}
      else {
        return list + "::" + set
      }
    }
  / form:F _ "," _ list:List _ { return form + "::" + list }
  / set:SET { return set } 
  / form:F { return form + "::nil" } 

// Formula
F 
  = _ uconn:UCONN _ "(" _ form1:F _ ")" _ conn:CONN _ form2:F _  { return "(Form (Uform (" + uconn + ", " + form1 + "), " + conn + ", " + form2 + "))" } 
  / _ "(" _ form1:F _ ")" _ conn:CONN _ form2:F _  { return "(Form (" + form1 + ", " + conn + ", " + form2 + "))" } 
  / _ uconn:UCONN _ "(" _ form:F _ ")" _  { return "Uform (" + uconn + ", " + form + ")" } 
  / _ "(" _ form:F _ ")" _  { return form } 
  / _ UConn:UCONN _ fotom:FOTOM _ conn:CONN _ formula:F _ { return "Form (Uform (" + UConn + ", " + fotom + "), " + conn + ", " + formula + ")" } 
  / _ UConn:UCONN _ fotom:FOTOM _ { return "Uform (" + UConn + ", " + fotom + ")" } 
  / _ fotom:FOTOM _ conn:CONN _ formula:F _ { return "(Form (" + fotom + ", " + conn + ", " + formula + "))" } 
  / _ fotom:FOTOM _ { return fotom }

// Atomic formula
FOTOM 
  = FORM 
  / ATOM

// Symbols
UCONN = conn:UConn { return 'Con ("' + conn  + '")' }
CONN = conn:Conn { return 'Con ("' + conn  + '")' }
FORM = form:Form { return "Form (" + form + ")" }
ATOM = atom:Atom { return 'Atom ("' + atom + '")' }

_ "whitespace"
  = [ ]*

`
var parser_copy = parser_text 

var symbols = {}
var symbolsTypes = {}
function addSymbols() {
    var table_symbols = document.getElementsByClassName("ui search dropdown selection")
    for (var i = 0; i < table_symbols.length; i++) {
        var symbol = document.getElementById("t" + i).getElementsByTagName("script")[0].innerHTML
        var type = table_symbols[i].getElementsByClassName("text")[0].innerHTML
        if (type == "primary separator" || type == "separator") {
            symbolsTypes[symbol] = type
            type = "connective"
        } else {
            symbolsTypes[symbol] = type
        }



        symbols[symbol] = type
    }

}

function clear() {
    var seq = document.getElementById("seq")
    seq.innerHTML = ""
    var preview = document.getElementById("preview")
    preview.innerHTML = ""
    var table = document.getElementById("table")
    table.innerHTML = ""
}

function getSymbols() {
    var arrow = "ARROW = \"NO-ARROW\" "
    var sep = "SEP = \"NO-SEP\" "
    var uconn = "UConn = \"NO-UConn\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "SET = \"NO-SET\" "
    var form = "Form = \"NO-FORM\" "
    var atom = "Atom = \"NO-ATOM\" "
    var table_symbols = document.getElementsByClassName("ui search dropdown selection")
    for (var i = 0; i < table_symbols.length; i++) {
        var symbol = document.getElementById("t" + i).getElementsByTagName("script")[0].innerHTML
        var type = table_symbols[i].getElementsByClassName("text")[0].innerHTML
        if (symbol.includes("\\")) {
            symbol = "\\" + symbol
        }
        if (type == "primary separator") {
            arrow += "/ \"" + symbol + "\" "
        }

        if (type == "separator") {
            sep += "/ \"" + symbol + "\" "
        }

        if (type == "unary") {
            uconn += "/ \"" + symbol + "\" "
        }

        if (type == "connective") {
            conn += "/ \"" + symbol + "\" "
        }

        if (type == "set") {
            set += "/ \"" + symbol + "\" "
        }

        if (type == "formula") {
            form += "/ \"" + symbol + "\" "
        }

        if (type == "atom") {
            atom += "/ \"" + symbol + "\" "
        }
    }
    parser_text += arrow + "\n" + sep + "\n" + uconn + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom + "\n" 
    console.log(parser_text)
}

function prem_sequent_symbols(text) {
    text = text.replace(/,/g, "").split(" ")
    text = text.filter(function (symbol) {
        return symbol && symbols[symbol] != "connective"
    })
    return text
}



parser = ""
function apply() {
    parser_text = parser_copy
    addSymbols()
    getSymbols()
    parser = peg.generate(parser_text)
    var prem = []



    // sequent
    var sequent = document.getElementById("Sequent").value.replace(/\(/g, "").replace(/\)/g, "")


    console.log("Sequent:")
    // console.log(parser.parse(sequent));
    // console.log(prem_sequent_symbols(sequent));
    var sequent_final = parser.parse(sequent).replace(/\\/g, "\\\\")
    console.log(sequent_final)



    //toString check
    var toString = "ctx"
    if (Object.values(symbolsTypes).includes("primary separator")) {
        toString  = "seq"
    }


    if (DBSymbols != null) {
        var update
        var extra = Object.keys(symbolsTypes)
        if (extra.length != 0) {
            for (var i = 0; i < extra.length; i++) {
                DBSymbols[extra[i]] = symbolsTypes[extra[i]]
            }
            $.ajax({
                url: "/api/symbols",
                type: "PUT",
                data : {update : JSON.stringify({symbols : DBSymbols})},
                success: function (result) {
                    console.log(result)
                    clear()
                }
            })
        } 
    } else {
        $.ajax({
            url: "/api/symbols",
            type: "PUT",
            data : {update : JSON.stringify({symbols : symbolsTypes})},
            success: function (result) {
                console.log(result)
                clear()
            }
        })
    }

    

    console.log("symbols:")
    console.log(DBSymbols)

}
