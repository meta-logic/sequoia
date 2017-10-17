var rules = $.get('/api/get-rules', function (rules, status) {return rules});
var types = $.get('/api/get-types', function (types, status) {return types});