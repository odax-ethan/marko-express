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
// const {System} = require(__dirname +'/scr/core/core-0-0-3.js'); //cortex support components


// const system = new System(systemConfig)
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


app.get('/', function (req, res) {
    res.marko(indexTemplate, {
        deviceOBJ: systemConfig.systemConfig.devices,
        admin: systemConfig.systemConfig.admin,
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

              io.emit('stateUpdate', [{deviceID: "sensor1" ,value:1},{deviceID: "sensor2" ,value:2},{deviceID: "sensor3" ,value:3}, {deviceID: "sensor4" ,value:4},{deviceID: "sensor5" ,value:5}, {deviceID: "sensor6" ,value:6}]);



         socket.on('disconnect', function(){
            console.log('user disconnected');
         });
});
