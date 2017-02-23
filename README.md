# Node Client for MQTT
## Connecting to AWS IoT platform

### Setup

- Create a thing in AWS IoT console and give it a name.
- Download certificates associated to that thing and store in a separate folder in this project for instance
- Create a `config.json` file that has the following structure

 ```
 {
   "IoTEndpoint": "<Your iot endpoint url>",
   "privatekey": "<Your private key path>",
   "certificate": "<Your certificate path>",
   "rootCA": "<Your root ca path>",
   "thingName": "<Your thing name>"
 }
 ```
