

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
//mongodb://localhost:27017/mobileDB   (Enter your mongodb url and database name)
mongoose.connect("mongodb://localhost:27017/mobileDB", { useNewUrlParser: true });

const mobileSchema = {
    name: String,
    brand: String,
    camera: Number,
    ram: Number,
    storage: Number

};

const Mobile = mongoose.model("Mobile", mobileSchema);

//TODO

//Route to send all mobiles from database
app.get("/mobiles", function (req, res) {

    Mobile.find(function (err, foundMobiles) {
        if (!err) {
            res.send(foundMobiles);
        } else {
            res.send("There is something wrong!")
        }

    })
})

//Route to take user to page through which they will add new mobile 
app.route("/newmobile")
    .get(function (req, res) {
        res.render("newmobile")
    })
    //Post route to add new mobile
    .post(function (req, res) {
        console.log(req.body.brand);
        console.log(req.body.mobile);
        console.log(req.body.camera);
        console.log(req.body.ram);
        console.log(req.body.storage);
        const newmobile = new Mobile({
            name: req.body.brand,
            brand: req.body.mobile,
            ram: req.body.ram,
            camera: req.body.camera,
            storage: req.body.storage
        })
        newmobile.save()
        res.redirect("/mobiles")
    })

//Default mobile to add for in empty database
app.get("/savemobile", function (req, res) {
    const mobile = new Mobile({
        name: "Note 8 Pro",
        brand: "Redmi",
        ram: 8,
        camera: 8,
        storage: 128
    })

    mobile.save()
    res.redirect("/mobiles")
})

//Route to render delete page for mobile
app.get("/deletemobile", function (req, res) {
    res.render("delete")
})

//Route to delete all mobiles
app.delete("/delete", function (req, res) {
    Mobile.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all mobiles")
        } else {
            res.send(err)
        }
    })
})

//Route to generate delete page for single mobile
app.get("/delete/:name", function (req, res) {
    Mobile.findOne({ name: req.params.name }, function (err, mobile) {
        if (!err) {
            res.render("deletemobile", { mobile: mobile })
        } else {
            res.send(err)
        }
    })
})

//Route to add update for specific mobile name
app.get("/updatemobile/:name", function (req, res) {
    Mobile.findOne({ name: req.params.name }, function (err, mobile) {
        if (!err) {
            res.render("updatemobile", { mobile: mobile })
        } else {
            res.send(err)
        }
    })

})

//Route to  find specific mobile
app.route("/mobile/:name")
    .get(function (req, res) {
        Mobile.findOne({ name: req.params.name }, function (err, mobile) {
            if (!err) {
                res.send(mobile)
            } else {
                res.send(err)
            }
        })
    })

    //Post route to update entry in mobile
    .post(function (req, res) {
        Mobile.update(
            { name: req.params.name },
            { brand: req.body.brand, storage: req.body.storage, camera: req.body.camera, name: req.body.name, ram: req.body.ram }, err => {
                if (!err) {
                    res.redirect("/mobile/" + req.params.name)
                } else {
                    res.send(err)
                }
            })

    })

    //Delete specifies mobile
    .delete(function (req, res) {
        Mobile.deleteOne({ name: req.params.name }, err => {
            if (!err) {
                res.redirect("/mobiles")
            } else {
                res.send(err)
            }
        })

    })


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
