const User = require("../model/user");
const jwt = require("jsonwebtoken");

async function getEnumerator(req, res) {
    const {id} = req.params;
    const enumerator = await User.findById(id);
    return res.status(200).json(enumerator);
}

async function getToken(data) {
    let token = await jwt.sign(
        {user: data.username, id: data._id, userId: data.userId},
        "shhhhh11111",
        {expiresIn: "1d"},
    );
    return token;
}

async function userLogin(req, res) {
    console.log(req.body);
    let user = await User.findOne({username: req.body.username});
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({error: "Username or Password missing"});
    }
     if(!user){
        return res.status(401).json({error: "User Not Found"});
    }
    if (user.password === req.body.password ) {
        let token = await getToken(user);
        return res.status(200).json({
            message: "Login Successfully.",
            token: token,
            status: true,
        });
    }
    return res.status(500).json({message: "Something went wrong."});
}

module.exports = {getEnumerator, userLogin};
