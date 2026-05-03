# Create dialogue

POST https://api.elevenlabs.io/v1/text-to-dialogue
Content-Type: application/json

Converts a list of text and voice ID pairs into speech (dialogue) and returns audio.

Reference: https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert

## OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: api
  version: 1.0.0
paths:
  /v1/text-to-dialogue:
    post:
      operationId: convert
      summary: Create dialogue
      description: >-
        Converts a list of text and voice ID pairs into speech (dialogue) and
        returns audio.
      tags:
        - subpackage_textToDialogue
      parameters:
        - name: output_format
          in: query
          description: >-
            Output format of the generated audio. Formatted as
            codec_sample_rate_bitrate. So an mp3 with 22.05kHz sample rate at
            32kbs is represented as mp3_22050_32. MP3 with 192kbps bitrate
            requires you to be subscribed to Creator tier or above. PCM and WAV
            formats with 44.1kHz sample rate requires you to be subscribed to
            Pro tier or above. Note that the μ-law format (sometimes written
            mu-law, often approximated as u-law) is commonly used for Twilio
            audio inputs.
          required: false
          schema:
            $ref: '#/components/schemas/V1TextToDialoguePostParametersOutputFormat'
        - name: xi-api-key
          in: header
          required: false
          schema:
            type: string
      responses:
        '200':
          description: The generated audio file
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        '422':
          description: Validation Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
      requestBody:
        content:
          application/json:
            schema:
              $ref: >-
                #/components/schemas/Body_Text_to_dialogue__multi_voice__v1_text_to_dialogue_post
servers:
  - url: https://api.elevenlabs.io
  - url: https://api.us.elevenlabs.io
  - url: https://api.eu.residency.elevenlabs.io
  - url: https://api.in.residency.elevenlabs.io
components:
  schemas:
    V1TextToDialoguePostParametersOutputFormat:
      type: string
      enum:
        - alaw_8000
        - mp3_22050_32
        - mp3_24000_48
        - mp3_44100_128
        - mp3_44100_192
        - mp3_44100_32
        - mp3_44100_64
        - mp3_44100_96
        - opus_48000_128
        - opus_48000_192
        - opus_48000_32
        - opus_48000_64
        - opus_48000_96
        - pcm_16000
        - pcm_22050
        - pcm_24000
        - pcm_32000
        - pcm_44100
        - pcm_48000
        - pcm_8000
        - ulaw_8000
        - wav_16000
        - wav_22050
        - wav_24000
        - wav_32000
        - wav_44100
        - wav_48000
        - wav_8000
      default: mp3_44100_128
      description: >-
        Output format of the generated audio. Formatted as
        codec_sample_rate_bitrate. So an mp3 with 22.05kHz sample rate at 32kbs
        is represented as mp3_22050_32. MP3 with 192kbps bitrate requires you to
        be subscribed to Creator tier or above. PCM and WAV formats with 44.1kHz
        sample rate requires you to be subscribed to Pro tier or above. Note
        that the μ-law format (sometimes written mu-law, often approximated as
        u-law) is commonly used for Twilio audio inputs.
      title: V1TextToDialoguePostParametersOutputFormat
    DialogueInput:
      type: object
      properties:
        text:
          type: string
          description: The text to be converted into speech.
        voice_id:
          type: string
          description: The ID of the voice to be used for the generation.
      required:
        - text
        - voice_id
      title: DialogueInput
    ModelSettingsResponseModel:
      type: object
      properties:
        stability:
          type:
            - number
            - 'null'
          format: double
          default: 0.5
          description: >-
            Determines how stable the voice is and the randomness between each
            generation. Lower values introduce broader emotional range for the
            voice. Higher values can result in a monotonous voice with limited
            emotion.
      title: ModelSettingsResponseModel
    PronunciationDictionaryVersionLocatorRequestModel:
      type: object
      properties:
        pronunciation_dictionary_id:
          type: string
          description: The ID of the pronunciation dictionary.
        version_id:
          type:
            - string
            - 'null'
          description: >-
            The ID of the version of the pronunciation dictionary. If not
            provided, the latest version will be used.
      required:
        - pronunciation_dictionary_id
      title: PronunciationDictionaryVersionLocatorRequestModel
    BodyTextToDialogueMultiVoiceV1TextToDialoguePostApplyTextNormalization:
      type: string
      enum:
        - auto
        - 'on'
        - 'off'
      default: auto
      description: >-
        This parameter controls text normalization with three modes: 'auto',
        'on', and 'off'. When set to 'auto', the system will automatically
        decide whether to apply text normalization (e.g., spelling out numbers).
        With 'on', text normalization will always be applied, while with 'off',
        it will be skipped.
      title: BodyTextToDialogueMultiVoiceV1TextToDialoguePostApplyTextNormalization
    Body_Text_to_dialogue__multi_voice__v1_text_to_dialogue_post:
      type: object
      properties:
        inputs:
          type: array
          items:
            $ref: '#/components/schemas/DialogueInput'
          description: >-
            A list of dialogue inputs, each containing text and a voice ID which
            will be converted into speech. The maximum number of unique voice
            IDs is 10. For reliable generation, keep the total character count
            across all `inputs[].text` values at or below 2,000 characters per
            request. Longer requests can terminate early in streaming responses
            or return a validation error.
        model_id:
          type: string
          default: eleven_v3
          description: >-
            Identifier of the model that will be used, you can query them using
            GET /v1/models. The model needs to have support for text to speech,
            you can check this using the can_do_text_to_speech property.
        language_code:
          type:
            - string
            - 'null'
          description: >-
            Language code (ISO 639-1) used to enforce a language for the model
            and text normalization. If the model does not support provided
            language code, an error will be returned.
        settings:
          oneOf:
            - $ref: '#/components/schemas/ModelSettingsResponseModel'
            - type: 'null'
          description: Settings controlling the dialogue generation.
        pronunciation_dictionary_locators:
          type:
            - array
            - 'null'
          items:
            $ref: >-
              #/components/schemas/PronunciationDictionaryVersionLocatorRequestModel
          description: >-
            A list of pronunciation dictionary locators (id, version_id) to be
            applied to the text. They will be applied in order. You may have up
            to 3 locators per request
        seed:
          type:
            - integer
            - 'null'
          description: >-
            If specified, our system will make a best effort to sample
            deterministically, such that repeated requests with the same seed
            and parameters should return the same result. Determinism is not
            guaranteed. Must be integer between 0 and 4294967295.
        apply_text_normalization:
          $ref: >-
            #/components/schemas/BodyTextToDialogueMultiVoiceV1TextToDialoguePostApplyTextNormalization
          description: >-
            This parameter controls text normalization with three modes: 'auto',
            'on', and 'off'. When set to 'auto', the system will automatically
            decide whether to apply text normalization (e.g., spelling out
            numbers). With 'on', text normalization will always be applied,
            while with 'off', it will be skipped.
      required:
        - inputs
      title: Body_Text_to_dialogue__multi_voice__v1_text_to_dialogue_post
    ValidationErrorLocItems:
      oneOf:
        - type: string
        - type: integer
      title: ValidationErrorLocItems
    ValidationError:
      type: object
      properties:
        loc:
          type: array
          items:
            $ref: '#/components/schemas/ValidationErrorLocItems'
        msg:
          type: string
        type:
          type: string
      required:
        - loc
        - msg
        - type
      title: ValidationError
    HTTPValidationError:
      type: object
      properties:
        detail:
          type: array
          items:
            $ref: '#/components/schemas/ValidationError'
      title: HTTPValidationError

