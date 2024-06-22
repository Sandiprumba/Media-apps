//IN MONGOOSE A MODEL IS LIKE A BLUE PRINT FOR INTERACTING WITH A SPECIFIC MONGO DB COLLECTION .. IT DEFINES THE STRUCTURE OF DOCUMENTS WITH IN THAT COLLECTION AND PROVIDES METHODS FOR CREATING READING UPDATING AND DELETING DOCUMENTS ...

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },

    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//dont write users it should be upper case and singular ..
const User = mongoose.model("User", userSchema);
export default User;
