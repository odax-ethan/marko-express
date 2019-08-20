const express = require('express');
const app = express();
const server = require('http').Server(app);
const ip = require('ip');
// const terminalLink = require('terminal-link');
const ioBASE = require('socket.io');
const EventEmitter = require('events');

class System{
  constructor(systemConfig) {
    this.systemConfig = systemConfig
    this.deviceBank = this.systemConfig.config.systemSETTINGS.devices
    this.nodeConfig = this.systemConfig.config.systemSETTINGS.nodes
    // this.nodeCOUNT = this.nodeConfig.length; // named nodeConfig length
    this.timerTESTrate = this.systemConfig.config.systemSETTINGS.timerTESTrate
    this.systemIP = ip.address();
    // this.ioSystem = this.systemConfig.config.systemSETTINGS.ioSystem

  }

  preload() {
    console.log('the system is loading configuration...');
    //load in all of the configurations
   }

  systemDebug() {
    // console.log(this.timerTESTrate);
  }

  generatedPorts(){
   // name rode of node configs
   const nodeConfig = this.nodeConfig
   // let io = this.ioSystem
   // console.log(nodeConfig);

   //array to hold generated ports array
   const generatedPorts = []; //array to hold generated ports array

   const portIds =  nodeConfig.map(nodeConfig => nodeConfig.id); // namedp ortIds
   const portName =  nodeConfig.map(nodeConfig => nodeConfig.portName); // named portName
   const nodeName = nodeConfig.map(nodeConfig => nodeConfig.nodeName); // named nodeName
   const nodeCOUNT = nodeConfig.length; // named nodeConfig length
   for (let i = 0; i < nodeCOUNT; i++) {
     let id = portIds[i]; // per nodeCount \select portIds
     let port =  portName[i] // per nodeCount select portNname
     // console.log(portIds[i]);
     generatedPorts.push({id,port}) // push into generatedPorts[]

   }


   // const ioSystem = this.nodeConfig.map(nodeConfig => this.nodeConfig.ioSystem); // named nodeName
   // (!this.ioSystem !==  null) ?  generatedPorts.push({ io }) : console.log('failed');
   return generatedPorts
 }

  generateDEVICEarray(deviceTYPE){
   let nodeConfig = this.nodeConfig
   let nodeCOUNT = this.nodeCOUNT //named nodeConfig length

   let deviceMAP  =  nodeConfig.map(nodeConfig => nodeConfig[deviceTYPE]);
   let deviceARRAY = []
       //from the nodes look for relays to inits
       for (let i = 0; i < nodeCOUNT; i++) { //for each nodes
         var data = []

         for (let x = 0; x < deviceMAP[i].length; x++) { // at relay per node
           var deviceNAME = (deviceMAP[i][x].deviceID) ? deviceMAP[i][x].deviceID : null
           var devicePINS = (deviceMAP[i][x].pin) ? deviceMAP[i][x].pin :  null
           var deviceTYPE = (deviceMAP[i][x].type) ? deviceMAP[i][x].type : null
           var deviceCONTROLLER = (deviceMAP[i][x].controller) ? deviceMAP[i][x].controller : null
           var deviceDETAILS = (deviceMAP[i][x].details) ? deviceMAP[i][x].details : null
           var deviceDETAILS = (deviceMAP[i][x].details) ? deviceMAP[i][x].details : null
           // console.log(test);

          data.push({ pins:devicePINS, name:deviceNAME, type:deviceTYPE, controller: deviceCONTROLLER,  details: deviceDETAILS });
         }
         deviceARRAY.push(data); // push full data pin set to relay pin array
       }
       return deviceARRAY
 }

