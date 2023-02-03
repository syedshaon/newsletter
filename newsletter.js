const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const mailchimp  = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public")); 

app.listen( 3000, () => {
    console.log("server is listening at 3000");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const fname = req.body.fName;
    const lname = req.body.lName;
    const email = req.body.inputEmail;
    console.log(fname, lname, email);

    mailchimp.setConfig({
        apiKey: "41c0271ed7c81ba2527a626ef5572a2e",
        server: "us9",
    });

    const run = async () => {
        const response = await mailchimp.lists.batchListMembers("892456f153", {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: fname,
                        LNAME: lname,
                    },
                },
            ],
        });

        console.log(response);

        if (response.error_count) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            res.sendFile(__dirname + "/success.html");
        }
    };

    run();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});