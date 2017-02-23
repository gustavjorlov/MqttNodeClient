# Node Client for MQTT
## Connecting to AWS IoT platform

### Setup

- Create a thing in AWS IoT console and give it a name. Take note of the IoT endpoint in the IoT dashboard.
- Download certificates associated to that thing and store in a separate folder in this project for instance
- Create a `config.json` file that has the following structure

```
{
  "IoTEndpoint": "<your iot endpoint url>",
  "privatekey": "<your private key path>",
  "certificate": "<your certificate path>",
  "rootCA": "<your root ca path>",
  "thingName": "<your thing name>"
}
```

### Run

- Run `npm run start` and start typing the `w, a, s, d` keys followed by hitting enter.
- Watch the `$aws/things/<your thing name>/shadow/update/accepted` topic in the AWS IoT console for accepted updates to the thing shadow
