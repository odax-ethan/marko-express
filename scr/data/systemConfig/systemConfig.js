exports.systemConfig = {
    opperationName : "GROW338",
    timerTESTrate: 3000,
    admin:"andrew",
    nodes: [
    {  id: "tent1",
       portName: "COM3",
       nodeName: "tent1"
     },
     {  id: "tent2",
        portName: "COM4",
        nodeName: "tent2"
      },
      {  id: "room",
         portName: "COM5",
         nodeName: "room"
       },
     ], // list of node for generation
    devices: [
      { deviceID: "sensor1", deviceTYPE:"thermometer", devicePIN: 6, deviceNODE:"tent1", controller: "DS18B20" },
      { deviceID: "sensor2", deviceTYPE:"thermometer", devicePIN: 7, deviceNODE:"tent1", controller: "DS18B20" },
      { deviceID: "sensor3", deviceTYPE:"thermometer", devicePIN: 6, deviceNODE:"tent2", controller: "DS18B20" },
      { deviceID: "sensor4", deviceTYPE:"thermometer", devicePIN: 7, deviceNODE:"tent2", controller: "DS18B20" },
      { deviceID: "sensor5", deviceTYPE:"thermometer", devicePIN: 6, deviceNODE:"room", controller: "DS18B20" },
      { deviceID: "sensor6", deviceTYPE:"thermometer", devicePIN: 7, deviceNODE:"room", controller: "DS18B20" },
    ],
    timers: [
    ] // list of all devices in the system
} //end of entire object
