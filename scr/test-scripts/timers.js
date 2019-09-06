// const moment = require('moment')
//

class CurrentDate {
  constructor() {
    this.currentTime = new Date()
    this.h = this.currentTime.getHours()
    this.m = this.currentTime.getMinutes()
  }

  timeOBJ(){
      return {
        currentTime : this.currentTime,
        h : this.h,
        m : this.m
      }
    }

}

class Timer {
  constructor(timerID, startH, startM, stopH, stopM ) {

    this.timerID = timerID

    this.stopH = stopH,
    this.stopM = stopM,
    this.startH = startH,
    this.startM = startM

    this.startDate = new Date()
    this.stopDate = new Date()

    // get utc offset and get it in hours
    this.utcOffset = this.startDate.getTimezoneOffset() / 60;

    //set startDates hours and correct for the UTC offset
    this.startDate.setHours(this.startH - this.utcOffset)
    this.startDate.setMinutes(this.startM)

    //set stopDates hours and correct for the UTC offset
    this.stopDate.setHours(this.stopH - this.utcOffset)
    this.stopDate.setMinutes(this.stopM)


    // if the startH after the stop hour generate array which represents when things are on and off
    if (this.startH > this.stopH) {
      this.timerARRAY = []
      for (var i = 0; i < 24; i++) {
        if (this.startH >  i && i < this.stopH ) {
            this.timerARRAY.push(1)
        } else if ( this.startH <  i && i > this.stopH ) {
          this.timerARRAY.push(1)
        } else {
          this.timerARRAY.push(0)
        }
      }
    }
    // console.log(this.timerARRAY);

  }

  test(timeOBJ){
    console.log(timeOBJ);

    /// if the starthour is == to or less then the stop hour
    if (this.startH <= this.stopH) {
         if (timeOBJ.h === this.startH) {
                        console.log('1');
                        if (this.startM >= timeOBJ.m) {
                          console.log("timer is on");
                        } else if (this.startM <= timeOBJ.m) {
                          console.log("timer is off");
                        }
          } else if (timeOBJ.h === this.stopH) {
                  console.log(4);
                      if (this.stopM >= timeOBJ.m) {

                        console.log("timer is on");
                      } else if (this.stopM <= timeOBJ.m) {
                        console.log("timer is off");
                      }
          } else if (this.startH < timeOBJ.h < this.stopH) {

                      if (this.stopM >= timeOBJ.m) {
                          console.log("timer is on");
                      } else if (this.stopM <= timeOBJ.m) {
                        console.log("timer is off");
                      }
          } else {
              console.log(4);
              console.log("timer is off");
              }
    } else if (this.startH > this.stopH) {   /// if the starthour greater then the stop hour
        if (this.timerARRAY[timeOBJ.h-1] === 1) {
                console.log(3);
                if (this.stopM > timeOBJ.m) {
                  console.log("timer is on");
                } else if (this.stopM < timeOBJ.m) {
                        console.log("timer is off");
                }

        } else {
          console.log("system should be on");
        }
      } else if (this.timerARRAY[timeOBJ.h] === 0) {
            console.log(2);
            if (this.stopM >= timeOBJ.m) {
                console.log("timer is on");
            } else if (this.stopM <= timeOBJ.m) {
              console.log("timer is off");
            }
      }

    }

  }


let testTimer = new Timer(21,43,5,12)
let now = new CurrentDate()

console.log(now.timeOBJ());
testTimer.test(now.timeOBJ())


class Sensor  {
  constructor() {

  }
  test(){

      // testSensor(){ // test if system should run sensors
      //   if (this.currentTime) {
      //       if (this.m === 20 || this.m === 0 || this.m === 40) {
      //          console.log("test sensors");
      //       } else {
      //         console.log("sensors are not ready");
      //       }
      //   }else {
      //     console.log('there was no date provided');
      //   }
      // }

  }
}


// state(timerObj){ // test if timer should be fired
//   let timer = timerObj
//
//   if (this.stopH === this.h && this.stopM === this.m) {
//     console.log("turn me off");
//   }
//
//   // if (moment().isBetween(this.stopH, this.startH);) {
//   //   console.log("turn me off");
//   // }
//
//
//
//   // stopH, stopM, startH, startM
// }


//
// let now = new Date()


// > this will run a sensor at the right time
// function  testTime(timer) {
//   let now = new CurrentDate()
//   // now.testSensor()
//   now.testTimer(timer)
// }
//
//
//
// const timer1 = new Timer(1,54,20,10)
// console.log(timer1.timerOBJ());
//
// const timer2 = new Timer(23,54,1,10)
// console.log(timer2.timerOBJ());
//
// const timer3 = new Timer(8,54,10,10)
// console.log(timer3.timerOBJ());
//
//
// //
// // let timer = {
// //   stopH : 10,
// //   stopM : 10,
// //   startH :20,
// //   startM : 10
// //
// // }
//
// // console.log(timer1.timerOBJ());
//
// testTime(timer1.timerOBJ())
// testTime(timer2.timerOBJ())
// testTime(timer3.timerOBJ())


// // > this will run a sensor at the right time
// function  testTime() {
//   let now = new CurrentDate()
//     now.currentTime()
//   // testTimer.test(now.currentTime())
// }
//
// testTime()
