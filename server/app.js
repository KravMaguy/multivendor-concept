const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");

// Initialize Firebase app
const serviceAccount = require("/path/to/serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

// Sign up route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create new user in Firebase Authentication
    const userRecord = await firebase.auth().createUser({
      email,
      password,
    });

    // Return success response
    res.status(200).json({
      message: "User created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
    });
  }
});

module.exports = router;
