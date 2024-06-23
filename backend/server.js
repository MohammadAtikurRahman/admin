require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const moment = require("moment");
require("moment-timezone");
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
app.use(express.urlencoded({limit: "50mb", extended: true}));

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
            req.path == "/get-ben" ||
            req.path == "/get-testscore" ||
            req.path == "/get-transaction" ||
            req.path == "/get-tran" ||
            req.path == "/add-observation" ||
            req.path == "/check-ids" ||
            req.path == "/get-login" ||
            req.path == "/list-beneficiary" ||
            req.path == "/beneficiary" ||
            req.path == "/get-timestamp" ||
            req.path == "/d-data" ||

            req.path == "/get-last-page-text"

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

app.get("/get-tran", (req, res) => {
    user.find(
        {},
        {
            "beneficiary.beneficiaryId": 1,
            "beneficiary.name": 1,
            "beneficiary.mob": 1,
            "beneficiary.transaction": 1,
        },
        (err, val) => {
            if (err) {
                console.log(err);
                res.status(500).send("Server Error");
            } else {
                const beneficiaries = [];

                val.forEach(user => {
                    user.beneficiary.forEach(ben => {
                        let trxidSet = new Set();

                        const filteredTransactions = ben.transaction
                            .filter(tran => {
                                if (!trxidSet.has(tran.trxid)) {
                                    trxidSet.add(tran.trxid);
                                    return true;
                                }
                                return false;
                            })
                            .reverse();

                        let cashInCount = filteredTransactions.filter(
                            tran => tran.type === "in",
                        ).length;
                        let cashOutCount = filteredTransactions.filter(
                            tran => tran.type === "out",
                        ).length;
                        let totalCount = cashInCount + cashOutCount;

                        // Push modified beneficiary data into the beneficiaries array
                        beneficiaries.push({
                            beneficiaryId: ben.beneficiaryId,
                            name: ben.name,
                            mob: ben.mob,
                            transaction: filteredTransactions.map(tran => ({
                                _id: tran._id,
                                beneficiaryId: tran.beneficiaryId,
                                beneficiaryMobile: ben.mob, // set the beneficiaryMobile to ben.mob
                                type: tran.type,
                                amount: tran.amount,
                                trxid: tran.trxid,
                                date: tran.date,
                                duration: tran.duration,
                                sub_type: tran.sub_type,
                                duration_bkash: tran.duration_bkash,
                                sender: tran.sender,
                            })),
                            cashInCount: cashInCount,
                            cashOutCount: cashOutCount,
                            totalCount: totalCount,
                        });
                    });
                });

                res.json(beneficiaries);
            }
        },
    );
});

