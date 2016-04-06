/**
 * Created by charlotte on 06.04.16.
 */
var express = require('express');
var router = express.Router();

router.get('/writeMessage', function (req, res, next) {
    var db = req.db;
    var collection_users = db.get('users');
    var collection_messages = db.get('messages');
    var fromUserName = req.query.fromUserName;
    var toUserName = req.query.toUserName;

    if (!fromUserName || !toUserName) {
        return next(new Error("You have to specify sender and recipient!"));

    }

    var messageText = req.query.messageText;

    if (!messageText) {
        messageText = " ";
    }


    var metaData = req.query.metaData;
    var date = new Date();

    //TODO: check if message is allowed

    console.log(collection_users.find({"username": fromUserName}));

    // var fromUserId = collection_users.find({"username": fromUserName}).toArray()[0]._id;
    // var toUserId = collection_users.find({"username": toUserName}).toArray()[0]._id;

    var fromUserDisplayName = getDisplayName(fromUserName, req.db, function (fromUserDisplayName) {
        var toUserDisplayName = getDisplayName(toUserName, req.db, function (toUserDisplayName) {

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


});

var getDisplayName = function (username, db, callback) {

    var collection_users = db.get('users');

    console.log(username);

    collection_users.find({"username": username}, {}, function (err, res) {

        console.log(res);

        if (res != undefined && res[0] != undefined)
            callback(res[0].displayName);

        else callback(" ");


    });


};


router.get('/getConversation', function (req, res, next) {
    var db = req.db;
    var collection_messages = db.get('messages');

    var fromUserName = req.query.fromUserName;
    var toUserName = req.query.toUserName;


    if (!fromUserName || !toUserName) {
        return next(new Error("You have to specify sender and recipient!"));

    }


    var queryLimit = req.query.queryLimit;
    var querySkip = req.query.skip;

    collection_messages.find({
            $or: [{
                "fromUserName": fromUserName,
                "toUserName": toUserName
            }, {"fromUserName": toUserName, "toUserName": fromUserName}]
        }, {limit: queryLimit, skip: querySkip}, function (err, result) {


            if (err) {
                return next(err);

            }


            res.json(result);

        }
    );

});


module.exports = router;
