import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
	try {
	  const token = req.cookies.jwt; //get the value of the token from the cookies

	  if (!token) {
		return res.status(401).json({ message: "Unauthorized - No Token Provided" });
	  }

	  const decoded = jwt.verify(token, process.env.JWT_SECRET); // validate JWT token using the secret key

	  if (!decoded) {
		return res.status(401).json({ message: "Unauthorized - Invalid Token" });
	  }
  
	  const user = await User.findById(decoded.userId).select("-password"); // Find the user based on the decoded token data except the password field

	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }

	  req.user = user; //attaches the user data to req.user

	  next();
	} catch (error) {
	  console.log("Error in protectRoute middleware: ", error.message);
	  res.status(500).json({ message: "Internal server error" });
	}
  };
