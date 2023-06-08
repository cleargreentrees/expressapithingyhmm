// Import the required modules
const express = require("express");
const Bard = require("bard-ai");
const rateLimit = require("express-rate-limit");

// Create an express app
const app = express();

// Create a bard instance with the cookie from the .env file
const bot = new Bard(process.env.SECURETOKEN);

// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 10, // limit each user to 10 requests per windowMs
  handler: (req, res) => {
    // Send a response when the limit is reached
    res.status(429).json({ message: "Too many requests, please try again later." });
  },
});

// Apply the rate limiter to all requests
app.use(limiter);

// Create a GET route for the API
app.get("/", async (req, res) => {
  // Get the user input from the query parameter
  const input = req.query.input;

  // Get the roblox user ID from the query parameter
  const userId = req.query.userId;

  // If input or userId is missing, send an error response
  if (!input || !userId) {
    return res.status(400).json({ message: "Missing input or userId parameter." });
  }

  try {
    // Set a timeout of 10 seconds for the bard request
    const timeout = setTimeout(() => {
      throw new Error("Bard request timed out.");
    }, 10 * 1000);

    // Ask bard for a response using the input and userId as conversationId
    const response = await bot.ask(input, userId);

    // Clear the timeout
    clearTimeout(timeout);

    // Send a success response with the bard response
    res.status(200).json({ message: response });
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ message: error.message });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
