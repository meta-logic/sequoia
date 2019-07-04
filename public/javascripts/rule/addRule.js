var parser_text = 
`
// Sequent
SEQ 
  = _ ctx1:CTX_STR _ seq_sign:SeqSign _ ctx2:CTX_STR _{ return "Seq (" + ctx1 + ', Con ("' + seq_sign + '"), ' + ctx2 + ")" }

// Context struct
CTX_STR 
  = ctx:CTX _ ctx_sep:CtxSep _ ctx_str:CTX_STR { return "Mult ( Con (" + ctx_sep + "), " + ctx + ", " + ctx_str + ")" }
  / ctx:CTX { return "Single (" + ctx + ")" } 

// Context
CTX 
  = ctx_lst:CTX_LST { 
    var [ctx_vars, forms] = ctx_lst
    var c = ctx_vars.join(", ")
    var f = forms.join(", ")
    return "Ctx ([" + c + "], [" + f + "])"
  }

CTX_LST
  = ctx_var:CTX_VAR _ "," _ ctx_lst:CTX_LST {
      var [ctx_vars, forms] = ctx_lst
      ctx_vars.push(ctx_var)
      return [ctx_vars, forms]
    }
  / form:FORM _ "," _ ctx_lst:CTX_LST _ { 
      var [ctx_vars, forms] = ctx_lst
      forms.push(form)
      return [ctx_vars, forms]
    }
  / ctx_var:CTX_VAR { return [[ctx_var], []] } 
  / form:FORM { return [[], [form]] } 

// Formula 
FORM = BIFORM / GENFORM  

FORM_LIST 
  = _ form:FORM _ "," _ form_lst:FORM_LIST _ { 
  	  form_lst.push(form)
      return form_lst 
    }
  / _ form:FORM _ { return [form] }

BIFORM
  = fr:GENFORM _ conn:CONN _ fr2:FORM 
  { return "Form (" + conn + ", [" + fr + "," + fr2 + "])" }

GENFORM
  = "(" _ form:FORM _ ")" { return form }
  / conn:CONN _ form:GENFORM { return "Form (" + conn + ", [" + form + "])" }
  / conn:CONN _ "(" _ fls:FORM_LIST _ ")" {return 'Form(' + conn + ",[" + fls.join(", ") + "])"}
  / form_var:FORM_VAR { return form_var }
  / atom_var:ATOM_VAR { return atom_var }
  / atom:ATOM { return atom }

// Symbols
CONN = conn:Conn { return 'Con ("' + conn  + '")' }
CTX_VAR = ctx_var:CtxVar { return 'CtxVar ("' + ctx_var + '")' }
FORM_VAR = form_var:FormVar { return 'FormVar ("' + form_var + '")' }
ATOM_VAR = atom_var:AtomVar { return 'AtomVar ("' + atom_var + '")' }
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
            sep = symbol
            type = "connective"
        } else {
            symbolsTypes[symbol] = type
        }



        symbols[symbol] = type
    }

}

function getSymbols() {
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom = "AtomVar = \"NO-ATOM\" "
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
    conc = $.trim(conc)
    console.log(conc)

    var prem_sym = []
    var parsed_prem = []

    if (prem[0] != "" && prem[0][0].replace(/\s\s+/g, " ") == " ") {
        prem[0] = ""
    }

    if (prem[0] != ""){

        console.log("premises:")
        for (var i = 0; i < prem.length; i++) {
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

    $.post("/api/rule", {rule : rule, conclusion : conc, premises : JSON.stringify(prem),
        parsed_conc : conc_final ,parsed_prem : JSON.stringify(parsed_prem) , toString : toString,
        conc : JSON.stringify(prem_conc_symbols(conc)), prem : JSON.stringify(prem_sym)}, function(data, status){
        console.log(data)
        console.log("Data: " + data + "\nStatus: " + status)
    })

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

    

    console.log("symbols:")
    console.log(DBSymbols)

}