```

## SDK Code Examples

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        apiKey: "xi-api-key",
    });
    await client.textToDialogue.convert({
        inputs: [
            {
                text: "Knock knock",
                voiceId: "JBFqnCBsd6RMkjVDRZzb",
            },
            {
                text: "Who is there?",
                voiceId: "Aw4FAjKCGjjNkVhN1Xmq",
            },
        ],
    });
}
main();

```

```python
from elevenlabs import ElevenLabs, DialogueInput

client = ElevenLabs(
    api_key="xi-api-key",
)

client.text_to_dialogue.convert(
    inputs=[
        DialogueInput(
            text="Knock knock",
            voice_id="JBFqnCBsd6RMkjVDRZzb",
        ),
        DialogueInput(
            text="Who is there?",
            voice_id="Aw4FAjKCGjjNkVhN1Xmq",
        )
    ],
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/text-to-dialogue"

	payload := strings.NewReader("{\n  \"inputs\": [\n    {\n      \"text\": \"Knock knock\",\n      \"voice_id\": \"JBFqnCBsd6RMkjVDRZzb\"\n    },\n    {\n      \"text\": \"Who is there?\",\n      \"voice_id\": \"Aw4FAjKCGjjNkVhN1Xmq\"\n    }\n  ]\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/text-to-dialogue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"inputs\": [\n    {\n      \"text\": \"Knock knock\",\n      \"voice_id\": \"JBFqnCBsd6RMkjVDRZzb\"\n    },\n    {\n      \"text\": \"Who is there?\",\n      \"voice_id\": \"Aw4FAjKCGjjNkVhN1Xmq\"\n    }\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/text-to-dialogue")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"inputs\": [\n    {\n      \"text\": \"Knock knock\",\n      \"voice_id\": \"JBFqnCBsd6RMkjVDRZzb\"\n    },\n    {\n      \"text\": \"Who is there?\",\n      \"voice_id\": \"Aw4FAjKCGjjNkVhN1Xmq\"\n    }\n  ]\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/text-to-dialogue', [
  'body' => '{
  "inputs": [
    {
      "text": "Knock knock",
      "voice_id": "JBFqnCBsd6RMkjVDRZzb"
    },
    {
      "text": "Who is there?",
      "voice_id": "Aw4FAjKCGjjNkVhN1Xmq"
    }
  ]
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/text-to-dialogue");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"inputs\": [\n    {\n      \"text\": \"Knock knock\",\n      \"voice_id\": \"JBFqnCBsd6RMkjVDRZzb\"\n    },\n    {\n      \"text\": \"Who is there?\",\n      \"voice_id\": \"Aw4FAjKCGjjNkVhN1Xmq\"\n    }\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["inputs": [
    [
      "text": "Knock knock",
      "voice_id": "JBFqnCBsd6RMkjVDRZzb"
    ],
    [
      "text": "Who is there?",
      "voice_id": "Aw4FAjKCGjjNkVhN1Xmq"
    ]
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/text-to-dialogue")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```
