var mqtt = require('mqtt');
var fs = require('fs');

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

var certs = {
  key: fs.readFileSync('./certs/GurraDesktop.public.pem').toString(),
  cert: fs.readFileSync('./certs/GurraDesktop.cert.pem').toString(),
  ca: fs.readFileSync('./certs/rootCA.pem').toString()
}

connectToAWSMQTT('mqtt://a15dqupkleyho9.iot.eu-west-1.amazonaws.com/things/GurraDesktop/shadow', certs, function(err, client){
  console.log("listening");
  client.on('message', function (topic, message) {
    console.log(topic, message.toString()); // message is Buffer

    const shadowUpdate = {
      'my': 'shadow'
    };
    if (message.toString() === 'update1') {
      console.log(`client.publish('$aws/things/GurraDesktop/shadow/update', JSON.toString(shadowUpdate));`);
      client.publish('$aws/things/GurraDesktop/shadow/update', JSON.toString(shadowUpdate));
    } else if (message.toString() === 'update2') {
      client.publish('presence', '2');
    }

    // client.end();
  });

  client.on('connect', function () {
    client.subscribe('presence');
    client.publish('presence', 'Hello mqtt');
  });


});
