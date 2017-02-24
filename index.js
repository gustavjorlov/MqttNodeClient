var mqtt = require('mqtt');
var fs = require('fs');
var config = require('./config.json');
var IoTEndpoint = 'mqtt://'+config.IoTEndpoint;
var thingName = config.thingName;
var button = require('./buttons.js');
var speed = 50;

var certs = {
  key: fs.readFileSync(config.privatekey).toString(),
  cert: fs.readFileSync(config.certificate).toString(),
  ca: fs.readFileSync(config.rootCA).toString()
};

function connectToAWSMQTT(url, certs){
  return mqtt.connect(url, {
    key: certs.key,
    cert: certs.cert,
    ca: certs.ca,
    rejectUnauthorized: false
  });
}
function setupAndListenToConnection(IoTEndpoint, certs, connected){
  var client = connectToAWSMQTT(IoTEndpoint, certs);
  client.on('connect', function(){
    connected(client);
  });
}
function printMqttMessage(topic, message){
  console.log(topic, ':', JSON.parse(message.toString()));
}
function updateThing(client, thing, payload){
  client.publish('$aws/things/'+thing+'/shadow/update', JSON.stringify({
    "state": {
      "reported" : {
        "direction" : payload.direction,
        "color": payload.color,
        "speed": payload.speed
      }
    }
  }));
}

function calculateDirection(buttonValue, directionState){
	return buttonValue === 1 ? ((directionState + 90) >= 360 ? 2 : directionState + 90) : directionState;
}

setupAndListenToConnection(IoTEndpoint, certs, function(client){
  var directionState = 2;
  button.stream.on('changed', function(buttonValue){
	directionState = calculateDirection(buttonValue, directionState)
    updateThing(client, thingName, {
	  direction: directionState,
	  speed: buttonValue === 1 ? speed : 0,
	  color: buttonValue === 1 ? "#74c689" : "#046e1f"
	});
  });

  client.subscribe('$aws/things/'+thingName+'/shadow/update/accepted');
  client.on('message', printMqttMessage);
});
