/**
 * Created by charlotte on 08.05.16.
 */
var express = require('express');
var router = express.Router();


router.get('/addTokenForUser', function(req, res, next){
    console.log("add token for user called");
    var db = req.db;
    var users_collection = db.get('users');
var token = req.query.token;
    var username=req.query.username;


    users_collection.update({"username": username },  {$addToSet: {"tokens":token}},
        function(err, result)
        {

            if (err) {
                return next(err);

            }
            res.json(result);

        });


});








module.exports=router;