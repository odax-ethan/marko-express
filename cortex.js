require('marko/node-require');

const ip = require('ip'); // include ip
const express = require('express');
const five = require("johnny-five");
const ioBASE = require('socket.io');
const EventEmitter = require('events');
const markoPress = require('marko/express'); //enable res.marko
const lassoWare = require('lasso/middleware');

const indexTemplate = require('./scr/template/index.marko'); // marko base template
const systemConfig = require(__dirname +'/scr/data/systemConfig/systemConfig'); //cortex systemConfig
const {System} = require(__dirname +'/scr/core/core-0-0-2.js'); //cortex support components


const system = new System(systemConfig)
const systemIP  = ip.address();
const hostIP = '0.0.0.0';
const port = 8080;
const isProduction = (process.env.NODE_ENV === 'production');

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
require('lasso').configure({
    plugins: [
        'lasso-marko', // Allow Marko templates to be compiled and transported to the browser
        'lasso-sass'
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

const app = express();
const server = require('http').Server(app); // create http server instance through express
app.use(markoPress());
app.use(lassoWare.serveStatic());

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var ledSTATE = null
var sensorSTATE = null



const nodes = systemConfig.systemSETTINGS.nodes
const deviceBank = systemConfig.systemSETTINGS.devices
let nodeIDs = []
let nodeCarrier = []
let nodeMAX = 3
let deviceLIST = []


for (var i = 0; i < nodes.length; i++) {
  nodeIDs.push(nodes[i].nodeName)
}
// console.log(nodeIDs);
// console.log(deviceBank);
// console.log(nodeIDs[0]);
let ledARRAY = []
for (var i = 0; i < deviceBank.length; i++) {
    let caseName = deviceBank[i].nodeName
    if (caseName = nodeIDs[0]) {
      if (deviceBank[i].deviceTYPE === 'led') {
        console.log('its an led');
        deviceLIST.push({id:deviceBank[i].deviceID, type:deviceBank[i].deviceTYPE})
        ledARRAY.push(deviceBank[i].devicePIN)
      }else if (deviceBank[i].deviceTYPE === 'relay') {
        // console.log('its an relay');
      }else if (deviceBank[i].deviceTYPE === 'thermometer') {
        // console.log('its an Thermometer');
      }else if (deviceBank[i].deviceTYPE === 'button') {
        // console.log('its an button');
      }
    }

}




app.get('/', function (req, res) {
    res.marko(indexTemplate, {
        name: 'Frank',
        colors: ['red', 'green', 'blue']
    });
});

const systemSERVER = app.listen(port, hostIP, function () {
    console.log('Server started! Try it out:\nhttp://'+ systemIP+':' + port + '/');
    if (process.send) {
        process.send('online');
    }
});

const io = ioBASE(systemSERVER) // create socket.io sever systems
io.on('connection', function (socket) {
         console.log("client has connected");

         ledEmitter.on('led-update', (x) => {
           // console.log(`led state is ${x}`);
           socket.emit('ledSTATE',  x );
         })

         sensorEmitter.on('sensor-update', (x) => {
           // console.log(`sensor state is ${x}`);
           socket.emit('sensorSTATE',  x );
         })

         //send device listen
         socket.emit('deviceLIST', deviceLIST )


         socket.on('disconnect', function(){
            console.log('user disconnected');
         });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


var board = new five.Board({
  port: "COM6"
});


/// for each board create objects that can be placed into johnny classes

// console.log(ledARRAY);

// let node1LEDS = system.generateDEVICEarray2('led')
// let node1RELAYS = system.generateDEVICEarray2('relay')
// let node1TEMPS = system.generateDEVICEarray2('thermometer')
// let node1BUTTONS = system.generateDEVICEarray2('button')

// console.log(node1LEDS);
// console.log(node1RELAYS);
// console.log(node1TEMPS);
// console.log(node1BUTTONS);


// for (var i = 0; i < node1.length; i++) {
//   // console.log(node1[i].deviceNAME);
//   console.log(node1[i].devicePIN);
//
// }


// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {


  // Create a standard `led` component instance
  var ledTEST = new five.Leds(ledARRAY);

  this.repl.inject({
   // Allow limited on/off control access to the
   // Led instance from the REPL.
   on: function() {
     ledTEST.on();
     ledEmitter.emit('led-on')
   },
   off: function() {
     ledTEST.off();
     ledEmitter.emit('led-off')
   }
 });


 var thermometer = new five.Thermometer({
   controller: "DS18B20",
   pin: 6,
   freq: 15000
 });

 thermometer.on("change", function() {
   // console.log(this.celsius + "°C");

   sensorEmitter.emit('change', this.celsius);
   // console.log("0x" + this.address.toString(16));
 });



});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class MyEmitter extends EventEmitter {}

const ledEmitter = new MyEmitter();
ledEmitter.on('led-on', () => {
  console.log('led state is on');
  ledSTATE = 1
  ledEmitter.emit('led-update', ledSTATE)
})
ledEmitter.on('led-off', () => {
  console.log('led state is off');
  ledSTATE = 0
  ledEmitter.emit('led-update', ledSTATE)
})

const sensorEmitter = new MyEmitter();
sensorEmitter.on('change', (data) => {
  let newDATA = data
  sensorEmitter.emit('sensor-update', newDATA)
})

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
