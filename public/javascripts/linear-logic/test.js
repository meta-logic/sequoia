var _ = unification._;
var v = unification.variable;
var unify = unification.unify;

var a = [v("1"), "->", v("2"), ";", v("3")];
var b = [[1, 3], '->', [7], ';', 1];

console.log(unify(a, b)); // i = 5, j = 11, k = 3
