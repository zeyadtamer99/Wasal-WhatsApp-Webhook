const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// ✅ Enable JSON & URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // This is the fix! ✅

// Webhook URL: Your server will listen for Twilio messages here
app.post("/webhook", (req, res) => {
    console.log("Received Webhook Data:", req.body); // Log the full request body

    // Extract message details
    const from = req.body.From || "Unknown";  // Sender's WhatsApp number
    const message = req.body.Body || "No message received";  // Message content

    console.log(`New WhatsApp Message from ${from}: ${message}`);

    res.status(200).send("Webhook received! ✅");  // Respond to Twilio
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
