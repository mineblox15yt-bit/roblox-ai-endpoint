const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMsg = req.body.text;
    const playerName = req.body.player || "Player";

    if (!userMsg) return res.json({ reply: "I didn't understand that!" });

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a friendly Roblox NPC that chats with players." },
                    { role: "user", content: userMsg }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.json({ reply: "Oops, I can't think right now 🤖" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI NPC server running on port ${PORT}`));
