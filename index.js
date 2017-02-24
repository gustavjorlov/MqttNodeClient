var mqtt = require('mqtt');
var fs = require('fs');
var stdin = process.openStdin();
var config = require('./config.json');

var IoTEndpoint = 'mqtt://'+config.IoTEndpoint;
var thingName = config.thingName;
var button = require('./buttons.js');

button.stream.on('changed', function(value){
	console.log(value);
});

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
function keyMapper(key) {
  return key === 'w' ? 1
       : key === 'd' ? 90
       : key === 'a' ? 270
       : key === 's' ? 180
       : null;
}
function printMqttMessage(topic, message){
  console.log(topic, ':', JSON.parse(message.toString()));
}
function updateThing(client, thing, payload){
  client.publish('$aws/things/'+thing+'/shadow/update', JSON.stringify({
    "state": {
      "reported" : {
        "direction" : payload,
        "color": "red",
        "speed": 20
      }
    }
  }));
}

setupAndListenToConnection(IoTEndpoint, certs, function(client){
  stdin.addListener("data", function(pressedKey) {
    var direction = keyMapper(pressedKey.toString().trim());
    updateThing(client, thingName, direction);
  });

  client.subscribe('direction');
  client.subscribe('$aws/things/'+thingName+'/shadow/update/accepted');

  client.on('message', printMqttMessage);
});
