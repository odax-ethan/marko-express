require('marko/node-require');

const ip = require('ip'); // include ip
const express = require('express');
const five = require("johnny-five");
const ioBASE = require('socket.io');
const EventEmitter = require('events');

const markoPress = require('marko/express'); //enable res.marko
const lassoWare = require('lasso/middleware');
const indexTemplate = require('./scr/template/index.marko');


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
           console.log(`led state is ${x}`);
           socket.emit('ledSTATE',  x );
         })

         socket.on('disconnect', function(){
            console.log('user disconnected');
         });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


var board = new five.Board({
  port: "COM6"
});

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {

  // this.pinMode(13, this.MODES.OUTPUT);
  //
  // this.loop(500, () => {
  //   // Whatever the last value was, write the opposite
  //   this.digitalWrite(13, this.pins[13].value ? 0 : 1);
  // });

  // Create a standard `led` component instance
  var led = new five.Led(13);

  this.repl.inject({
   // Allow limited on/off control access to the
   // Led instance from the REPL.
   on: function() {

     led.on();
     ledEmitter.emit('led-on')
   },
   off: function() {
     led.off();
     ledEmitter.emit('led-off')
   }
 });

});

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






// board.on("ready", function() {
//
//   // Create a standard `led` component instance
//   var led = new five.Led(13);
//
//   // "blink" the led in 500ms
//   // on-off phase periods
//   led.blink(500);
// });
