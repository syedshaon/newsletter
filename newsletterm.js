const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const mailchimp  = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public")); 
// app.use('/img', express.static('img'));

app.post("/", function (req, res) {
    
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email =  req.body.inputEmail;
    console.log(fName, lName, email);

    

    mailchimp.setConfig({
    apiKey: "41c0271ed7c81ba2527a626ef5572a2e-us9",
    server: "us9",
    });

    const listId = "892456f153";
    const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email
    };

    async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
        }
    });

        // console.log(        
        //     `Successfully added contact as an audience member. The contact's id is ${
        //     response.id
        //     }.`
        // );
       console.log(response);

     if (response.error_count) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            res.sendFile(__dirname + "/success.html");
        }
    };

    run();
    // res.send("<h2></h2>Thnk you for subscribing to my mailing list. Please click on the confirmation link from your email to confirm the subscription. :) </h2>");


})

app.get("/", function (req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.listen(3000, function (req, res) {
    console.log("Server running on port 3000");
})

// process.exit(2);

// const key = "41c0271ed7c81ba2527a626ef5572a2e-us9";
// const audienceID = "892456f153";

