function assign_sides (sequents, types) {
    var side = "l";
    var formulas = [];
    var separator_symbols = [];
    var separators = [];
    var primary_separator = '';
    var sequents_result = [];

    for (var i = 0; i < sequents.length; i++) {
        for (var j = 0; j < sequents[i].length; j++) {
            // switching sides when the primary separator is reached
            if (types['arrow'].includes(sequents[i][j])) {
                side = "r";
                primary_separator = sequents[i][j];
                separators.push([sequents[i][j], 'lr']);
                separator_symbols.push(sequents[i][j]);
                formulas.push([sequents[i][j], side]);

            // Assigning the sides to the formulas and separators
            } else {
                if (isType(sequents[i][j], types, 'separator')) {
                    separators.push([sequents[i][j], side]);
                    separator_symbols.push(sequents[i][j]);
                    formulas.push([sequents[i][j], side]);
                } else {
                    formulas.push([sequents[i][j], side]);
                }
            }
        }
        
        sequents_result.push([formulas, [primary_separator, separator_symbols, separators], []]);
        formulas = [];
        separator_symbols = [];
        separators = [];
        side = 'l';
    }

    return sequents_result;
}

function get_max_subs(rules) {
    var max_subs = {};
    var counter = 1;
    var primary_separator, separators;

    for (var i = 0; i < rules.length; i++) {
        for (var j = 0; j < rules[i].length; j++) {
            primary_separator = rules[i][j][1][0];
            separators = rules[i][j][1][2];

            // checking if the primary separator in the dictionary, if not, create a key for it with an empty value
            if (!max_subs.hasOwnProperty(primary_separator)) max_subs[primary_separator] = [];
            // if the current sequent sub is lager than the max, make it the new max
            max_subs[primary_separator] = max_sub(separators, max_subs[primary_separator], primary_separator);
        }
    }

    // assigning subs/zones to the separators of their left side [;, ->] => [[;, 1], [->, 2]] where subs= 1 ; 2 -> 3
    for (var primary_separator in max_subs) {
        if (max_subs.hasOwnProperty(primary_separator)) {
            for (var i = 0; i < max_subs[primary_separator].length; i++) {
                max_subs[primary_separator][i].push(counter);
                counter++;
            }
        }
        counter = 1;
    }

    return max_subs;
}

function assign_empty_subs (sequents, max_subs) {
    var separators, primary_separator, includes_index;
    for (var i = 0; i < sequents.length; i++) {
        primary_separator = sequents[i][1][0];
        separators = sequents[i][1][2];
        
        for (var j = 0; j < max_subs[primary_separator].length; j++) {
            // assigning subs to the separators in the sequent
            includes_index = find_separator(separators, max_subs[primary_separator][j]);
            if (includes_index[0]) {
                separators[includes_index[1]] = max_subs[primary_separator][j];
            
            // assigning the empty subs to the sequent based on it presence in the separator symbols list 
            } else {
                if (max_subs[primary_separator][j][1] === 'l') {
                    sequents[i][2].push(max_subs[primary_separator][j][2]);
                } else if (max_subs[primary_separator][j][1] === 'r') {
                    sequents[i][2].push(max_subs[primary_separator][j][2] + 1);
                }
            }
        }

        sequents[i][1][2] = separators; 
    }

    return sequents;
}

function assign_subs (sequents, types) {
    var sequent_subs = [];
    var sub_index = 0;
    var separators, formulas;

    for (var i = 0; i < sequents.length; i++) {
        separators = sequents[i][1][2];
        // getting the subs of the separators presented in this particular sequent
        sequent_subs = separators.map(function (separator) { return separator[2]; });
        sequent_subs.push(sequent_subs[sequent_subs.length - 1] + 1);
        formulas = sequents[i][0];
        sub_index = 0;

        for (var j = 0; j < formulas.length; j++) {
            // go to the next sub after encountering a separator
            if (isType(formulas[j][0], types, 'separator')) {
                sub_index++;
            } else {
                formulas[j].push(sequent_subs[sub_index]);
            }
        }
    }

    return sequents;
}