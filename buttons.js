var wpi = require('wiring-pi');
wpi.setup('gpio');
var EventEmitter = require('events');

class ButtonEmitter extends EventEmitter{};
var _buttonEmitter = new ButtonEmitter();

// var pin = 18, buttonPin = 27;
var potentioPin = 12;



// wpi.pinMode(pin, wpi.OUTPUT);
// wpi.pinMode(buttonPin, wpi.INPUT);
wpi.pinMode(potentioPin, wpi.INPUT);

var light = true;
var lastButtonState = 0, currentButtonState = 0;

/*setInterval(function() {
  wpi.digitalWrite(pin, light ? wpi.HIGH : wpi.LOW);
  var buttonValue = wpi.digitalRead(buttonPin);
  light = buttonValue === 1 ? true : false;
  // console.log(light, buttonValue);
}, 25);*/
setInterval(function() {
	currentButtonState = wpi.digitalRead(potentioPin);
	if (lastButtonState !== currentButtonState) {
		lastButtonState = currentButtonState;
		_buttonEmitter.emit('changed', currentButtonState);
	}
	lastButtonState = currentButtonState;
}, 100);

module.exports = {
	read: function(){
		return wpi.digitalRead(potentioPin);
	},
	stream: _buttonEmitter
};
