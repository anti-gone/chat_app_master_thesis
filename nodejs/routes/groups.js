/**
 * Created by charlotte on 06.04.16.
 */

var express = require('express');
var assert = require("assert");
var router = express.Router();

/* display all chat groups
 * No params required
 *
 */
router.get('/', function (req, res, next) {
    var db = req.db;
    var collection = db.get('chatgroups');
    collection.find({}, {}, function (e, docs) {
            res.json(docs);
        }
    );
});

/*
 * Add group by setting group name and group code
 * Params: name, code
 *
 */
router.get('/addGroup', function (req, res, next) {
    var db = req.db;
    var collection = db.get('chatgroups');
    var name = req.query.name;
    var code = req.query.code;

    collection.insert({"name": name, "code": code}, function (err, result) {
        //  assert.equal(err, result);
        res.json(result);

    });
});

/* Remove group
 * Params: name
 *
 */
router.get('/removeGroup', function (req, res, next) {
    var db = req.db;
    var collection = db.get('chatgroups');
    var name = req.query.name;

    collection.remove({"name": name}, function (err, result) {
            res.json(result);

        }
    );


});

module.exports = router;
