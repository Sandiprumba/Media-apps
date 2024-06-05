import jwt from "jsonwebtoken";

//create a token
//JWT TOKEN ARE COMMONLY USED IN WEB APLICATIONS FOR AUTHENTICATION AND AUTHORIZATION PURPOSE
//it takes userid and sign with jwt secret and assin with token variable
const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  //setting a cookie in the users browser
  //here jwt is the name of the cookie ..token the value of cookie which is created by jwt
  res.cookie("jwt", token, {
    httpOnly: true,
    //15 days 24hours /day 60minutes/hour 60 seconds/minute 1000milisecond
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return token;
};

export default generateTokenAndSetCookies;
