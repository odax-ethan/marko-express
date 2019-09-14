var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("cortext");






  // let fname = null
  // let lname = null
  // let nname = null
  // let email = null
  // let password = null
  //
  // // fname = 'fname'
  // // lname = 'lname'
  // // nname = 'nname'
  // // email = 'email'
  // // password = 'password'
  //
  // var userOBJ = {
  //   fname:fname,
  //   lname:lname,
  //   nname:nname,
  //   email:email,
  //   password: password
  // }
  //
  // if (userOBJ.fname) {
  //   dbo.collection("users").insertOne(userOBJ, function(err, res) {
  //     if (err) throw err;
  //     console.log("1 document inserted");
  //     db.close();
  //   });
  // } else {
  //   console.log('no user info to submit');
  // }



  // var myquery = { fname: 'fname' };
  //
  // dbo.collection("users").deleteOne(myquery, function(err, obj) {
  //   if (err) throw err;
  //   console.log("1 document deleted");
  //   db.close();
  // });



  // var myquery = { nname: "loppy" };
  // var updatedVALES =  {fname: "Mickey"}
  // var newvalues = { $set: updatedVALES };
  // dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document updated");
  //   db.close();
  // });





  // dbo.collection("users").findOne({}, function(err, result) {
  //    if (err) throw err;
  //    console.log(result._id);
  //    db.close();
  //  });



  dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
  });

});
