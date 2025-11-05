import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const userMsg = req.body.text;  // message from player
    const playerName = req.body.player; // optional

    try {
        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_OPENAI_API_KEY",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a friendly Roblox NPC that talks to players." },
                    { role: "user", content: userMsg }
                ]
            })
        });

        const data = await response.json();

        const reply = data.choices[0].message.content;
        res.json({ reply }); // send reply back to Roblox
    } catch (err) {
        console.error(err);
        res.json({ reply: "Sorry, I can't think right now 🤖" });
    }
});

app.listen(3000, () => console.log("AI server running on port 3000"));
