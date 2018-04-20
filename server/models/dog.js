const mongoose = require("mongoose");
const dogSchema = mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minLength: 1,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  personalityType: {
    type: String
  },
  dogBreed: {
    type: String
  },
  description: {
    type: String
  }
})
const Dog = mongoose.model("Dog", dogSchema);
module.exports = {Dog}
