import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
  //fetch user profile either with username or userId
  //query is either username or userId
  const { query } = req.params;
  try {
    let user;

    //query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
    } else {
      //query is username
      user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error getting profile", error.message);
  }
};

//asynchronous function
//CREATE USER
const signupUser = async (req, res) => {
  try {
    //destructure req body it contains inside req body
    const { name, email, username, password } = req.body;

    //query the user in database whose email or username matches the provided username or emai
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the new instance of the user with the provided data
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    //save newly created user in database
    await newUser.save();
    //after successfully saved the data in database it sends a response back to the client
    //for security reason its a practice to not send sensitive information
    if (newUser) {
      generateTokenAndSetCookies(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log("Error signing up the user:", error.message);
  }
};

//LOGIN USER
//WE SHOULD USE ? SIGN IF USER IS NULL OR UNDEFINED THE EXPRESSION IMMEDIATELY RETURNS UNDEFINED AND THE PASWORD ACCESS WONT BE ATTEMPTED PREVENTING A POTENTIAL CANNOT READ PROPERTY PASSWORD OF NULLL ERROR
//IF USER IS NOT NULL OR UNDEFINED USER.PASSWORD IS EVALUATED..
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookies(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in login user", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    //clear the cookie when logout the user
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in singup User", error.message);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user?._id);

    //if its same user
    if (id === req.user._id.toString()) return res.status(400).json({ error: "you cannot follow /unfollow yourself" });

    if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followunfollow user ", error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "user not found" });

    //user cannot update other user profile
    if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You cannot update other user's profile" });

    //in the case of user changing the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    //cloudinary will respose as object
    if (profilePic) {
      //when we choose other picture we destroy the old data
      if (user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    //update the name
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    //save the updated data in database
    user = await user.save();

    //update the replies user details after the profile is edited
    //find all post that user replied and update the data
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );
    //password should be null in respose
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updating user", error.message);
  }
};

export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };
