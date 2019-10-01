// //api/controllers/prooftree.js
// 'use strict';

// //Loading Dependencies =============================================
// var ProofTree = require("../models/prooftree")
// var sml  = require('../../sml/applyRule');


// router.post('/apply', function (req, res) {
// 	var rule = req.body.rule;
// 	var sequent = req.body.sequent;
// 	var result = sml.applyRule(rule, sequent, res);
// });

// //creating a prooftree
// function createTree (req, res) {
//     var prooftree = new Prooftree()

//     prooftree.leaf_ids = JSON.parse(req.body.leaves)
//     prooftree.formulas = req.body.formulas
//     prooftree.cons_list = req.body.cons_list
//     prooftree.prooftree = req.body.prooftree

//     //saving the tree in the database
//     prooftree.save(function (err) {

//         //if something went wrong while saving, return the error
//         if (err) {
//             return res.status(400).json({
//                 "status"  : "failure",
//                 "message" : "something went wrong while creating the prooftree"
//             })
//         }
//         //send success message and created rule
//         return res.status(200).json({
//             "status"  : "success",
//             "message" : "prooftree was created",
//             "prooftree"    : prooftree 
//         })
//     }) 
// }


// //updating a tree
// function applyToTree (req, res) {
//     //looking up the rule and updating it
//     ProofTree.findOneAndUpdate({ _id : req.body.id}, 
//         {   leaf_ids : JSON.parse(req.body.leaves),
//             formulas : req.body.formulas,
//             cons_list : req.body.cons_list,
//             prooftree : req.body.prooftree
//         }, 
//         { new : true}, 
//         function (err, rule) {
//             //if the rule does not exist
//             if (err || rule == null) {
//                 return res.status(400).json({
//                     "status"  : "failure",
//                     "message" : "prooftreedoes not exist"
//                 })
//             }
//             //send back the updated rule 
//             return res.status(200).json({
//                 "status" : "success",
//                 "prooftree"   : prooftree
//             })
//         })
// }


// module.exports = {createTree, applyToTree}