  generateDEVICEarray2(deviceTYPE){
    let devicebank = this.deviceBank
    let deviceCount = devicebank.length
    let currentData = []
    // console.log(deviceCount);
    switch (deviceTYPE) {
      case "button":
        // console.log('this works');
          for (var i = 0; i < deviceCount; i++) {
            if (devicebank[i].deviceTYPE === "button") {
              var deviceNAME = (devicebank[i].deviceID) ? devicebank[i].deviceID : Error('name is missing')
              var devicePIN = (devicebank[i].devicePIN) ? devicebank[i].devicePIN : Error('name is missing')
              // console.log(devicebank[i].deviceID);
              currentData.push({deviceNAME:deviceNAME,devicePIN:devicePIN })
            }
          }
        break;
        case "led":
        for (var i = 0; i < deviceCount; i++) {
          if (devicebank[i].deviceTYPE === "led") {
            var deviceNAME = (devicebank[i].deviceID) ? devicebank[i].deviceID : Error('name is missing')
            // console.log(devicebank[i].deviceID);
            currentData.push({deviceNAME:deviceNAME })
          }
        }
        break;
      default:
    }
    return currentData
  }

  looper(time, callback){
    var handler = function() {
        callback(function() {
          clearInterval(interval);
        });
      };
      var interval = setInterval(handler, time);
      return this
  }

  generateWEBservices(){

    ////////////////// define ip and ports/////////////////////////////////////
    const hostname = '0.0.0.0'; //create host blind to current ip address
    const port = 3000; //set port for system
    // const appLINK = terminalLink(`http://${this.systemIP}:${port}/`,'');// create clickable link in terminal

    /////////////create severs based on systems current ip address/////////////
    const systemSERVER =  server.listen(port, hostname, () => {
    console.log('visit ' + appLINK + ' to access system app');
    });

    // app.use(express.static(__dirname + '/public')); // try not to use static files


    // create IO server////////////////////////////////////////////////////////
    const io = ioBASE(systemSERVER) // create socket.io sever systems

    //////////////////////// DEFIRE EXPRESS PAGES //////////////////////////////////
    app.get('/', require(__dirname +'/views/hud')); //create request which is mapped to pages index.js
    app.get('/settings', require(__dirname +'/views/settings'));
    app.get('/docs', require(__dirname +'/views/docs'));
    app.get('/feedback', require(__dirname +'/views/feedBack'));
    app.get('/test', require(__dirname +'/views/test'));

    //////////////////////////////socket interactions///////////////////////////////////////////////
    io.on('connection', function (socket) {
          console.log("client has connected");

//////////////////////////////////// chat system ///////////////////////////////
      socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });

      socket.emit('systemConfig', "system on");
      // // socket.emit('systemConfig', {"timers": timerBANK})
      // socket.on('createTIMER', function(data){
      //    // console.log(data);
      //     let newTIMER = {
      //                  name: data.timerID,
      //                  device: data.deviceID,
      //                  type:   "FB",
      //                  details: data.details,
      //                  startHOUR : Number(data.startHOUR),
      //                  startMINUTE : Number(data.startMINUTE),
      //                  stopHOUR : Number(data.stopHOUR),
      //                  stopMINUTE : Number(data.stopMINUTE),
      //     }
      //     timerBANK.push(newTIMER)
      //     console.log(timerBANK);
      // });
      //
      // socket.on('saveSETTINGS', function() {
      //
      //
      //   // for (var i = 0; i < nodeCOUNT; i++) {
      //   //   preHANDLERnode[i]
      //   // }
      //   //
      //   // let preHANDLERrelay = util.inspect(relayBANK[0], false, 2, false)
      //   // let preHANDLERsensor = util.inspect(sensorBANK[0], false, 2, false)
      //   // let preHANDLERled = util.inspect(ledBANK[0], false, 2, false)
      //   let preHANDLERtimers = util.inspect(timerBANK, false, 2, false)
      //
      //   // let configWRITE = `exports.config = { relay:` + preHANDLERrelay + ` ,led:`+ preHANDLERled +`, sensor:` + preHANDLERsensor + `,timers:`+ preHANDLERtimers + `}`
      //
      //
      //   let configWRITE = `exports.config = { timers:`+ preHANDLERtimers + `}`
      //
      //
      //   fs.writeFile(__dirname +'/data/systemConfig/testsystemConfig.js', configWRITE , function (err) {
      //     if (err) throw err;
      //     console.log('Saved!');
      //   });
      //
      // })
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
});



  }


}

class Led extends System {
  constructor() {

  }

  fish(){
    console.log("thats a fish");
  }
}

module.exports = {System, Led}
