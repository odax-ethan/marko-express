exports.config = {
  systemSETTINGS: {
    opperationName : "albo",
    timerTESTrate: 150,
    nodes: [
    {  id: "A",
       portName: "COM3",
       nodeName: "node1"
     }
     ], // list of node for generation
    devices: [
      { deviceID: "flightLEDbttom",deviceTYPE:"led", devicePIN: 1, actioneSTATE:"always", action:"blink", duration: 3000, node:"node1"},
      { deviceID: "button1", deviceTYPE:"button", devicePIN: 3, actioneSTATE:"always", node:"node1" }
    ] // list of all devices in the system
    // ioSystem: `new Raspi()`,
    // nodes : [
      // {  id: "A",
      //    portName: "COM3",
      //    nodeName: "node1",
      //    led : [
      //         {deviceID: "flightLIGHTbotton" , pin : 3, : details:"main power source relay"},
      //         {deviceID: "flightLIGHTwingTIPS" , pin : 34, details:"main power source relay"}
      //       ],
      //    sensor : [
      //       {deviceID: "tempurature1" , pin : 3, type: "digital", controller: "DS18B20", freq: 10000},
      //       {deviceID: "tempurature2" , pin : 3, type: "i2c", controller: "SI7020",  freq: 10000}
      //     ]
      // }
    // ],
    // gpio : [{
    //   led : [
    //        {deviceID: "flightLIGHTbotton" , pin : 3, details:"main power source relay"},
    //        {deviceID: "flightLIGHTwingTIPS" , pin : 34, details:"main power source relay"}
    //      ],
    //   sensor : [
    //      {deviceID: "tempurature1" , pin : 3, type: "digital", controller: "DS18B20", freq: 10000},
    //      {deviceID: "tempurature2" , pin : 3, type: "i2c", controller: "SI7020",  freq: 10000}
    //    ]
    //  }]
  }//end of systemSETTINGS object
} //end of entire object
