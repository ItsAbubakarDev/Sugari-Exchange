const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, phone, password } = req.body;

  if (!fullName || !username || !email || !phone || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    res.status(400);
    throw new Error("Email or username already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    username,
    email,
    phone,
    password: hashedPassword,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});
// POST /api/users/check-username
const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const user = await User.findOne({ username });
  res.json({ exists: !!user });
});

// @desc Login user
// @route POST /api/users/login  
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        res.status(400);
        throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: foundUser.username,
                    email: foundUser.email,
                    id: foundUser.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" } // added proper expiry syntax
        );

        res.status(200).json({ accessToken, registered: true });


    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

// @desc Get current user
// @route GET /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser,checkUsername , loginUser,currentUser  };
