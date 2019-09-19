require('marko/node-require');

const ip = require('ip'); // include ip
const express = require('express');
const five = require("johnny-five");
const ioBASE = require('socket.io');
const EventEmitter = require('events');
const markoPress = require('marko/express'); //enable res.marko
const lassoWare = require('lasso/middleware');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


const indexTemplate = require('./scr/template/index.marko'); // marko base template
const {systemConfig}= require(__dirname +'/scr/data/systemConfig/systemConfig'); //cortex systemConfig
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

////////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {

    // connect to db and get current readings and send to clinet
    let currentDataOBJ = {}


    res.marko(indexTemplate, {
        deviceOBJ: systemConfig.devices,
        admin: systemConfig.admin,
        currentData : currentDataOBJ
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

        // on connection get current readings from the server and serve them to the clinet
        // look at device list then create names need to search db for their values -
        // pull names and push them into a object
       //  push object to the client
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;

          var dbo = db.db("cortex");
          // let initData = []
          for (var i = 0; i < deviceBank.length; i++) {

            let collectionName = "sensor_data_" + deviceBank[i].deviceID
            let data = dbo.collection(collectionName).find().limit(1).sort({$natural:-1}).toArray(function(err, result) {
              if (err) throw err;
              // console.log(result[0]);
              socket.emit('initData', result[0])
              // initData.push(result[0])
            });
          }
        });

        statusEmitter.on('systemStatus', (x) => {
            socket.emit('systemStatus',  x );
        })

        // flash sensor data to mongo db
        let mockStatus = 'All nodes are connected and opperating normally'
        statusEmitter.emit('systemStatus', mockStatus)

        sensorEmitter.on('sensor-socket-update', (x) => {
          // console.log(`sensor state is ${x}`);
          socket.emit('stateUpdate',  x );
          // console.log('data to sockets: ' + x);
        })



         socket.on('disconnect', function(){
            console.log('user disconnected');

            statusEmitter.removeListener('systemStatus', mockStatus)

            statusEmitter.removeListener('systemStatus', (x) => {
                socket.emit('systemStatus',  x );
            })

            sensorEmitter.removeListener('sensor-socket-update', (x) => {
              // console.log(`sensor state is ${x}`);
              socket.emit('stateUpdate',  x );
              // console.log('data to sockets: ' + x);
            })

             // rr.removeListener("refresh-"+boardname, refreshHandler);
         });

});

////////////////////////////////////////////////////////////////////////////////





var ports = []; // ports array that will be used to fill the j5 board
let nodeIDs = [] // create array of just node/port ids
// fill ports[]
const nodes = systemConfig.nodes
for (var i = 0; i < nodes.length; i++) {
  nodeIDs.push(nodes[i].id) // fill nodeIDs[]
  ports.push(nodes[i]) // fill ports[]
}




const deviceBank = systemConfig.devices // create reference to devices

// let ledList = [] // PARSED LED ARRAY
let  thermometerList = [] // PARSED thermometer LIST
let relayList = [] // parsed Relay List

for (var i = 0; i < deviceBank.length; i++) {

    if (deviceBank) {
        if (deviceBank[i].deviceTYPE === 'led') {
          // console.log('its an led');
           // ledList.push({pin:deviceBank[i].devicePIN})
        }else if (deviceBank[i].deviceTYPE === 'relay') {
         // relayList.push({id:deviceBank[i].deviceID, pin: deviceBank[i].devicePIN,  type: deviceBank[i].relayType, board: deviceBank[i].deviceNode})
        }else if (deviceBank[i].deviceTYPE === 'thermometer') {
          thermometerList.push({id:deviceBank[i].deviceID, controller:deviceBank[i].controller, pin: deviceBank[i].devicePIN, board: deviceBank[i].deviceNODE, freq: deviceBank[i].freq})
          // console.log('its an Thermometer');
        }else if (deviceBank[i].deviceTYPE === 'button') {
          // console.log('its an button');
        }
    } else {
      console.log('there are no nodes to generate');
    }
}



////////////////////////////////////////////////////////////////////////////////


new five.Boards(ports).on("ready", function() {


      // test for each instance of board test againt deveice generators
      this.each(function(board) {

        // test generate list for thermometer class devices and create system
         for (var i = 0; i < thermometerList.length; i++) {
              if (thermometerList[i].board === board.id) {
                let varname = thermometerList[i].id
                 // console.log(thermometerList[i]);
                 let value = new five.Thermometer({controller: thermometerList[i].controller, pin: thermometerList[i].pin, board:board, freq: thermometerList[i].freq});
                 this[varname] = value;
                 this[varname].on("data", function() {
                 // console.log(varname+ ": "+this.celsius + "°C");

                 // let transmitData = {deviceID: varname, value: this.celsius }
                 let transmitData = {deviceID: varname, value: this.fahrenheit }
                 sensorEmitter.emit('new', transmitData);
                   // console.log("0x" + this.address.toString(16));
                 });

                 console.log(`created the ${thermometerList[i].id} device for the ${board.id} node`);
              } else {
                console.log(`device was not create for the ${board.id} node`  );
              }
         }

    });


});



/////////////////////////////////////////////////////////////////////////////////


class systemEmitter extends EventEmitter {}

const sensorEmitter = new systemEmitter(); //create event around the sensor


//sensor base event
sensorEmitter.on('new', (data) => {
  // console.log(data);
  sensorEmitter.emit('sensor-socket-update', data)
  sensorEmitter.emit('sensor-db-update', data)
})

// flash sensor data to socket
// sensorEmitter.on('sensor-socket-update', (x) => {
//   // console.log(`sensor state is ${x}`);
//   // socket.emit('sensorSTATE',  x );
//   // console.log('data to sockets: ' + x);
// })

// flash sensor data to mongo db
sensorEmitter.on('sensor-db-update', (x) => {


  //sort by sensor name and put in correct db
  // create db sensor_data_(deviceID)

  let collectionName = "sensor_data_" + x.deviceID
  // console.log(collectionName);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("cortex");

    var dataOBJ = {deviceID: x.deviceID , value: x.value, time: new Date()};

    dbo.collection(collectionName).insertOne(dataOBJ, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });

  });

  // console.log('data to db: ' + x);


})



const statusEmitter = new systemEmitter(); //create event around the sensor



// TODO: update specific values in the database -
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   var myquery = { address: "Valley 345" };
//   var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
//   dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
//     if (err) throw err;
//     console.log("1 document updated");
//     db.close();
//   });
// });

// when client is first connected - first get values from data base -
// get take list of current devices  - interpalate names -
// for each device - get current collections
// get last entry for each
// create object of all devices
// send via socket or via marko on load
// then if event happens on the server send data point to update ui
// via sockets and use deviceID to target correct placeholder








////////////////////////////////////////////////////////////////////////////////
