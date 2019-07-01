Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0})
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
    }, [])
}

function extraArguments(a, b) {

    var argumentsDup = []

    argumentsDup.push(b.diff(a))

    argumentsDup = flatten(argumentsDup)
    return Array.from(new Set(argumentsDup))

}

var parser_text = 
`
//Seq
SEQ = ctx1:CTX _ arrow:ARROW _ ctx2:CTX {return "(" + ctx1 + ', Con ("' + arrow + '"), ' + ctx2 + ")"}
/ CTX

//context
CTX =  list:List _ sep:SEP _ ctx:CTX 
{return "Mult (" + list + ', Con ("' + sep + '"), ' + ctx + ")"}
/ list:List {return "Single (" + list + ")" }

List = 
set:SET _ "," _ list:List {
    if (list.includes("::nil")) {
        return list.slice(0, -5) + "::" + set}
    else {
        return list + "::" + set
    }
}/
form:F _ "," _ list:List _ {return form + "::" + list}/
set:SET {return set} /
form:F {return form + "::nil"} 

//Formula
F = 
_ uconn:UCONN _ "(" _ form1:F _ ")" _ conn:CONN _ form2:F _  {return "(Form (Uform (" + uconn + ", " + form1 + "), " + conn + ", " + form2 + "))"} /
_ "(" _ form1:F _ ")" _ conn:CONN _ form2:F _  {return "(Form (" + form1 + ", " + conn + ", " + form2 + "))"} /
_ uconn:UCONN _ "(" _ form:F _ ")" _  {return "Uform (" + uconn + ", " + form + ")"} /
_ "(" _ form:F _ ")" _  {return form} /
_ UConn:UCONN _ fotom:FOTOM _ conn:CONN _ formula:F _ {return "Form (Uform (" + UConn + ", " + fotom + "), " + conn + ", " + formula + ")"} /
_ UConn:UCONN _ fotom:FOTOM _ {return "Uform (" + UConn + ", " + fotom + ")"} /
_ fotom:FOTOM _ conn:CONN _ formula:F _ {return "(Form (" + fotom + ", " + conn + ", " + formula + "))" } /
_ fotom:FOTOM _ {return fotom}


//Form_Atom
FOTOM = FORM / ATOM


//symbols
UCONN = conn:UConn {return 'Con ("' + conn  + '")'}
CONN = conn:Conn {return 'Con ("' + conn  + '")'}
FORM = form:Form {return "Form (" + form + ")"}
ATOM = atom:Atom {return "Atom (" + atom + ")"}


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

function prem_conc_symbols(text) {
    text = text.replace(/,/g, "").split(" ")
    text = text.filter(function (symbol) {
        return symbol && symbols[symbol] != "connective"
    })
    return text
}

function addNumber(conc, symbol) {
    var count = 0
    while (conc != conc.replace("(" + symbol + ")", "")) {

        conc = conc.replace("(" + symbol + ")", "(" + symbol + count + ")")
        console.log(conc)

        count++
    }

    conc = conc.replace(symbol+0, symbol)

    return conc
}

function uniqeSymbols(conc, symbols) {
    for (var i = 0; i < symbols.length; i++) {
        conc = addNumber(conc, symbols[i])
    }
    return conc
}

function addRule() {
    parser_text = parser_copy
    addSymbols()
    getSymbols()
    var parser = peg.generate(parser_text)
    var prem = []
    var rule = document.getElementById("rule_connective").value
    // adding premises
    prem.push(document.getElementById("i0").value)
    for (var i = 1; i <= v; i++) {
        prem.push(document.getElementById("i" + i.toString()).value)
    }

    // conclusion
    var conc = document.getElementById("Conclusion").value
    var prem_sym = []
    var parsed_prem = []
    if (prem[0] != ""){

        console.log("premises:")
        for (i = 0; i < prem.length; i++) {
            console.log(parser.parse(prem[i]))
            console.log(prem_conc_symbols(prem[i]))
            prem_sym.push(prem_conc_symbols(prem[i]))
            parsed_prem.push(parser.parse(prem[i]))
        }
    }


    console.log("Conclusion:")
    console.log(parser.parse(conc))
    console.log(prem_conc_symbols(conc))
    var conc_final = uniqeSymbols(parser.parse(conc), prem_conc_symbols(conc))
    console.log(conc_final)

    //toString check
    var toString = "ctx"
    if (Object.values(symbolsTypes).includes("primary separator")) {
        toString  = "seq"
    }

    $.ajax({
        url: "/api/rule",
        type: "PUT",
        data : { id : document.getElementById("id").innerHTML , rule : rule, 
            conclusion : conc, premises : JSON.stringify(prem), parsed_conc : conc_final , toString : toString,
            parsed_prem : JSON.stringify(parsed_prem) , conc : JSON.stringify(prem_conc_symbols(conc)), 
            prem : JSON.stringify(prem_sym)},
        success: function(result) {
            console.log("Rule added successfully.")
            console.log(result)
        },
        error: function(result) {
            console.log("ERROR: could not add rule.")
            console.log(result)
        }
    })



    if (DBSymbols != null) {
        var extra = Object.keys(symbolsTypes)
        if (extra.length != 0) {
            for (i = 0; i < extra.length; i++) {
                DBSymbols[extra[i]] = symbolsTypes[extra[i]]
            }
            $.ajax({
                url: "/api/symbols",
                type: "PUT",
                data : {update : JSON.stringify({symbols : DBSymbols})},
                success: function (result) {
                    console.log(result)
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
            }
        })
    }

}



