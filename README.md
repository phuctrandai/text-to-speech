# text-to-speech

Web app for generating multi-speaker dialogue audio from uploaded text files using ElevenLabs Text to Dialogue (TypeScript + Node.js).

## Setup

1. Copy `.env.example` to `.env` and set `ELEVENLABS_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. Open `http://127.0.0.1:3000`.

## Dialogue file format

- One utterance per line.
- Preferred format: `Speaker: sentence`.
- Example: see `sample-dialogue.txt`.

## Behavior

- The UI parses speakers from uploaded dialogue files and lets you assign a voice ID per speaker.
- The app strips leading speaker labels before generation (e.g. `Jake:`, `Annie:`).
- Total input text per request is capped at 2,000 characters.
