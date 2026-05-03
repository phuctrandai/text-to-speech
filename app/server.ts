import express from "express";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

type DialogueInput = { text: string; voice_id: string; speaker?: string };

const app = express();
const port = Number(process.env.PORT || 3000);
const speakerPrefixRegex = /^\s*[^:]{1,80}:\s*/;

app.use(express.json());
app.use(express.static("app/public"));

app.post("/api/generate-dialogue", async (req, res) => {
  const inputs = req.body?.inputs as DialogueInput[] | undefined;

  if (!Array.isArray(inputs) || inputs.length === 0) {
    return res.status(400).json({ error: "'inputs' must be a non-empty array" });
  }

  const cleanedInputs = inputs.map((input) => ({
    text: (input?.text ?? "").replace(speakerPrefixRegex, "").trim(),
    voiceId: input?.voice_id?.trim(),
  }));

  if (cleanedInputs.some((input) => !input.text || !input.voiceId)) {
    return res.status(400).json({ error: "Each input requires usable 'text' and 'voice_id'" });
  }

  const totalChars = cleanedInputs.reduce((sum, input) => sum + input.text.length, 0);
  if (totalChars > 2000) {
    return res.status(400).json({ error: "Combined text length must be <= 2000 characters per request" });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured" });
  }

  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    const audio = await client.textToDialogue.convert({ inputs: cleanedInputs });

    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const audioBase64 = Buffer.concat(chunks).toString("base64");
    return res.json({ audioBase64, mimeType: "audio/mpeg" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
