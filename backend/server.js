require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");

const multer = require("multer"),
    bodyParser = require("body-parser"),
    path = require("path");

const mongoose = require("mongoose").set("debug", true);
const {router} = require("./routes.js");
const {randomNumberNotInUserCollection} = require("./helpers/number");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


const fs = require("fs");
const product = require("./model/product.js");
const user = require("./model/user.js");
const jwt_decode = require("jwt-decode");

const PORT = process.env.PORT;
app.use(express.json({limit: "50mb"}));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.urlencoded({extended: true}));

const dir = "./uploads";
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, "./uploads");
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        },
    }),

    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return callback(/*res.end('Only images are allowed')*/ null, false);
        }
        callback(null, true);
    },
});
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);

app.use(router);
app.use("/", (req, res, next) => {
    try {
        if (
            req.path == "/login" ||
            req.path == "/register" ||
            req.path == "/" ||
            req.path == "/api" ||
            req.path == "/users" ||
            req.path == "/get-beneficiary" ||
            req.path == "/user-details" ||
            req.path == "/enumerator" ||
            req.path == "/get-enumerator" ||
            req.path == "/get-all" ||
            req.path == "/get-testscore" ||
            req.path == "/get-login" ||
            req.path == "/list-beneficiary" ||
            req.path == "/beneficiary"
        ) {
            next();
        } else {
            /* decode jwt token if authorized*/
            jwt.verify(req.headers.token, "shhhhh11111", function (err, decoded) {
                if (decoded && decoded.user) {
                    req.user = decoded;
                    next();
                } else {
                    return res.status(401).json({
                        errorMessage: "User unauthorized!",
                        status: false,
                    });
                }
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

app.get("/", (req, res) => {
    res.send({});
});

app.get("/user-details", (req, res) => {
    res.send({});
});

/* user register api */
app.post("/register", async (req, res) => {
    try {
        const userId = await randomNumberNotInUserCollection();
        console.log(userId);
        if (req.body && req.body.username && req.body.password) {
            user.find({username: req.body.username}, (err, data) => {
                if (data.length == 0) {
                    let User = new user({
                        username: req.body.username,
                        password: req.body.password,
                        userId: userId,
                    });
                    User.save((err, data) => {
                        if (err) {
                            res.status(400).json({
                                errorMessage: err,
                                status: false,
                            });
                        } else {
                            res.status(200).json({
                                status: true,
                                title: "Registered Successfully.",
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        errorMessage: `UserName ${req.body.username} Already Exist!`,
                        status: false,
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

/* Api to add Product */
app.post("/add-product", upload.any(), (req, res) => {
    try {
        if (
            req.files &&
            req.body &&
            req.body.name &&
            req.body.desc &&
            req.body.price &&
            req.body.discount
        ) {
            let new_product = new product();
            new_product.name = req.body.name;
            new_product.desc = req.body.desc;
            new_product.price = req.body.price;
            new_product.image = req.files[0].filename;
            new_product.discount = req.body.discount;
            new_product.user_id = req.user.id;
            new_product.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        errorMessage: err,
                        status: false,
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        title: "Product Added successfully.",
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

/* Api to update Product */
app.post("/update-product", upload.any(), (req, res) => {
    try {
        if (
            req.files &&
            req.body &&
            req.body.name &&
            req.body.desc &&
            req.body.price &&
            req.body.id &&
            req.body.discount
        ) {
            product.findById(req.body.id, (err, new_product) => {
                // if file already exist than remove it
                if (req.files && req.files[0] && req.files[0].filename && new_product.image) {
                    const path = `./uploads/${new_product.image}`;
                    fs.unlinkSync(path);
                }

                if (req.files && req.files[0] && req.files[0].filename) {
                    new_product.image = req.files[0].filename;
                }
                if (req.body.name) {
                    new_product.name = req.body.name;
                }
                if (req.body.desc) {
                    new_product.desc = req.body.desc;
                }
                if (req.body.price) {
                    new_product.price = req.body.price;
                }
                if (req.body.discount) {
                    new_product.discount = req.body.discount;
                }

                new_product.save((err, data) => {
                    if (err) {
                        res.status(400).json({
                            errorMessage: err,
                            status: false,
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            title: "Product updated.",
                        });
                    }
                });
            });
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

/* Api to delete Product */
app.post("/delete-product", (req, res) => {
    try {
        if (req.body && req.body.beneficiaryId) {
            user.findByIdAndUpdate(req.body.id, {is_delete: true}, {new: true}, (err, data) => {
                if (data.is_delete) {
                    res.status(200).json({
                        status: true,
                        title: "Product deleted.",
                    });
                } else {
                    res.status(400).json({
                        errorMessage: err,
                        status: false,
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: "Add proper parameter first!",
                status: false,
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: "Something went wrong!",
            status: false,
        });
    }
});

/*Api to get and search product with pagination and search by name*/
// app.get("/get-product", (req, res) => {
//     try {
//         const query = {};
//         query["$and"] = [];
//         query["$and"].push({
//             is_delete: false,
//             user_id: req.user.id,
//         });
//         if (req.query && req.query.search) {
//             query["$and"].push({
//                 name: {$regex: req.query.search},
//             });
//         }
//         const perPage = 5;
//         const page = req.query.page || 1;
//         product
//             .find(query, {
//                 date: 1,
//                 name: 1,
//                 id: 1,
//                 desc: 1,
//                 price: 1,
//                 discount: 1,
//                 image: 1,
//             })
//             .skip(perPage * page - perPage)
//             .limit(perPage)
//             .then(data => {
//                 product
//                     .find(query)
//                     .countDocuments()
//                     .then(countDocuments => {
//                         if (data && data.length > 0) {
//                             res.status(200).json({
//                                 status: true,
//                                 title: "Product retrived.",
//                                 products: data,
//                                 current_page: page,
//                                 total: countDocuments,
//                                 pages: Math.ceil(countDocuments / perPage),
//                             });
//                         } else {
//                             res.status(400).json({
//                                 errorMessage: "There is no beneficiary!",
//                                 status: false,
//                             });
//                         }
//                     });
//             })
//             .catch(err => {
//                 res.status(400).json({
//                     errorMessage: err.message || err,
//                     status: false,
//                 });
//             });
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: "Something went wrong!",
//             status: false,
//         });
//     }
// });

app.get("/api", (req, res) => {
    user.find((err, val) => {
        if (err) {
            console.log(err);
        } else {
            res.json(val);
        }
    });
});
app.get("/get-all", (req, res) => {
    user.find((err, val) => {
        if (err) {
            console.log(err);
        } else {
            res.json(val);
        }
    });
});

app.get("/get-enumerator", async (req, res) => {
    let users = await user.find({}).select("-beneficiary");
    return res.status(200).json(users);
});

app.get("/get-testscore", async (req, res) => {
    let users = await user
        .find({})
        .select("-username")
        .select("-password")
        .select("-id")
        .select("-_id")
        .select("-userId")
        .select("-createdAt")
        .select("-updatedAt")
        .select("-__v")
        .select("-beneficiary._id")
        .select("-beneficiary.f_nm")
        .select("-beneficiary.ben_nid")
        .select("-beneficiary.ben_id")
        .select("-beneficiary.sl")
        .select("-beneficiary.m_nm")
        .select("-beneficiary.age")
        .select("-beneficiary.dis")
        .select("-beneficiary.sub_dis")
        .select("-beneficiary.uni")
        .select("-beneficiary.vill")
        .select("-beneficiary.relgn")
        .select("-beneficiary.job")
        .select("-beneficiary.gen")
        .select("-beneficiary.test")
        .select("-beneficiary.createdAt")
        .select("-beneficiary.updatedAt")

        .select("-beneficiary.mob")
        .select("-beneficiary.pgm")
        .select("-beneficiary.pass")
        .select("-beneficiary.bank")
        .select("-beneficiary.branch")
        .select("-beneficiary.r_out")

        .select("-beneficiary.mob_1")
        .select("-beneficiary.ben_sts")
        .select("-beneficiary.nid_sts")
        .select("-beneficiary.a_sts")
        .select("-beneficiary.u_nm")

        .select("-beneficiary.dob")
        .select("-beneficiary.accre")
        .select("-beneficiary.f_allow")
        .select("-beneficiary.mob_own");

    const data = users;
    const data1 = users;

    const formatted_data = data[0];
    extact_data = formatted_data["beneficiary"];

    extact_data.forEach(item => {
        if (item.timeanddate) {
            const date = item.timeanddate;

            var dateString = date.toLocaleString();
            var date_time = dateString.split(" ");

            var options = {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
            };

            const time = date_time[4];
            var timeArray = time.split(":");
            var hour = parseInt(timeArray[0]);
            var minute = timeArray[1];
            var second = timeArray[2];
            var amPm = hour >= 12 ? "PM" : "AM";
            hour = hour % 12;
            hour = hour ? hour : 12;
            console.log(
                date_time[0] +
                    " " +
                    date_time[2] +
                    " " +
                    date_time[1] +
                    " " +
                    date_time[3] +
                    " " +
                    hour +
                    ":" +
                    minute +
                    ":" +
                    second +
                    " " +
                    amPm,
            );

            item.timeanddate =
                date_time[0] +
                " " +
                date_time[2] +
                " " +
                date_time[1] +
                " " +
                date_time[3] +
                " " +
                hour +
                ":" +
                minute +
                ":" +
                second +
                " " +
                amPm;
        }
        if (item.duration) {
            const minutes = Math.floor(item.duration / 60);
            const seconds = item.duration % 60;
            item.duration = `${minutes} minutes and ${seconds} seconds`;
        } else {
            item.duration = null;
        }
    });

    return res.status(200).json(extact_data);
});

app.get("/get-beneficiary", async (req, res) => {
    let users = await user
        .find({})
        .select("-_id")
        .select("-id")
        .select("-username")
        .select("-password")
        .select("-createdAt")

        .select("-beneficiary.test");

    const data = users;
    const data1 = users;
    const formatted_data = data[0];

    //   const formatted_data1= data1[1]

    // extact_data1 = formatted_data1['beneficiary']

    extact_data = formatted_data["beneficiary"];

    // let obj3 = Object.assign(extact_data, extact_data1);

    //  console.log(obj3)

    return res.status(200).json(extact_data);
});

app.get("/get-login", async (req, res) => {
    // let users = await user.find({}).select("-password").select("-username").select("-beneficiary.name").select("-beneficiary.f_nm")
    // .select("-beneficiary.ben_nid").select("-beneficiary.ben_id").select("-beneficiary.sl").select("-beneficiary.m_nm").select("-beneficiary.age").select("-beneficiary.dis")
    // .select("-beneficiary.sub_dis").select("-beneficiary.uni").select("-beneficiary.vill").select("-beneficiary.relgn").select("-beneficiary.job").select("-beneficiary.gen")

    // .select("-beneficiary.mob").select("-beneficiary.pgm").select("-beneficiary.pass").select("-beneficiary.bank").select("-beneficiary.branch").select("-beneficiary.r_out")

    // .select("-beneficiary.mob_1").select("-beneficiary.ben_sts").select("-beneficiary.nid_sts").select("-beneficiary.a_sts").select("-beneficiary.u_nm")

    // .select("-beneficiary.dob").select("-beneficiary.accre").select("-beneficiary.f_allow").select("-beneficiary.mob_own").select("-beneficiary.test")

    let users = await user.find({}).select("-beneficiary");
    return res.status(200).json(users);
});

app.get("/enumerator", (req, res) => {
    product.find((err, val) => {
        if (err) {
            console.log(err);
        } else {
            res.json(val);
        }
    });
});

app.post("/api", async (req, res) => {
    try {
        // const anotherData = JSON.parse(req.body)
        const saveData = req.body;
        const newData = new user({
            username: saveData.username,
            password: saveData.password,
        });
        await newData.save();
        res.status(201).json({success: true, data: newData});
    } catch (error) {
        res.status(400).json({success: false});
    }
});

app.listen(2000, (err, data) => {
    // console.log(err);
    console.log("Server is Runing On port 2000");
});
