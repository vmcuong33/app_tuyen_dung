/*var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
var ObjectId = require('mongodb').ObjectId;
server.listen(process.env.PORT || 5000);
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://vmcuong:abc123qwe@cluster0-shard-00-00-yiozv.mongodb.net:27017,cluster0-shard-00-01-yiozv.mongodb.net:27017,cluster0-shard-00-02-yiozv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
//var url = "mongodb://localhost:27017/mydb";*/


const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
var fs = require("fs");
var ObjectId = require('mongodb').ObjectId;
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://vmcuong:abc123qwe@cluster0-shard-00-00-yiozv.mongodb.net:27017,cluster0-shard-00-01-yiozv.mongodb.net:27017,cluster0-shard-00-02-yiozv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
//var url = "mongodb://localhost:27017/mydb";

io.on('connection', (socket) => {
console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

socket.on("client-send-data-from-result",function(data){
                console.log("result");
                console.log(data.searchtext);

              MongoClient.connect(uri, function(err, db) {
				  
              if (data.searchtext=="") var findquery={};
              else {
					value ='\"' + data.searchtext + '\"'
					var findquery={$text: {$search: value}};
					
			  }
					var newQuery = "Salary" ;
					var newValue = { $gt: data.filter2 };
					findquery[newQuery] = newValue ;
					
					if(data.filter1==1)
					{
						var newQuery = "Experience" ;
					var newValue = /^K/;
					findquery[newQuery] = newValue ;
					}
					var sortquery={'_id' : -1};
					if(data.sort==1) {
						sortquery={'Salary': -1,'_id' : -1};
						
					}
					console.log();
					
              //var findquery={};
                   db.collection("Job").find(findquery).limit(10).sort(sortquery).toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result[0]);
                        var jsonObj = {

                                                                             							}

                        							var i;

                        							for(i=0; ; i++){
                        							if (result[i]==="null" || result[i]===null ||result[i]==="" || typeof result[i] === "undefined") {
                                                                                                                                                                                        break;
                                                                                                                                                                                    }
                        								var newJob = "Job" + i;
                        								var newValue = result[i];
                        								jsonObj[newJob] = newValue ;
                        								jsonObj[newJob]["Month"] = result[i]._id.getTimestamp().getMonth();
                        								jsonObj[newJob]["Day"] = result[i]._id.getTimestamp().getDate();

                        							}

                        							console.log(jsonObj);
                  socket.emit('server-send-data-to-result',jsonObj);socket.disconnect(true);
                  db.close();

                });




    });
    });
	
	
	
  socket.on("client-send-companyinfo",function(data){
        //console.log(data);
       // console.log(data.Name);

        MongoClient.connect(uri, function(err, db) {
          if (err) throw err;


                      // lay id user hien tai
                      // lay id cong ty cua user ฤ‘รณ
                      // update thong tin cong ty
                       var query = { Email: data.Email };



                                            db.collection("Users").find(query).toArray(function(err, resultuser) {
                                              if (err) throw err;
                                              console.log(resultuser);// lay id user hien tai
                                              var myquery = {  "_id" :  ObjectId(data._id) };
                                                                        var newvalues = { iduser:resultuser[0]._id,
                                                                                          Name: data.Name,
                                                                                         Address: data.Address,
                                                                                         Description:data.Description };
                                                                        db.collection("CompanyInfo").updateOne(myquery, newvalues, function(err, res) {
                                                                          if (err) throw err;
                                                                          console.log("1 document updated");
                                                                          console.log(data._id);

                                                                        });

                                                                         db.collection("CompanyInfo").find({}).toArray(function(err, result) {
                                                                                                if (err) throw err;
                                                                                                console.log(result);socket.disconnect(true);
                                                                                              db.close();
                                                                                              });







                                              });













          /*db.createCollection("CompanyInfo", function(err, res) {
              if (err) throw err;
              console.log("Collection created!");

            });*/
             /*var myquery = { Name: data.Name };
                          db.collection("CompanyInfo").deleteOne(myquery, function(err, obj) {
                            if (err) throw err;
                            console.log("1 document deleted");*/


         /* var myobj = { Name: data.Name,
                        Address: data.Address,
                         Description:data.Description};*/
          /*db.collection("CompanyInfo").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });*/



        });







  });
  socket.on("companyinfo-receive-data-from-server",function(data){
    MongoClient.connect(uri, function(err, db) {
                     var query = { Email: data.Email };



                      db.collection("Users").find(query).toArray(function(err, resultuser) {
                        if (err) throw err;
                        console.log(resultuser);
                        var query = { iduser: resultuser[0]._id };
                      db.collection("CompanyInfo").find(query).toArray(function(err, result) {
                                              if (err) throw err;
                                              console.log(result);
                                              db.close();
                                              socket.emit('server-send-data-to-Company-info',result[0]);socket.disconnect(true);
                  });
                  });
});
});
  socket.on("client-send-data-from-rating",function(data){


            MongoClient.connect(uri, function(err, db) {
                 var query = { _id: ObjectId(data.Id) };
                 db.collection("CVs").find(query).toArray(function(err, result) {
                     if (err) throw err;
                     console.log(result);
                     socket.emit('server-send-data-to-rating',result[0]);socket.disconnect(true);



              });





  });
   });
