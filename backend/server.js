require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const moment = require('moment');
require('moment-timezone');
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
app.use(express.json({limit: "100mb"}));

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

            req.path == "/get-login" ||
            req.path == "/list-beneficiary" ||
            req.path == "/beneficiary" ||
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
    user.find({}, {
      "beneficiary.beneficiaryId": 1,
      "beneficiary.name": 1,
      "beneficiary.mob": 1,
      "beneficiary.transaction": 1
    }, (err, val) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const beneficiaries = [];
  
        val.forEach((user) => {
          user.beneficiary.forEach(ben => {
            let trxidSet = new Set();
  
            const filteredTransactions = ben.transaction.filter(tran => {
              if (!trxidSet.has(tran.trxid)) {
                trxidSet.add(tran.trxid);
                return true;
              }
              return false;
            }).reverse();
  
            let cashInCount = filteredTransactions.filter(tran => tran.type === "in").length;
            let cashOutCount = filteredTransactions.filter(tran => tran.type === "out").length;
            let totalCount = cashInCount + cashOutCount;
  
            // Push modified beneficiary data into the beneficiaries array
            beneficiaries.push({
              beneficiaryId: ben.beneficiaryId,
              name: ben.name,
              mob: ben.mob,
              transaction: filteredTransactions.map(tran => ({
                _id: tran._id,
                beneficiaryId: tran.beneficiaryId,
                beneficiaryMobile: ben.mob,  // set the beneficiaryMobile to ben.mob
                type: tran.type,
                amount: tran.amount,
                trxid: tran.trxid,
                date: tran.date,
                duration: tran.duration,
                sub_type: tran.sub_type,
                duration_bkash: tran.duration_bkash,
                sender: tran.sender
              })),
              cashInCount: cashInCount,
              cashOutCount: cashOutCount,
              totalCount: totalCount
            });
          });
        });
  
        res.json(beneficiaries);
      }
    });
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
    extact_data = formatted_data["beneficiary"];

    extact_data = extact_data.filter(item => {
        if ((item.duration && item.score1) || item.test_status || item.whotaketheexam) {
            if (item.score1 || item.score1 == 0) {
                item.test_status = "অংশগ্রহণকারী";
            }
            return true;
        }
        return false;
    });

    extact_data.sort((a, b) => b.updatedAt - a.updatedAt);

    extact_data.forEach(item => {
        if (item.duration) {
            const minutes = Math.floor(item.duration / 60);
            const seconds = item.duration % 60;
            item.duration = minutes > 0 ? `${minutes} minutes ${seconds} seconds` : `${seconds} seconds`;
        } else {
            item.duration = null;
        }
    
        if (item.enumerator_observation && item.enumerator_observation.length > 0) {
            item.all_observation = item.enumerator_observation;
            item.observation_new = [];
        } else if (item.observation && item.observation.length > 0) {
            item.all_observation = item.observation;
            if (item.observation_new.length > 0) {
                item.all_observation += ',' + item.observation_new.join(',');
            }
        } else if (item.observation_new.length > 0) {
            item.all_observation = item.observation_new.join(',');
        } else {
            item.all_observation = null;
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


app.get("/get-transaction", async (req, res) => {
    let users = await user
      .find({})
      .select("beneficiary")
      .lean();
  
    const data = users;
  
    const trxidSet = new Set();
  
    const mapped_data = data
      .map((user) => {
        const { beneficiary } = user;
        return beneficiary.map((ben) => ({
          beneficiaryId: ben.beneficiaryId,
          name: ben.name,
          mob: ben.mob,
          loggedin_time: ben.loggedin_time ? moment.utc(ben.loggedin_time).tz("Asia/Dhaka").format() : null,
          transaction: ben.transaction
            ? ben.transaction
                .filter((t) => {
                  if (trxidSet.has(t.trxid)) {
                    return false; // Skip duplicate transaction records
                  }
                  trxidSet.add(t.trxid);
                  return true; // Include unique transaction records
                })
                .map((t) => ({
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





app.listen(2000, (err, data) => {
    // console.log(err);
    console.log("Server is Runing On port 2000");
});
