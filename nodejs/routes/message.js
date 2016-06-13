/**
 * Created by charlotte on 06.04.16.
 */
var express = require('express');
var router = express.Router();


router.get('/updateMessageDistance', function(req, res, next){

    var db = req.db;
    var collection_messages = db.get('messages');
    var reqBody = req.body;
    var message_id=req.messageId;
    var user_distance=req.usersDistance;

    collection_messages.update({_id: message_id}, {$set: {usersDistance: user_distance }}, function(err, result) {

            if (err) {
                console.log(err);
                return next(err);

            }

            else {

                res.json(result);
            }
        }


    );




});



router.post('/writeMessagePost', function(req, res, next){

    console.log("write message post");
    var gcm = require('node-gcm');

    var gcm_message= new gcm.Message();


    var sender = new gcm.Sender('AIzaSyBPqf-xzJT5GIrFuesiBgJ-6b_h_BGDs6M');

    var db = req.db;
    var collection_users = db.get('users');
    var collection_messages = db.get('messages');

    var reqBody = req.body;
    console.log(req.body);

    var fromUserName= req.body.fromUserName;
    var toUserName=req.body.toUserName;
    var messageText=req.body.messageText;

    var song = req.body.song;
    var senderLocation=req.body.senderLocation;

    var tokens = collection_users.find({"username": toUserName}, {"tokens":1});

    console.log(tokens);

    //TODO:
    gcm_message.addData('text', messageText);


console.log(req.body);
    console.log(fromUserName);
    console.log(toUserName);
    console.log(messageText);

    var date=new Date();

   getUserData(fromUserName, req.db, function(fromUser)
    {
      getUserData(toUserName, req.db, function(toUser)
        {


            var fromUserDisplayName=fromUser.displayName;
            var toUserDisplayName=toUser.displayName;
            var toUserTokens=toUser.tokens;
            collection_messages.insert({
                "messageText": messageText,
                "date": date,
                "fromUserName": fromUserName,
                "toUserName": toUserName,
                "fromDisplayName": fromUserDisplayName,
                "toDisplayName": toUserDisplayName,
                "song": song,
                "senderLocation":senderLocation
            }, function (err, result) {



                if (err) {
                    console.log(err);
                    return next(err);

                }

                if (toUserTokens != undefined)
                sender.send(gcm_message, { registrationTokens: toUserTokens }, function (err, response) {
                    if(err) console.error(err);
                    else    console.log(" success " +response);
                });
            console.log("should send result");
                res.json(result);
            });

        });

    });

});

/*
router.get('/writeMessage', function(req, res, next) {
    var db = req.db;
    var collection_users = db.get('users');
    var collection_messages = db.get('messages');
    var fromUserName = req.query.fromUserName;
    var toUserName = req.query.toUserName;

    if (!fromUserName || !toUserName)
    {
       return next(new Error("You have to specify sender and recipient!"));

    }

    var messageText = req.query.messageText;

    if (!messageText)
        {
            messageText=" ";
        }


    var metaData = req.query.metaData;
    var date=new Date();

    //TODO: check if message is allowed

    console.log(collection_users.find({"username": fromUserName}));

   // var fromUserId = collection_users.find({"username": fromUserName}).toArray()[0]._id;
   // var toUserId = collection_users.find({"username": toUserName}).toArray()[0]._id;

   getUserData(fromUserName, req.db, function(fromUser)
    {
            getUserData(toUserName, req.db, function(toUser)
        {

            var fromUserDisplayName=fromUser.displayName;
            var toUserDisplayName=toUser.displayName;
            var toUserTokens=toUser.tokens;


            collection_messages.insert({
                "messageText": messageText,
                "metaData": metaData,
                "date": date,
                "fromUserName": fromUserName,
                "toUserName": toUserName,
                "fromDisplayName": fromUserDisplayName,
                "toDisplayName": toUserDisplayName
            }, function (err, result) {

                if (err) {
                    return next(err);

                }

                res.json(result);
            });

        });

    });




});*/

var getUserData = function(username, db, callback)
{

    var collection_users=db.get('users');

    console.log(username);

    collection_users.find({"username": username}, {}, function(err, res)
    {

        console.log(res);

        if (res != undefined && res[0] != undefined) {
            callback(res[0]);

        }
        else callback(null);


    });


};



router.get('/getConversation', function(req, res, next)
{
    var db = req.db;
    var collection_messages = db.get('messages');

    var fromUserName = req.query.fromUserName;
    var toUserName = req.query.toUserName;


    if (!fromUserName || !toUserName)
    {
       return next(new Error("You have to specify sender and recipient!"));

    }



    var queryLimit = req.query.queryLimit;
    var querySkip = req.query.skip;

    collection_messages.find({ $or: [{"fromUserName": fromUserName, "toUserName": toUserName}, {"fromUserName": toUserName, "toUserName": fromUserName}]}, { limit : queryLimit, skip: querySkip },  function(err, result){


        if (err) {
            return next(err);

        }


            res.json(result);

    }


    );

});



module.exports = router;
