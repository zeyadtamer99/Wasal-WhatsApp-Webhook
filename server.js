const express = require("express");
const accountSid = "ACf0bc9c43235e011640fad71b5979f2dd";
const authToken = "6a11e7cddb10ab971d21065a07d9abd8";
const client = require("twilio")(accountSid, authToken);

const app = express();

// ✅ Enable JSON & URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook for incoming messages
app.post("/webhook", async (req, res) => {
    console.log("Received Webhook Data:", req.body);

    // Extract sender and user response
    const from = req.body.From || "Unknown";
    const message = req.body.Body || "No message received";
    const buttonResponse = req.body.ButtonPayload || null; // Detect button click response

    console.log(`New WhatsApp Message from ${from}: ${message}`);
    console.log(`Button Response: ${buttonResponse}`);

    // Define responses based on List ID
    const buttonResponses = {
        "yes": `شكراً لك..
تأكيدك يعزز أهدافنا المشتركة، ويدعم انطلاق مجتمعنا بروحك وإضافتك.

دُمنا على "وصل" 💜.`,
        "no": "الجايات اكثر ان شاء الله"
    };

    let replyMessage = "لم يتم اختيار عنصر صحيح."; // Default response if no match

    // Check if the user clicked a valid button
    if (buttonResponses[buttonResponse]) {
        replyMessage = buttonResponses[buttonResponse];

        // ✅ Send reply based on user selection
        try {
            await client.messages.create({
                from: "whatsapp:+14155238886",
                to: from,
                body: replyMessage
            });

            console.log(`Sent response: ${replyMessage}`);
        } catch (error) {
            console.error("Error sending response:", error);
        }
    }

    res.status(200).send("Webhook received! ✅"); // Respond to Twilio
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
