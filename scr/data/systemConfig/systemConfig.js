exports.systemSETTINGS = {
    opperationName : "GROW338",
    timerTESTrate: 150,
    nodes: [
    {  id: "A",
       portName: "COM3",
       nodeName: "node1"
     }
     ], // list of node for generation
    devices: [
      { deviceID: "red", deviceTYPE:"led", devicePIN: 13, node:"node1"},
      { deviceID: "trigger", deviceTYPE:"button", devicePIN: 3, node:"node1" },
      { deviceID: "fan1", deviceTYPE:"relay", devicePIN: 7, node:"node1" },
      { deviceID: "sensor1", deviceTYPE:"thermometer", devicePIN: 6, node:"node1", controller: "DS18B20" },
      { deviceID: "blue", deviceTYPE:"led", devicePIN: 8, node:"node1"},
    ],
    timers: [
      {timmerID: 0, deviceID: 'fan1', startH : 12, startM: 30, stopH: 5, stopM:30}
    ] // list of all devices in the system
} //end of entire object
