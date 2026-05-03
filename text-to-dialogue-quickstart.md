> This guide will show you how to generate immersive, natural-sounding dialogue from text using the Text to Dialogue API.

<Warning>
  Keep the total length of all `inputs[].text` values at or below 2,000 characters per request for
  reliable generation. Split longer scripts into chunks and stitch the audio client-side.
</Warning>

## Using the Text to Dialogue API

<Steps>
  <Step title="Create an API key">
    [Create an API key in the dashboard here](https://elevenlabs.io/app/settings/api-keys), which you’ll use to securely [access the API](/docs/api-reference/authentication).

    Store the key as a managed secret and pass it to the SDKs either as a environment variable via an `.env` file, or directly in your app’s configuration depending on your preference.

    ```js title=".env"
    ELEVENLABS_API_KEY=<your_api_key_here>
    ```
  </Step>

  <Step title="Install the SDK">
    We'll also use the `dotenv` library to load our API key from an environment variable.

    <CodeBlocks>
      ```python
      pip install elevenlabs
      pip install python-dotenv
      ```

      ```typescript
      npm install @elevenlabs/elevenlabs-js
      npm install dotenv
      ```
    </CodeBlocks>
  </Step>

  <Step title="Make the API request">
    Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:

    <CodeBlocks>
      ```python maxLines=0
      # example.py
      from dotenv import load_dotenv
      from elevenlabs.client import ElevenLabs
      from elevenlabs.play import play

      load_dotenv()

      elevenlabs = ElevenLabs(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
      )

      audio = elevenlabs.text_to_dialogue.convert(
          inputs=[
              {
                  "text": "[cheerfully] Hello, how are you?",
                  "voice_id": "9BWtsMINqrJLrRacOk9x",
              },
              {
                  "text": "[stuttering] I'm... I'm doing well, thank you",
                  "voice_id": "IKne3meq5aSn9XLyUdCD",
              }
          ]
      )

      play(audio)
      ```

      ```typescript maxLines=0
      // example.mts
      import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
      import "dotenv/config";

      const elevenlabs = new ElevenLabsClient();

      const audio = await elevenlabs.textToDialogue.convert({
          inputs: [
              {
                  text: "[cheerfully] Hello, how are you?",
                  voiceId: "9BWtsMINqrJLrRacOk9x",
              },
              {
                  text: "[stuttering] I'm... I'm doing well, thank you",
                  voiceId: "IKne3meq5aSn9XLyUdCD",
              },
          ],
      });

      play(audio);
      ```
    </CodeBlocks>
  </Step>

  <Step title="Execute the code">
    <CodeBlocks>
      ```python
      python example.py
      ```

      ```typescript
      npx tsx example.mts
      ```
    </CodeBlocks>

    You should hear the dialogue audio play.
  </Step>
</Steps>

## Next steps

<CardGroup cols={3}>
  <Card title="Browse voices" icon="file:8beaab1d-b666-4d4e-9f1c-23717bcf386e" href="https://elevenlabs.io/app/voice-library">
    Explore 10,000+ voices to assign to each dialogue speaker
  </Card>

  <Card title="Text to Speech" icon="file:229118b6-6f05-4376-94c3-7041287a4174" href="/docs/eleven-api/guides/cookbooks/text-to-speech">
    Generate speech from a single voice with the Text to Speech API
  </Card>

  <Card title="API reference" icon="duotone book" href="/docs/api-reference/text-to-dialogue/convert">
    Explore all Text to Dialogue parameters and response formats
  </Card>
</CardGroup>
