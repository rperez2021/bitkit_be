const express = require("express");
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the documents.
recordRoutes.route("/recipes").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("matches")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching recipes!");
            } else {
                res.json(result);
            }
        });
});

// This section will help you create a new document.
recordRoutes.route("/recipes/recordSwipe").post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
        recipe_id: req.body.id,
        last_modified: new Date(),
        session_id: req.body.session_id,
        direction: req.body.direction
    };

    dbConnect
        .collection("matches")
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                res.status(400).send("Error inserting matches!");
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                res.status(204).send();
            }
        });
});

// This section will help you update a document by id.
recordRoutes.route("/recipes/updateLike").post(function (req, res) {
    const dbConnect = dbo.getDb();
    const recipeQuery = { _id: req.body.id };
    const updates = {
        $inc: {
            likes: 1
        }
    };

    dbConnect
        .collection("recipesAndReviews")
        .updateOne(recipeQuery, updates, function (err, _result) {
            if (err) {
                res.status(400).send(`Error updating likes on recipe with id ${recipeQuery.id}!`);
            } else {
                console.log("1 document updated");
            }
        });
});

// This section will help you delete a record.
recordRoutes.route("/recipes/delete/:id").delete((req, res) => {
    const dbConnect = dbo.getDb();
    const recipeQuery = { recipe_id: req.body.id };
  
    dbConnect
      .collection("recipesAndReviews")
      .deleteOne(recipeQuery, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting recipe with id ${recipeQuery.recipe_id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
  });

  module.exports = recordRoutes;