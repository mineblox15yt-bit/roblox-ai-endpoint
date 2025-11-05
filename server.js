const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Set this in Render environment

app.post("/chat", async (req, res) => {
    const userMsg = req.body.text;
    const playerName = req.body.player || "Player";

    if (!userMsg) return res.json({ reply: "I didn't understand that!" });

    try {
        // Send request to Google Gemini (text-bison-001)
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GOOGLE_API_KEY}`,
            {
                prompt: `You are a friendly Roblox NPC talking to a player named ${playerName}. Reply in a conversational style.\nPlayer: ${userMsg}\nNPC:`,
                temperature: 0.7,
                candidateCount: 1,
                maxOutputTokens: 200
            }
        );

        const reply = response.data?.candidates?.[0]?.output || "Hmm, I can't think right now 🤖";
        res.json({ reply });
    } catch (err) {
        console.error("Google Gemini request failed:", err.response?.data || err.message);
        res.json({ reply: "Oops, I can't think right now 🤖" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI NPC server running on port ${PORT}`));
