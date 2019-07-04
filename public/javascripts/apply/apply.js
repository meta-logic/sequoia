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
  / conn:CONN _ "(" _ fls:FORM_LIST _ ")" {return 'Form(' + conn + "," + fls + ")"} 
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
