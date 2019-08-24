<canvas id="myChart"></canvas>


var ctx = document.getElementById('myChart').getContext('2d');

var array1 = [34,32,41,43,33,14]
var array2 = [33,32,43,21,43,15]
var array3 = [36,32,38,21,23,10]
var arrayTHANG = []

for ( var i = 0 ; i < array1.length; i++){


  	let avg = array1[i] + array2[i] + array3[i]
    let avgF = avg / 3
    arrayTHANG.push(avgF)
  

}

console.log(arrayTHANG)
var delayInMilliseconds = 1000; //1 second

setTimeout(function() {
  //your code to be executed after 1 second
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'last years monthly avg',
            borderColor: 'rgb(255, 202, 204)',
            data: arrayTHANG,
            fill: false
        },
        {
            label: 'This years readings',
            borderColor: 'rgb(255, 50, 104)',
            data: [36,32,38,21,23,13],
            fill: false
        }],
        
    },

    // Configuration options go here
    options: {}
});
}, delayInMilliseconds);


