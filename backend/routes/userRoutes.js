import express from "express";
import { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile } from "../controllers/userController.js";
import protectRoute from "../Middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser); //dynamic value ..PROTECT THE ROUTE
router.put("/update/:id", protectRoute, updateUser);

export default router;

//INSTEAD OF WRITING ALL THE CODE IN ONE PLACE WE CREATE ROUTES AND CONTROLLER SEPERATE
// import express from "express";

// const router = express.Router();

// router.get("/signup", (req, res) => {
//   res.send("signed up successfully");
// });

// export default router;