socket.on("client-send-data-from-rating2",function(data){



console.log(data);
MongoClient.connect(uri, function(err, db) {
if (err) throw err;
  var myquery = { _id: ObjectId(data._id) };
  data._id=ObjectId(data._id);
  data.IdUser=ObjectId(data.IdUser);
  data.IdJob=ObjectId(data.IdJob);
  var newvalues = data;
  db.collection("CVs").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();socket.disconnect(true);
  });

});



   });

 socket.on("client-send-data-from-detail-job",function(data){


            MongoClient.connect(uri, function(err, db) {
                var query = { Email: data["Email"] };

                  if (err) throw err;
                  db.collection("Users").find(query).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                       //socket.emit('server-send-data-to-apply1',result[0]);
                       data["Email"]=result[0]._id;
                       console.log(data["Email"]);
                       console.log(data["Email"]);
                                         var query = { IdJob: ObjectId(data.idcongviec),IdUser: data["Email"]};
                                         db.collection("CVs").find(query).toArray(function(err, result) {
                                                              if (err) throw err;
                                                               if (result[0]==null) data["kq"]=1;else data["kq"]=0;
                                                              /*if (data["Email"]==result[0].IdUser) result[0].applyable=1;
                                                              else result[0].applyable=0;console.log(result);*/
                                                              var query = { _id: ObjectId(data.idcongviec) };
                                                                               db.collection("Job").find(query).toArray(function(err, result) {
                                                                                   if (err) throw err;

                                                                                   /*if (data["Email"]==result[0].IdUser) result[0].applyable=1;
                                                                                   else result[0].applyable=0;console.log(result);*/
                                                                                   result[0].kq=data["kq"];
                                                                                   console.log(result)
                                                                                   socket.emit('server-send-data-to-detail-job',result[0]);
                                                                               var query = { _id: result[0].IdCompany };
                                                                                                                db.collection("CompanyInfo").find(query).toArray(function(err, result1) {
                                                                                                                    if (err) throw err;
                                                                                                                    console.log(result1);
                                                                                                                    socket.emit('server-send-data-to-detail-job2',result1[0]);
                                                                                                                    db.close();socket.disconnect(true);


                                                                                                             });


                                                                            });







                                                              });

                  });








  });
   });
    socket.on("client-send-data-from-cv-apply-job",function(data){
    x=ObjectId(data["IdJob"]);
    delete data["IdJob"];
    data["IdJob"]=x;console.log(data);

    MongoClient.connect(uri, function(err, db) {
    var query = { Email: data["Email"] };

      if (err) throw err;
      db.collection("Users").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
            data["IdUser"]=result[0]._id;
            data["Name"]=result[0].Name;
            data["Age"]=result[0].Age;
            data["Sex"]=result[0].Sex;

            data["Rating1"]=-1;
            data["Rating2"]=-1;
            data["Rating3"]=-1;
            data["Rating4"]=-1;
            data["Rating5"]=-1;
            data["Rating6"]=-1;



            delete data["Email"];
            db.collection("CVs").insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");

              });

        db.close();socket.disconnect(true);
      });

    });

});
socket.on("client-send-data-from-cv-Apply1",function(data){


    MongoClient.connect(uri, function(err, db) {
    var query = { Email: data["Email"] };

      if (err) throw err;
      db.collection("Users").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
           socket.emit('server-send-data-to-apply1',result[0]);
        db.close();socket.disconnect(true);
      });

    });

});
socket.on("client-send-data-from-joblistdang",function(data){

console.log(data.Email);
              MongoClient.connect(uri, function(err, db) {
                db.collection("Users").find({Email:data.Email}).toArray(function(err, result) {



                                               // console.log(result);
                                                db.collection("CompanyInfo").find({iduser:result[0]._id}).toArray(function(err, result) {



                                                                                                //console.log(result);

                                                         db.collection("Job").find({IdCompany:result[0]._id}).toArray(function(err, result) {



                                                                    console.log(result);
                                                                    var jsonObj = {

                                                                                                                                                 							}

                                                                                            							var i;

                                                                                            							for(i=0;; i++){
                                                                                            							if (result[i]==="null" || result[i]===null ||result[i]==="" || typeof result[i] === "undefined") {
                                                                                                                                    break;
                                                                                                                                }

                                                                                            								var newJob = "Job" + i;
                                                                                            								var newValue = result[i];
                                                                                            								jsonObj[newJob] = newValue ;

                                                                                            							}

                                                                                            							console.log(jsonObj);
                                                                                      socket.emit('server-send-data-to-joblistdang',jsonObj);socket.disconnect(true);







                                                                                                                                                         })




                                                                                                });





                                                });



                   /*db.collection("Job").find({}).toArray(function(err, result) {
                  if (err) throw err;
                  //console.log(result[0]);
                        var jsonObj = {

                                                                             							}

                        							var i;

                        							for(i=0; i<=1; i++){
                        								var newJob = "Job" + i;
                        								var newValue = result[i];
                        								jsonObj[newJob] = newValue ;

                        							}

                        							console.log(jsonObj);
                  socket.emit('server-send-data-to-result',jsonObj);

                });*/




    });});
    socket.on("client-send-data-from-placecall",function(data){

    console.log(data.IdUser);
                  MongoClient.connect(uri, function(err, db) {
                    db.collection("Users").find({_id:ObjectId(data.IdUser)}).toArray(function(err, result) {

                      socket.emit('server-send-data-to-placecall',result[0]);socket.disconnect(true);

                    });




        });});
  socket.on("client-send-data-from-candilist",function(data){
  console.log(data.idjob);
    console.log(data.idjob);
               x=ObjectId(data.idjob);

              MongoClient.connect(uri, function(err, db) {

                db.collection("CVs").find({ IdJob:ObjectId(data.idjob) }).toArray(function(err, result) {
                                                                                       if (err) throw err;
console.log(result);
                                                                                       var jsonObj = {

                                                                                                                                                                    							}

                                                                                                               							var i;

                                                                                                               							for(i=0; ; i++){
                                                                                                               							if (result[i]==="null" || result[i]===null ||result[i]==="" || typeof result[i] === "undefined") {
                                                                                                                                                                                                                                                                               break;
                                                                                                                                                                                                                                                                           }
                                                                                                               								var newJob = "Candi" + i;
                                                                                                               								var newValue = result[i];
                                                                                                               								jsonObj[newJob] = newValue ;

                                                                                                               							}
                                                                                      socket.emit("server-send-data-to-candilist",jsonObj);
                                                                                      console.log(jsonObj);

                                                                                       db.close();socket.disconnect(true);
                                                                                     });


               // console.log(data);




    });});
  //console.log("Co nguoi connect ne");
  socket.on("client-send-data",function(data){
  console.log(data);
  console.log(data.user_id);socket.disconnect(true);
  /*MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
      db.collection("customers").find({}, { _id: false, name: true, address: true }).toArray(function(err, result) {
      if (err) throw err;
  	string_for_mongo = JSON.parse(JSON.stringify(result));
  	console.log(result);
  	console.log(JSON.stringify(result));
  	console.log(result[0]);
  	console.log(string_for_mongo[0]);
  	console.log({
                                                             name: "xxx",
                                                             message: "tttt"
                                                       });
  	io.sockets.emit('server-send-data',result[0]);
      console.log(result);
      db.close();
    });

  });*/

  });
  socket.on("client-send-data-from-login",function(data){
  console.log(data)
  MongoClient.connect(uri, function(err, db) {
    var query = { Email: data.email };
      db.collection("Users").find(query).toArray(function(err, result) {
        if (err) throw err;
            //0 : email chua dang ki
            //1 :dung pass
            //2 :sai pass
         var jsonObj={Ketqua:"0",
                      Name:"",
                      Id:"",
                      Role:"",
                      Email:""
         }

         if(result[0]!=null){
                                if (data.password==result[0].Pass)
                                    {

                                        jsonObj.Ketqua="1",
                                        jsonObj.Name=result[0].Name,
                                        jsonObj.Id=result[0]._id,
                                        jsonObj.Email=result[0].Email,
                                        jsonObj.Role=result[0].Role
                                    }
                                         else jsonObj.Ketqua="2";
                                }

     console.log(jsonObj);
     console.log(data.password);
     //console.log(result[0].Pass);

    socket.emit('server-send-data-to-login',jsonObj);



    });
    });
    });
  /*io.sockets.emit('serverguitinnhan', { noidung: "okbaby" });*/
    socket.on("client-send-data-from-new-job",function(data){


             console.log(data);
             MongoClient.connect(uri, function(err, db) {
             var query = { Email: data["Email"] };

                   if (err) throw err;
                   db.collection("Users").find(query).toArray(function(err, result) {
                     if (err) throw err;

                            console.log(result);
                         delete data["Email"];
                          var query = { iduser: result[0]._id };

                                            if (err) throw err;
                                            db.collection("CompanyInfo").find(query).toArray(function(err, result) {
                                              if (err) throw err;


                                                  data["IdCompany"]=result[0]._id;
                                                  var num=Number(data["Salary"]);
                                                  data["Salary"]=num;
                                                  var myobj = data;
                                                                 db.collection("Job").insertOne(myobj, function(err, res) {
                                                                   if (err) throw err;
                                                                   console.log("1 document inserted");
                                                                   //db.close();
                                                                 });
                                                                 db.collection("Job").find({}).toArray(function(err, result) {
                                                                                    if (err) throw err;
                                                                                    console.log(result);

                                                                                  });

                                              db.close();socket.disconnect(true);
                                            });



                   });






             });




   });




   });


setInterval(() => io.emit('time', new Date().toTimeString()), 1000);




//console.log("connected");

