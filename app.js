//requring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const fs = require("fs");
const _ = require("lodash");
const mongoose = require("mongoose");
//process.env.PORT enables hosting server to dynamically specify a host
const port = process.env.PORT || "8000";

app.use(bodyParser.urlencoded({
  extended: true
}));
//use express.static to access static files like css, image, video and js files
app.use(express.static("public"));
app.set('view engine', 'ejs');
//connecting to database
mongoose.connect(process.env.monogURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//defining mongoose schema for Customer
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  //unique index to define unique values for phone and email in the document
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});

//creating Customer object for the customerSchema
const Customer = mongoose.model("Customer",customerSchema);

//get routes
app.get("/", (req, res) => {
  //res.render() renders or send ejs files
  res.render("index");
});

app.get("/aboutme", (req, res) => {
  res.render("aboutme");
});

app.get("/feedback", (req, res) => {
  //success_msg and error_msg are bind to successMessage and errorMessage, which are the properties that can be used in the specified ejs file
  res.render("feedback", {
    error_msg: ""
  });
});

app.get("/audios", (req, res) => {
  res.render("audio");
});

app.get("/fbresponse",(req,res) => {
  res.render("fbresponse",{
    fb_msg: "Please submit feedback. Thank You."
  });
});

//post routes
app.post("/feedback", (req, res) => {
  //form parameters that are sent using post or get can be accessed using req.body
  var name = req.body.firstName + " " + req.body.lastName;
  //using lodash to achieve Title Case for full name toLower() converts string to lowercase and startCase convets string to Title Case
  name = _.startCase(_.toLower(name));
  //customer is a Customer Object that adheres to the customerSchema
  const customer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
    comments: req.body.comments,
    rating: req.body.rating
  });
//updateCustomer is a javascript Object passed to Model.replaceOne() method to replace the first matched document
  const updateCustomer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
    comments: req.body.comments,
    rating: req.body.rating
  };
  //Model.findOne() finds the first document in the collection
    Customer.findOne({email: req.body.email}, (err,found) => {
      if(err){
        console.log("db error:"+err);
        feedbackError("",res);
      }else{
      if(!found){
        //Model.save() inserts a single document into the collection
        customer.save((err) =>{
          if(err){
            console.log("db error:"+err);
            feedbackError("",res);
          }else{
            //Model.countDocuments() gets the count of the documnets in the collection
            Customer.countDocuments({}, (err,count)=>{
              if(err){
                console.log("db error:"+err);
                feedbackError("Error reading feedback.",res);
            }
              else{
                res.render("fbresponse",{
                fb_msg: "Thanks for the feedback. You are my "+count+"th honored guest who left a feedback."
              });
            }
            });// end Customer.countDocuments()
          }
        });//end Customer.save()

      }else{
        //Model.replaceOne() replaces the first matched document
        Customer.replaceOne({email: req.body.email}, updateCustomer, (err,result) => {
          if(err){
            console.log("db error:"+req.body.email+err);
             feedbackError("Error updating your feedback.",res);
          }else{
            res.render("fbresponse",{
            fb_msg: "Thanks for revisiting. Your new feedback has been recorded."
            });
          }
        });//end Customer.replaceOne()
  }
}
});//end findOne()
});//end post()

function feedbackError(msg,res){
  if(msg === ""){
  res.render("feedback",{
    error_msg : "Error registering your feedback."
  });
}
  else{
    res.render("feedback",{
      error_msg : msg
    });
  }
}
//starting server on port
app.listen(port, () => {
  console.log(`Server has started successfully on ${port}`);
});
