var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
    var group=req.query.group;
  var chatgroups = db.get('chatgroups');
    var users_collection = db.get('users');

  chatgroups.find({"name": group},{},function(e,docs) {
      if (e || (!group)) {
          return next(e);

      }
  


      if (!docs[0]) {
          res.json({});
return;
      }


      var group_users = docs[0].user;




      users_collection.find({'_id': {$in: group_users}},
      function(err, result)
      {

          if (err) {
              return next(err);

          }
         res.json(result);

      });

      }
  );
});

router.get('/updateDisplayName', function(req, res, next){

    var db = req.db;
    var collection = db.get('users');
    var displayName = req.query.displayName;
    var username = req.query.username;

    console.log("username "+username);
    console.log("displayname: "+displayName);

    if (!displayName)
    {
        return   next(new Error("You have to specify a display name!"));
    }


    if (!username) {
        return   next(new Error("You have to specify a username!"));
    }
    collection.update({"username": username}, {$set: {"displayName": displayName}}, function(err, result){

        if (err) {
            return next(err);

        }
        //  assert.equal(err, result);
        res.json(result);

    });

});

router.get('/addUser', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  var username = req.query.username;
    var displayName = req.query.displayName;

    if (!username) {
      return   next(new Error("You have to specify a username!"));
    }
    if (!displayName)
    {

        return next(new Error("You have to specify a display name!"));
    }

  collection.insert({"username": username, "displayName": displayName}, function(err, result){

      if (err) {
          return next(err);

      }
    //  assert.equal(err, result);
    res.json(result);

  });
});


router.get('/addUserToGroup', function(req, res, next) {
    var db = req.db;
    var collection_users = db.get('users');
    var collection_groups = db.get('chatgroups');
    var username = req.query.username;
    var group=req.query.group;

    if (!username)
    {

        return next(new Error("You have to specify the user!"));
    }
    if (!group)
    {

        return next(new Error("You have to specify the group you want the user to be added to!"));
    }


    collection_users.find({"username": username}, function(err, result){

        if (err) {
            return next(err);

        }
        //  assert.equal(err, result);
      var id= result[0]._id;

        collection_groups.update({"name": group}, {$addToSet: {"user":id}},
        function(err, result)
        {

            if (err) {
                return next(err);

            }
            res.json(result);

        })

    });
});


router.get('/removeUserFromGroup', function(req, res, next) {
    var db = req.db;
    var collection_users = db.get('users');
    var collection_groups = db.get('chatgroups');
    var username = req.query.username;
    var group=req.query.group;

    if (!username)
    {
        return next(new Error("You have to specify the user!"));
    }
    if (!group)
    {

        return next(new Error("You have to specify the group  you want the user to be removed from!"));
    }



    collection_users.find({"username": username}, function(err, result){

        if (err) {
            return next(err);

        }
        //  assert.equal(err, result);
        var id= result[0]._id;

        collection_groups.update({"name": group}, {$pull: {"user":id}},
            function(err, result)
            {

                if (err) {
                    return next(err);

                }

                res.json(result);

            })

    });
});





module.exports = router;
