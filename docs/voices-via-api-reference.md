Voices Available on the Free Tier via API
On a free plan, you can use the default/premade voices that come built into ElevenLabs. To find them, call:

GET https://api.elevenlabs.io/v2/voices

This will return all voices available to your account, including the default premade voices that are accessible on the free tier. You can filter specifically for premade voices using the v2 endpoint:

GET https://api.elevenlabs.io/v2/voices?voice_type=default