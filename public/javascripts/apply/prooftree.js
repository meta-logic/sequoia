// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function insert_new_tree(cn, cz, lt, ht, st) {
    latex_history.push(lt)
    sml_history.push(st.replace(/\\/g, "\\\\"))
    tree_history.push(ht)
    var main_tree = $("#main_tree")
    main_tree.html(ht)
    $(".leaf").click(function() {
        leaf_id = this.id.split("_")[1]
        seq_text = $(this).find("script")[0].innerText
        console.log(seq_text)
        $("#warning").css("visibility","hidden")
    })
    constraint_history.push(cn)
    smlconstraint_history.push(cz.replace(/\\/g, "\\\\"))
    if (constraint_history.length > 0) {
        var the_constraints = constraint_history[constraint_history.length-1]
        if (the_constraints[0] != "") {
            var constraints = $("#side_menu_L")
            constraints.html("")
            for (var i = 0; i < the_constraints.length; i++) {
                if (the_constraints[i] != "") {
                    constraints.append('<p>$$'+the_constraints[i]+'$$</p>')  
                }
            }
            $("#left_menu").css("visibility","visible")
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,constraints[0]])
        }
    } else {
        $("#left_menu").css("visibility","hidden")
    }
    seq_text = ""
    leaf_id = "-1"
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,main_tree[0]])
}


function insert_old_tree() {
    latex_history.pop()
    sml_history.pop()
    tree_history.pop()
    var main_tree = $("#main_tree")
    main_tree.html(tree_history[tree_history.length-1])
    $(".leaf").click(function() {
        leaf_id = this.id.split("_")[1]
        seq_text = $(this).find("script")[0].innerText
        console.log(seq_text)
        $("#warning").css("visibility","hidden")
    })
    constraint_history.pop()
    smlconstraint_history.pop()
    if (constraint_history.length > 0) {
        var the_constraints = constraint_history[constraint_history.length-1]
        if (the_constraints[0] != "") {
            var constraints = $("#side_menu_L")
            constraints.html("")
            for (var i = 0; i < the_constraints.length; i++) {
                if (the_constraints[i] != "") {
                    constraints.append('<p>$$'+the_constraints[i]+'$$</p>')  
                }
            }
            $("#left_menu").css("visibility","visible")
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,constraints[0]])
        }
    } else {
        $("#left_menu").css("visibility","hidden")
    }
    seq_text = ""
    leaf_id = "-1"
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,main_tree[0]])
}
