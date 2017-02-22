var mqtt = require('mqtt');
var fs = require('fs');
var stdin = process.openStdin();

// arn:aws:iot:eu-west-1:849037323980:thing/GurraDesktop
// https://a15dqupkleyho9.iot.eu-west-1.amazonaws.com/things/GurraDesktop/shadow
// var client = mqtt.connect('mqtt://a15dqupkleyho9.iot.eu-west-1.amazonaws.com/things/GurraDesktop/shadow', {
//   key: fs.readFileSync('./certs/GurraDesktop.public.pem').toString(),
//   cert: fs.readFileSync('./certs/GurraDesktop.cert.pem').toString(),
//   ca: [fs.readFileSync('./certs/rootCA.pem').toString()],
//   rejectUnauthorized: false
// });



function connectToAWSMQTT(url, certs, callback){
  var client = mqtt.connect(url, {
    key: certs.key,
    cert: certs.cert,
    ca: certs.ca,
    rejectUnauthorized: false
  });
  console.log("client made");
  callback(null, client);
}




// var certs = {
//   key: fs.readFileSync('./certs/GurraDesktop.public.pem').toString(),
//   cert: fs.readFileSync('./certs/GurraDesktop.cert.pem').toString(),
//   ca: fs.readFileSync('./certs/rootCA.pem').toString()
// };

var certs = {
  key: fs.readFileSync('./kitscerts/GurrasPi-private.pem.key').toString(),
  cert: fs.readFileSync('./kitscerts/GurrasPi-certificate.pem.crt').toString(),
  ca: fs.readFileSync('./kitscerts/VeriSign-Class_3-Public-Primary-Certification-Authority-G5.pem').toString()
};

// connectToAWSMQTT('mqtt://a15dqupkleyho9.iot.eu-west-1.amazonaws.com/things/GurraDesktop/shadow', certs, function(err, client){
// connectToAWSMQTT('mqtt://axl1uxnehfk9n.iot.eu-west-1.amazonaws.com/things/GurrasPi/shadow', certs, function(err, client){
connectToAWSMQTT('mqtt://axl1uxnehfk9n.iot.eu-west-1.amazonaws.com', certs, function(err, client){
  console.log("listening to mqtt and keys");
  stdin.addListener("data", function(d) {
    var key = d.toString().trim();
    var direction = null;
    switch (key) {
      case 'w':
        direction = "up";
        break;
      case 'd':
        direction = "right";
        break;
      case 'a':
        direction = "left";
        break;
      case 's':
        direction = "back";
        break;
      default:
        direction = null;
    }
    const shadowUpdate = {"state": {"reported" : {"direction" : direction}}};
    client.publish('$aws/things/GurrasPi/shadow/update', JSON.stringify(shadowUpdate), function(mqttErr, granted){
      // console.log(mqttErr, granted);
    });
  });

  client.on('connect', function () {
    client.subscribe('direction');
    client.subscribe('$aws/things/GurrasPi/shadow/update/accepted');
  });

  client.on('message', function(topic, message){
    console.log(topic);
    console.log(JSON.parse(message.toString()));
  });





  // client.on('message', function (topic, message) {
  //   console.log("topic", topic);
  //   console.log("payload", message.toString()); // message is Buffer
  //
  //
  //   if (message.toString() === 'update1') {
  //     console.log(`client.publish('$aws/things/GurraDesktop/shadow/update', JSON.toString(shadowUpdate));`);
  //     client.publish('$aws/things/GurraDesktop/shadow/update', JSON.toString(shadowUpdate));
  //     client.publish('$aws/things/GurraDesktop/shadow/update', shadowUpdate);
  //   } else if (message.toString() === 'update2') {
  //     client.publish('presence', '2');
  //   }
  //
  //   // client.end();
  // });




});