app.get("/get-ben", async (req, res) => {
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
    extact_data = formatted_data["beneficiary"];
    return res.status(200).json(extact_data);
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
        .select("-beneficiary.ben_nid")
        .select("-beneficiary.ben_id")
        .select("-beneficiary.sl")
        .select("-beneficiary.age")
        .select("-beneficiary.dis")
        .select("-beneficiary.relgn")
        .select("-beneficiary.job")
        .select("-beneficiary.test")
        .select("-beneficiary.createdAt")
        .select("-beneficiary.mob")
        .select("-beneficiary.pgm")
        .select("-beneficiary.pass")
        .select("-beneficiary.bank")
        .select("-beneficiary.branch")
        .select("-beneficiary.r_out")
        .select("-beneficiary.transaction")
        .select("-beneficiary.mob_1")
        .select("-beneficiary.ben_sts")
        .select("-beneficiary.nid_sts")
        .select("-beneficiary.a_sts")
        .select("-beneficiary.accre")
        .select("-beneficiary.f_allow")
        .select("-beneficiary.mob_own")
        .select("-beneficiary.excuses")
        .select("-beneficiary.u_nm");

    const data = users;

    const formatted_data = data[0];
    let extract_data = formatted_data["beneficiary"];

    extract_data = extract_data.filter(item => {
        if ((item.duration && item.score1) || item.test_status || item.whotaketheexam) {
            if (item.score1 || item.score1 == 0) {
                item.test_status = "অংশগ্রহণকারী";
                item.score1 = Math.abs(item.score1); // Ensure score1 is always positive
            }
            return true;
        }
        return false;
    });

    extract_data.sort((a, b) => b.updatedAt - a.updatedAt);

    extract_data.forEach(item => {
        if (item.duration) {
            const minutes = Math.floor(item.duration / 60);
            const seconds = item.duration % 60;
            item.duration =
                minutes > 0 ? `${minutes} minutes ${seconds} seconds` : `${seconds} seconds`;
        } else {
            item.duration = null;
        }

        if (item.enumerator_observation && item.enumerator_observation.length > 0) {
            item.all_observation = item.enumerator_observation;
            item.observation_new = [];
        } else if (item.observation && item.observation.length > 0) {
            item.all_observation = item.observation;
            if (item.observation_new.length > 0) {
                item.all_observation += "," + item.observation_new.join(",");
            }
        } else if (item.observation_new.length > 0) {
            item.all_observation = item.observation_new.join(",");
        } else {
            item.all_observation = null;
        }
    });

    return res.status(200).json(extract_data);
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

app.get("/get-transaction", async (req, res) => {
    let users = await user.find({}).select("beneficiary").lean();

    const data = users;

    const trxidSet = new Set();

    const mapped_data = data
        .map(user => {
            const {beneficiary} = user;
            return beneficiary.map(ben => ({
                beneficiaryId: ben.beneficiaryId,
                name: ben.name,
                mob: ben.mob,
                loggedin_time: ben.loggedin_time
                    ? moment.utc(ben.loggedin_time).tz("Asia/Dhaka").format()
                    : null,
                transaction: ben.transaction
                    ? ben.transaction
                          .filter(t => {
                              if (trxidSet.has(t.trxid)) {
                                  return false; // Skip duplicate transaction records
                              }
                              trxidSet.add(t.trxid);
                              return true; // Include unique transaction records
                          })
                          .map(t => ({
                              beneficiaryMobile: ben.mob,
                              type: t.type,
                              amount: t.amount,
                              date: t.date,
                              trxid: t.trxid,
                              duration: t.duration,
                              updatedAt: t.updatedAt,
                              createdAt: t.createdAt,
                          }))
                    : [], // or some default value when ben.transaction is undefined
            }));
        })
        .flat()
        .reverse();

    if (mapped_data.length > 0) {
        return res.status(200).json(mapped_data);
    } else {
        return res.status(404).json({
            message: "No data found.",
        });
    }
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

// app.get('/get-timestamp', async (req, res) => {
//     try {
//       const users = await user.find({}, 'beneficiary');
  
//       const result = {};
  
//       users.forEach(user => {
//         user.beneficiary.forEach(beneficiary => {
//           beneficiary.transaction.forEach((txn) => {
//             const mobile = txn.beneficiaryMobile;
//             if (!result[mobile]) {
//               result[mobile] = {
//                 number: mobile,
//                 trxid: txn.trxid,
//                 timestamps: []
//               };
//             }
  
//             result[mobile].timestamps.push({
//               updatedAt: txn.updatedAt
//             });
//           });
//         });
//       });
  
//       res.status(200).json(result);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });
  

function formatDateToCustomString(date) {
    return moment(date).tz('Asia/Dhaka').format('DD-MMM-YYYY hh:mm:ss.SSS A').replace('AM', 'Am').replace('PM', 'Pm');
}


app.get('/get-timestamp', async (req, res) => {
    try {
        const users = await user.find({}, 'beneficiary');
  
        const result = {};
  
        users.forEach(user => {
            user.beneficiary.forEach(beneficiary => {
                beneficiary.transaction.forEach((txn) => {
                    const mobile = txn.beneficiaryMobile;
                    if (!result[mobile]) {
                        result[mobile] = {
                            beneficiaryId: beneficiary.beneficiaryId,

                            Mobile_Number: mobile,
                            Name: beneficiary.name,
                            District: beneficiary.dis,
                            Sub_District: beneficiary.sub_dis,
                            Union: beneficiary.uni,
                            Village: beneficiary.vill,
                            timestamps: {}
                        };
                    }
                    const updatedAtDate = new Date(txn.updatedAt);
                    const dateKey = formatDateToCustomString(updatedAtDate).split(' ')[0]; // dd-MMM-yyyy format
  
                    if (!result[mobile].timestamps[dateKey]) {
                        result[mobile].timestamps[dateKey] = [];
                    }
  
                    // Check if this exact timestamp is already added
                    const formattedTimestamp = formatDateToCustomString(updatedAtDate);
                    if (!result[mobile].timestamps[dateKey].includes(formattedTimestamp)) {
                        result[mobile].timestamps[dateKey].push(formattedTimestamp);
                    }
                });
            });
        });
  
        // Convert the timestamps object to array for each mobile number
        for (let mobile in result) {
            result[mobile].timestamps = Object.keys(result[mobile].timestamps).map(dateKey => ({
                date: dateKey,
                timestamps: result[mobile].timestamps[dateKey]
            }));
        }
  
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});




const specificIds = [1300110376, 1300118032, 1304876020, 1305066913];



// API endpoint to get specific beneficiary data
app.get("/d-data", async (req, res) => {
    try {
        const beneficiaries = await user.find({}, "beneficiary.beneficiaryId beneficiary.mob beneficiary.dis beneficiary.sub_dis beneficiary.uni beneficiary.vill").exec();
        
        // Flatten the results and filter by specific beneficiary IDs
        const result = beneficiaries
            .map(usr => usr.beneficiary.filter(ben => specificIds.includes(ben.beneficiaryId)))
            .flat()
            .map(ben => ({
                beneficiaryId: ben.beneficiaryId,
                mob: ben.mob,
                dis: ben.dis,
                sub_dis: ben.sub_dis,
                uni: ben.uni,
                vill: ben.vill
            }));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/check-ids", async (req, res) => {
    // Example input format
    const inputData = {
        THRIFT: [
            {
                user: 212150638,
            },
            {
                user: 21150744,
            },
            {
                user: 11121696,
            },
            {
                user: 11181689,
            },
            {
                user: 21160402,
            },
            {
                user: 21120747,
            },
            {
                user: 21150043,
            },
            {
                user: 11121619,
            },
            {
                user: 11153131,
            },
            {
                user: 21120526,
            },
            {
                user: 11171023,
            },
            {
                user: 11181599,
            },
            {
                user: 11170833,
            },
            {
                user: 11130533,
            },
            {
                user: 11170784,
            },
            {
                user: 21120255,
            },
            {
                user: 11131569,
            },
            {
                user: 112151006,
            },
            {
                user: 11141226,
            },
            {
                user: 212150639,
            },
            {
                user: 21151447,
            },
            {
                user: 11121179,
            },
            {
                user: 212150275,
            },
            {
                user: 112151014,
            },
            {
                user: 212150144,
            },
            {
                user: 21160677,
            },
            {
                user: 21130240,
            },
            {
                user: 21150118,
            },
            {
                user: 11121542,
            },
            {
                user: 21120840,
            },
            {
                user: 212150396,
            },
            {
                user: 21130660,
            },
            {
                user: 21120775,
            },
            {
                user: 11150075,
            },
            {
                user: 21150013,
            },
            {
                user: 21180151,
            },
            {
                user: 21140590,
            },
            {
                user: 212150543,
            },
            {
                user: 212150412,
            },
            {
                user: 212150423,
            },
            {
                user: 212150569,
            },
            {
                user: 112150440,
            },
            {
                user: 212150630,
            },
            {
                user: 11160383,
            },
            {
                user: 21180344,
            },
            {
                user: 11131410,
            },
            {
                user: 21120304,
            },
            {
                user: 11161094,
            },
            {
                user: 21180789,
            },
            {
                user: 21120591,
            },
            {
                user: 21151235,
            },
            {
                user: 11153093,
            },
            {
                user: 11130646,
            },
            {
                user: 21130796,
            },
            {
                user: 11140448,
            },
            {
                user: 112110985,
            },
            {
                user: 11160750,
            },
            {
                user: 112150644,
            },
            {
                user: 21151390,
            },
            {
                user: 21130848,
            },
            {
                user: 11131379,
            },
            {
                user: 11152858,
            },
            {
                user: 11120336,
            },
            {
                user: 212110223,
            },
            {
                user: 11160791,
            },
            {
                user: 11152667,
            },
            {
                user: 11181783,
            },
            {
                user: 21170166,
            },
            {
                user: 21130554,
            },
            {
                user: 11153129,
            },
            {
                user: 112150130,
            },
            {
                user: 21140057,
            },
            {
                user: 21150908,
            },
            {
                user: 21130524,
            },
            {
                user: 11120038,
            },
            {
                user: 21180152,
            },
            {
                user: 112150969,
            },
            {
                user: 21140185,
            },
            {
                user: 11120840,
            },
            {
                user: 11152789,
            },
            {
                user: 11181329,
            },
            {
                user: 11131466,
            },
            {
                user: 212110282,
            },
            {
                user: 11130893,
            },
            {
                user: 11152730,
            },
            {
                user: 112150932,
            },
            {
                user: 11120945,
            },
            {
                user: 21180115,
            },
            {
                user: 21160653,
            },
            {
                user: 212110266,
            },
            {
                user: 21150335,
            },
            {
                user: 21151248,
            },
            {
                user: 112111115,
            },
            {
                user: 11170808,
            },
            {
                user: 11131403,
            },
            {
                user: 21140643,
            },
            {
                user: 21130761,
            },
            {
                user: 21140596,
            },
            {
                user: 11170658,
            },
            {
                user: 11140701,
            },
            {
                user: 11121181,
            },
            {
                user: 11152750,
            },
            {
                user: 11181125,
            },
            {
                user: 21151186,
            },
            {
                user: 21120407,
            },
            {
                user: 11152767,
            },
            {
                user: 11180634,
            },
            {
                user: 212150652,
            },
            {
                user: 212110548,
            },
            {
                user: 11153161,
            },
            {
                user: 21160123,
            },
            {
                user: 212110566,
            },
            {
                user: 21180336,
            },
            {
                user: 11171017,
            },
            {
                user: 21180400,
            },
            {
                user: 21140740,
            },
            {
                user: 11141063,
            },
            {
                user: 11160627,
            },
            {
                user: 21180283,
            },
            {
                user: 112111054,
            },
            {
                user: 212150669,
            },
            {
                user: 11170659,
            },
            {
                user: 112150548,
            },
            {
                user: 112150778,
            },
            {
                user: 21120483,
            },
            {
                user: 21130901,
            },
            {
                user: 21130651,
            },
            {
                user: 11181787,
            },
            {
                user: 11140860,
            },
            {
                user: 21180906,
            },
            {
                user: 11150239,
            },
            {
                user: 11181330,
            },
            {
                user: 212150110,
            },
            {
                user: 21130021,
            },
            {
                user: 11181818,
            },
            {
                user: 112150127,
            },
            {
                user: 21150640,
            },
            {
                user: 212150118,
            },
            {
                user: 11152076,
            },
            {
                user: 212150662,
            },
            {
                user: 11141377,
            },
            {
                user: 11152617,
            },
            {
                user: 21150959,
            },
            {
                user: 21150776,
            },
            {
                user: 21180859,
            },
            {
                user: 21160856,
            },
            {
                user: 11121200,
            },
            {
                user: 112150545,
            },
            {
                user: 21120429,
            },
            {
                user: 11141215,
            },
            {
                user: 21150001,
            },
            {
                user: 11120700,
            },
            {
                user: 212110311,
            },
            {
                user: 11170919,
            },
            {
                user: 21140042,
            },
            {
                user: 21120195,
            },
            {
                user: 21180141,
            },
            {
                user: 11121622,
            },
            {
                user: 21170546,
            },
            {
                user: 212110004,
            },
            {
                user: 11140508,
            },
            {
                user: 11153110,
            },
            {
                user: 212110337,
            },
            {
                user: 21140477,
            },
            {
                user: 21140058,
            },
            {
                user: 11170719,
            },
            {
                user: 112110340,
            },
            {
                user: 21140873,
            },
            {
                user: 21180290,
            },
            {
                user: 21170623,
            },
            {
                user: 21160007,
            },
            {
                user: 11121683,
            },
            {
                user: 11170708,
            },
            {
                user: 21150006,
            },
            {
                user: 21180444,
            },
            {
                user: 11140873,
            },
            {
                user: 212150523,
            },
            {
                user: 21120240,
            },
            {
                user: 112110627,
            },
            {
                user: 21120899,
            },
            {
                user: 11121206,
            },
            {
                user: 212150373,
            },
            {
                user: 11152805,
            },
            {
                user: 21140450,
            },
            {
                user: 11140761,
            },
            {
                user: 21130637,
            },
            {
                user: 11141359,
            },
            {
                user: 21160453,
            },
            {
                user: 11181878,
            },
            {
                user: 11152748,
            },
            {
                user: 21140455,
            },
            {
                user: 112150835,
            },
            {
                user: 212150073,
            },
            {
                user: 11152574,
            },
            {
                user: 11152923,
            },
            {
                user: 11150221,
            },
            {
                user: 21150236,
            },
            {
                user: 212110195,
            },
            {
                user: 11171020,
            },
            {
                user: 11171092,
            },
            {
                user: 11181755,
            },
            {
                user: 11181137,
            },
            {
                user: 11181150,
            },
            {
                user: 11160872,
            },
            {
                user: 212150677,
            },
            {
                user: 11181677,
            },
            {
                user: 21120798,
            },
            {
                user: 21150734,
            },
            {
                user: 212110204,
            },
            {
                user: 212150487,
            },
            {
                user: 21120842,
            },
            {
                user: 11120940,
            },
            {
                user: 112110641,
            },
            {
                user: 21120898,
            },
            {
                user: 21130653,
            },
            {
                user: 212110001,
            },
            {
                user: 21130339,
            },
            {
                user: 11121469,
            },
            {
                user: 21120758,
            },
            {
                user: 21180934,
            },
            {
                user: 21120623,
            },
            {
                user: 11140590,
            },
            {
                user: 21180416,
            },
            {
                user: 11140518,
            },
            {
                user: 11121491,
            },
            {
                user: 11181584,
            },
            {
                user: 11121444,
            },
            {
                user: 21130507,
            },
            {
                user: 21120183,
            },
            {
                user: 11160648,
            },
            {
                user: 21120616,
            },
            {
                user: 21140425,
            },
            {
                user: 11140557,
            },
            {
                user: 11120389,
            },
            {
                user: 21120699,
            },
            {
                user: 21120535,
            },
            {
                user: 11121364,
            },
            {
                user: 21120011,
            },
            {
                user: 11121650,
            },
            {
                user: 21160846,
            },
            {
                user: 21120659,
            },
            {
                user: 21180349,
            },
            {
                user: 21120078,
            },
            {
                user: 21120218,
            },
            {
                user: 21180933,
            },
            {
                user: 21180454,
            },
            {
                user: 11152900,
            },
            {
                user: 21120532,
            },
            {
                user: 21130177,
            },
            {
                user: 21140534,
            },
            {
                user: 21140445,
            },
            {
                user: 21140809,
            },
            {
                user: 21120518,
            },
            {
                user: 11121193,
            },
            {
                user: 21120426,
            },
            {
                user: 21120671,
            },
            {
                user: 21180919,
            },
            {
                user: 11120812,
            },
            {
                user: 112150743,
            },
            {
                user: 21120686,
            },
            {
                user: 11151958,
            },
            {
                user: 21150889,
            },
            {
                user: 21150697,
            },
            {
                user: 21151350,
            },
            {
                user: 11152005,
            },
            {
                user: 21150431,
            },
            {
                user: 21160597,
            },
            {
                user: 21160547,
            },
            {
                user: 11121618,
            },
            {
                user: 11151793,
            },
            {
                user: 11131075,
            },
            {
                user: 21160796,
            },
            {
                user: 21160070,
            },
            {
                user: 11120565,
            },
            {
                user: 11160012,
            },
            {
                user: 11181611,
            },
            {
                user: 21140453,
            },
            {
                user: 21180161,
            },
            {
                user: 212110381,
            },
            {
                user: 21140230,
            },
            {
                user: 11121090,
            },
            {
                user: 21170279,
            },
            {
                user: 11181496,
            },
            {
                user: 11121132,
            },
            {
                user: 11121677,
            },
            {
                user: 11153088,
            },
            {
                user: 11121645,
            },
            {
                user: 21170454,
            },
            {
                user: 21180947,
            },
            {
                user: 212110511,
            },
            {
                user: 21150730,
            },
            {
                user: 21150716,
            },
            {
                user: 21120657,
            },
            {
                user: 11131412,
            },
            {
                user: 212150465,
            },
            {
                user: 11121529,
            },
            {
                user: 11152842,
            },
            {
                user: 21151044,
            },
            {
                user: 11121641,
            },
            {
                user: 11131588,
            },
            {
                user: 212150552,
            },
            {
                user: 11151744,
            },
            {
                user: 21170079,
            },
            {
                user: 11130977,
            },
            {
                user: 21130768,
            },
            {
                user: 21180543,
            },
            {
                user: 11180459,
            },
            {
                user: 212110059,
            },
            {
                user: 11151339,
            },
            {
                user: 21130563,
            },
            {
                user: 212150372,
            },
            {
                user: 21170597,
            },
            {
                user: 11180072,
            },
            {
                user: 21180022,
            },
            {
                user: 11150204,
            },
            {
                user: 21180150,
            },
            {
                user: 21120432,
            },
            {
                user: 21140265,
            },
            {
                user: 212150504,
            },
            {
                user: 21120114,
            },
            {
                user: 212150353,
            },
            {
                user: 21150664,
            },
            {
                user: 11180151,
            },
            {
                user: 212110268,
            },
            {
                user: 21170267,
            },
            {
                user: 112151029,
            },
            {
                user: 212150265,
            },
            {
                user: 21160171,
            },
            {
                user: 11180712,
            },
            {
                user: 11160059,
            },
            {
                user: 112150527,
            },
            {
                user: 11120827,
            },
            {
                user: 21180946,
            },
            {
                user: 11152364,
            },
            {
                user: 21150051,
            },
            {
                user: 11152554,
            },
            {
                user: 21180782,
            },
            {
                user: 21150687,
            },
            {
                user: 112110955,
            },
            {
                user: 21170297,
            },
            {
                user: 21160642,
            },
            {
                user: 212110334,
            },
            {
                user: 212110156,
            },
            {
                user: 112150959,
            },
            {
                user: 21120843,
            },
            {
                user: 11181778,
            },
            {
                user: 21180104,
            },
            {
                user: 21150409,
            },
            {
                user: 11121690,
            },
            {
                user: 11152967,
            },
            {
                user: 212150238,
            },
            {
                user: 11121069,
            },
            {
                user: 21120806,
            },
            {
                user: 112150739,
            },
            {
                user: 112150698,
            },
            {
                user: 11153092,
            },
            {
                user: 112110865,
            },
            {
                user: 112150708,
            },
            {
                user: 21150789,
            },
            {
                user: 11152849,
            },
            {
                user: 11152622,
            },
            {
                user: 21180243,
            },
            {
                user: 112111222,
            },
            {
                user: 112110774,
            },
            {
                user: 21150279,
            },
            {
                user: 112110038,
            },
            {
                user: 11170656,
            },
            {
                user: 112110762,
            },
            {
                user: 11141437,
            },
            {
                user: 11171099,
            },
            {
                user: 21130846,
            },
            {
                user: 21160894,
            },
            {
                user: 11121638,
            },
            {
                user: 21120167,
            },
            {
                user: 11121609,
            },
            {
                user: 11151840,
            },
            {
                user: 11170729,
            },
            {
                user: 11152920,
            },
            {
                user: 11121665,
            },
            {
                user: 21150073,
            },
            {
                user: 11181788,
            },
            {
                user: 21180526,
            },
            {
                user: 11152361,
            },
            {
                user: 21140251,
            },
            {
                user: 21180269,
            },
            {
                user: 212110672,
            },
            {
                user: 11121707,
            },
            {
                user: 21140516,
            },
            {
                user: 11151273,
            },
            {
                user: 11152804,
            },
            {
                user: 112110540,
            },
            {
                user: 212110280,
            },
            {
                user: 11121698,
            },
            {
                user: 21180886,
            },
            {
                user: 11171108,
            },
            {
                user: 21150879,
            },
            {
                user: 11150970,
            },
            {
                user: 11121648,
            },
            {
                user: 21180945,
            },
            {
                user: 11152946,
            },
            {
                user: 21151294,
            },
            {
                user: 11121691,
            },
            {
                user: 112150562,
            },
            {
                user: 212150564,
            },
            {
                user: 11152019,
            },
            {
                user: 21120392,
            },
            {
                user: 21150022,
            },
            {
                user: 112151071,
            },
            {
                user: 21160105,
            },
            {
                user: 112150349,
            },
            {
                user: 21180239,
            },
            {
                user: 212150521,
            },
            {
                user: 11120869,
            },
            {
                user: 11120862,
            },
            {
                user: 212150035,
            },
            {
                user: 11150269,
            },
            {
                user: 11152510,
            },
            {
                user: 21140857,
            },
            {
                user: 212150626,
            },
            {
                user: 21180689,
            },
            {
                user: 21150706,
            },
            {
                user: 11120829,
            },
            {
                user: 11150063,
            },
            {
                user: 11150190,
            },
            {
                user: 11153054,
            },
            {
                user: 11170890,
            },
            {
                user: 21120925,
            },
            {
                user: 21120079,
            },
            {
                user: 21180965,
            },
            {
                user: 21150779,
            },
            {
                user: 11152062,
            },
            {
                user: 21180098,
            },
            {
                user: 212150370,
            },
            {
                user: 21140223,
            },
            {
                user: 11161161,
            },
            {
                user: 21150370,
            },
            {
                user: 11131256,
            },
            {
                user: 11170673,
            },
            {
                user: 11171022,
            },
            {
                user: 11121621,
            },
            {
                user: 21130904,
            },
            {
                user: 21170269,
            },
            {
                user: 21150673,
            },
            {
                user: 11121712,
            },
            {
                user: 21150901,
            },
            {
                user: 212110580,
            },
            {
                user: 112111144,
            },
            {
                user: 112150005,
            },
            {
                user: 11121612,
            },
            {
                user: 11120254,
            },
            {
                user: 21150041,
            },
            {
                user: 11121649,
            },
            {
                user: 21120932,
            },
            {
                user: 21150910,
            },
            {
                user: 11180709,
            },
            {
                user: 21170527,
            },
            {
                user: 21170522,
            },
            {
                user: 21180313,
            },
            {
                user: 11152733,
            },
            {
                user: 11181658,
            },
            {
                user: 21120135,
            },
            {
                user: 11153000,
            },
            {
                user: 21120019,
            },
            {
                user: 21120588,
            },
            {
                user: 21150383,
            },
            {
                user: 21130753,
            },
            {
                user: 21151361,
            },
            {
                user: 112150826,
            },
            {
                user: 212150581,
            },
            {
                user: 212150093,
            },
            {
                user: 112150791,
            },
            {
                user: 21150791,
            },
            {
                user: 21180249,
            },
            {
                user: 21150722,
            },
            {
                user: 21180137,
            },
            {
                user: 11151762,
            },
            {
                user: 21150864,
            },
            {
                user: 11152944,
            },
            {
                user: 11180735,
            },
            {
                user: 21140899,
            },
            {
                user: 11152040,
            },
            {
                user: 11152026,
            },
            {
                user: 21151036,
            },
            {
                user: 21150788,
            },
            {
                user: 11180412,
            },
            {
                user: 21120540,
            },
            {
                user: 21120224,
            },
            {
                user: 21180794,
            },
            {
                user: 21180439,
            },
            {
                user: 112150510,
            },
            {
                user: 11121470,
            },
            {
                user: 11170645,
            },
            {
                user: 11152583,
            },
            {
                user: 21180988,
            },
            {
                user: 21120755,
            },
            {
                user: 11171055,
            },
            {
                user: 11120580,
            },
            {
                user: 11121597,
            },
            {
                user: 11152989,
            },
            {
                user: 21180697,
            },
            {
                user: 112110765,
            },
            {
                user: 21150802,
            },
            {
                user: 11121387,
            },
            {
                user: 11121667,
            },
            {
                user: 21120077,
            },
            {
                user: 11131326,
            },
            {
                user: 21160640,
            },
            {
                user: 21120435,
            },
            {
                user: 21130655,
            },
            {
                user: 212150431,
            },
            {
                user: 21120653,
            },
            {
                user: 11180914,
            },
            {
                user: 21180938,
            },
            {
                user: 21180937,
            },
            {
                user: 11131425,
            },
            {
                user: 21120172,
            },
            {
                user: 21140378,
            },
            {
                user: 21130170,
            },
            {
                user: 21180148,
            },
            {
                user: 21140010,
            },
            {
                user: 21150893,
            },
            {
                user: 11131472,
            },
            {
                user: 11121599,
            },
            {
                user: 21130906,
            },
            {
                user: 11121476,
            },
            {
                user: 21120650,
            },
            {
                user: 11121047,
            },
            {
                user: 21180685,
            },
            {
                user: 21130899,
            },
            {
                user: 21130459,
            },
            {
                user: 21130528,
            },
            {
                user: 11130868,
            },
            {
                user: 21180460,
            },
            {
                user: 11181673,
            },
            {
                user: 21180279,
            },
            {
                user: 11130424,
            },
            {
                user: 21150858,
            },
            {
                user: 11121321,
            },
            {
                user: 21180513,
            },
            {
                user: 11181169,
            },
            {
                user: 21120428,
            },
            {
                user: 21160095,
            },
            {
                user: 21150402,
            },
            {
                user: 21130705,
            },
            {
                user: 21130397,
            },
            {
                user: 21170318,
            },
            {
                user: 21150991,
            },
            {
                user: 21150767,
            },
            {
                user: 11121247,
            },
            {
                user: 11121353,
            },
            {
                user: 11151779,
            },
            {
                user: 21160522,
            },
            {
                user: 21160633,
            },
            {
                user: 11140699,
            },
            {
                user: 11120932,
            },
            {
                user: 21170224,
            },
            {
                user: 21140502,
            },
            {
                user: 212110493,
            },
            {
                user: 21180755,
            },
            {
                user: 21120446,
            },
            {
                user: 11152230,
            },
            {
                user: 11121092,
            },
            {
                user: 21120865,
            },
            {
                user: 212110610,
            },
            {
                user: 112110001,
            },
            {
                user: 11121572,
            },
            {
                user: 11120772,
            },
            {
                user: 21170455,
            },
            {
                user: 11180985,
            },
            {
                user: 11181691,
            },
            {
                user: 112110264,
            },
        ],
    };

    // Extract the IDs from the input format
    const idsToCheck = inputData.THRIFT.map(entry => entry.user);

    try {
        const beneficiaries = await user.aggregate([
            {$unwind: "$beneficiary"},
            {$match: {"beneficiary.beneficiaryId": {$in: idsToCheck}}},
            {$project: {"beneficiary.beneficiaryId": 1, _id: 0}},
        ]);

        // Extract the found IDs
        const foundIds = beneficiaries.map(b => b.beneficiary.beneficiaryId);

        // Determine matches and non-matches
        const matches = idsToCheck.filter(id => foundIds.includes(id));
        const notMatches = idsToCheck.filter(id => !foundIds.includes(id));

        // Send the response
        res.json({
            totalMatches: matches.length,
            totalNotMatches: notMatches.length,
            matches: matches,
            notMatches: notMatches,
        });
    } catch (error) {
        console.error("Error during ID check:", error);
        res.status(500).json({
            errorMessage: "Something went wrong!",
            errorDetails: error.message,
            status: false,
        });
    }
});




app.listen(2000, (err, data) => {
    // console.log(err);
    console.log("Server is Runing On port 2000");
});
