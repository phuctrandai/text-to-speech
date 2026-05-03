import express from "express";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

type DialogueInput = { text: string; voice_id: string; speaker?: string };

const app = express();
const port = Number(process.env.PORT || 3000);
const speakerPrefixRegex = /^\s*[^:]{1,80}:\s*/;

app.use(express.json());
app.use(express.static("app/public"));

app.get("/api/voices", async (req, res) => {
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured" });
  }

  try {
    // Try SDK method first
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    const result = await client.voices.getAll();
    // SDK returns either an array or an object with a 'voices' key
    const list: any[] = Array.isArray(result) ? result : ((result as any).voices ?? []);
    
    // Filter for premade voices as they are available on the free tier
    const voices = list
      .filter((v: any) => v.category === "premade")
      .map((v: any) => ({ 
        voice_id: v.voice_id || v.id || v.voiceId, 
        name: v.name 
      }));
    return res.json(voices);
  } catch (sdkError) {
    // Fallback: call the REST API directly (using v1 as per user suggestion for better category support)
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY as string },
      });
      if (!response.ok) {
        const body = await response.text();
        return res.status(response.status).json({ error: `ElevenLabs API error: ${body}` });
      }
      const data = await response.json();
      const list: any[] = Array.isArray(data) ? data : (data.voices ?? []);
      
      const voices = list
        .filter((v: any) => v.category === "premade")
        .map((v: any) => ({ 
          voice_id: v.voice_id || v.id || v.voiceId, 
          name: v.name 
        }));
      return res.json(voices);
    } catch (restError) {
      const message = restError instanceof Error ? restError.message : "Unknown error";
      return res.status(500).json({ error: message });
    }
  }
});

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
    const modelId = req.body?.model_id || "eleven_v3";
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    const audio = await client.textToDialogue.convert({ 
      inputs: cleanedInputs,
      modelId: modelId
    });

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
