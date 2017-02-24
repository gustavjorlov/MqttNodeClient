# Node Client for MQTT
## Connecting to the AWS IoT platform

This needs to run on a Raspberry Pi 3

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

- Run `npm run start` and connect a button to GPIO port 12.
- As you press your button, watch the `$aws/things/<your thing name>/shadow/update/accepted` topic in the AWS IoT console for accepted updates to the thing shadow
