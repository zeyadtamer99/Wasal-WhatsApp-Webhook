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

    // Extract sender and message content
    const from = req.body.From || "Unknown";
    const message = req.body.Body || "No message received";

    console.log(`New WhatsApp Message from ${from}: ${message}`);

    // Define emoji-based responses
    const emojiResponses = {
        "✅": `شكراً لك..
تأكيدك يعزز أهدافنا المشتركة، ويدعم انطلاق مجتمعنا بروحك وإضافتك.

دُمنا على "وصل" 💜.`,
        "🙏": "الجايات اكثر ان شاء الله",
        "👍": "سعداء بحماسك! نراك قريبًا بإذن الله.",
        "👎": "نأسف لسماع ذلك، نأمل أن نراك في المرات القادمة! 😊"
    };

    // Check if the message contains an emoji response
    if (emojiResponses[message]) {
        try {
            await client.messages.create({
                from: "whatsapp:+14155238886",
                to: from,
                body: emojiResponses[message]
            });

            console.log(`Sent response: ${emojiResponses[message]}`);
        } catch (error) {
            console.error("Error sending response:", error);
        }
    }

    res.status(200).send("Webhook received! ✅"); // Respond to Twilio
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
