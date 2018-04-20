const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const _ = require("lodash");
const methodOverride = require("method-override");
const {Dog} = require("./models/dog.js");
const app = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../app/views/dogs"));
hbs.registerPartials(path.join(__dirname, "../app/views/partials"));
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || "mongodb://localhost:27017/Doglist";
mongoose.connect(database)
.then(() => {
  console.log("connected to database");
})
.catch(() => {
  console.log("unable to connect to database");
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.redirect("/dogs");
})
app.get("/dogs", (req, res) => {
  Dog.find()
  .then(dogs => {
    res.render("index.hbs", {
      dogs
    });
  })
  .catch(e => {
    res.status(404).send();
  })
})
app.get("/dogs/new", (req, res) => {
  res.render("new.hbs");
})
app.post("/dogs", (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).send({error: "Did not include name and age"});
  }
  const dog = new Dog({
    image: req.body.image,
    name: req.body.name,
    age: req.body.age,
    personalityType: req.body.personalityType,
    dogBreed: req.body.dogBreed,
    description: req.body.description
  })
  dog.save()
  .then(dog => {
    res.redirect("/dogs");
  })
  .catch(e => {
    res.status(400).send();
  })
})
app.get("/dogs/:id", (req, res) => {
  Dog.find({_id: req.params.id})
  .then(dog => {
    res.render("show.hbs", {
      id: dog[0]._id,
      image: dog[0].image,
      name: dog[0].name,
      age: dog[0].age,
      personalityType: dog[0].personalityType,
      dogBreed: dog[0].dogBreed,
      description: dog[0].description
    });
  })
  .catch(e => {
    res.status(404).send();
  })
})
app.get("/dogs/:id/edit", (req, res) => {
  Dog.find({_id: req.params.id})
  .then(dog => {
    res.render("edit.hbs", {
      id: dog[0]._id,
      image: dog[0].image,
      name: dog[0].name,
      age: dog[0].age,
      personalityType: dog[0].personalityType,
      dogBreed: dog[0].dogBreed,
      description: dog[0].description
    });
  })
  .catch(e => {
    res.status(404).send();
  })
})
app.put("/dogs/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["image", "name", "age", "personalityType", "dogBreed", "description"]);
  Dog.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then(dog => {
    res.redirect("/dogs");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.delete("/dogs/:id", (req, res) => {
  const id = req.params.id;
  Dog.findByIdAndRemove(id)
  .then(dog => {
    res.redirect("/dogs");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
