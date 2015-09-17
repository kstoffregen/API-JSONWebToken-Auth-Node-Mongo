var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/user');

function findOneUser( req, res ){
    User.findOne({'username': req.user.username}, function( err, user ){
        if(err){
            console.log(err)
        } else {
            res.send(user);
        }
    })
}

router.get('/', function(req, res, next){
    findOneUser( req, res );
});

router.post('/', function(req, res, next){
    console.log(req.user.username);
    User.findOneAndUpdate({'username': req.user.username},  {$push: {'events': req.body}}, function(err ){
        if(err){
            console.log(err);
        } else {
            findOneUser( req, res );
        }
    })
});

module.exports = router;