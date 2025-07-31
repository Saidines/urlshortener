import express from 'express';
import url from '../../model/url.js';
import authenticate from '../../authenticate.js';
import user from '../../model/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { longurl, slug } = req.body;
  console.log("Request Body:", req.body);

  // Basic input validation
  if (!longurl || !slug) {
    return res.status(400).send("Both longurl and slug are required");
  }

  try {
    // Validate token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY); // returns payload
    const username = decoded.username;
    console.log("Username from token:", username);

    // Fetch user from DB
    const currUser = await user.findOne({ username });
    if (!currUser) {
      return res.status(401).send("User not found");
    }

    // Create new URL record
    await url.create({
      longurl,
      slug,
      userid: currUser._id
    });

    res.status(201).send("Slug added");
  } catch (error) {
    console.error("Error occurred:", error);

    if (error.code === 11000) {
      return res.status(409).send("Slug is already used");
    }

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).send("Invalid or expired token");
    }

    res.status(500).send("Server error");
  }
});

export default router;

