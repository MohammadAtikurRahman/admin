const express = require("express");
const router = express.Router();
const { getEnumerator } = require("./controllers/enumeratorController");

router.get("/enumerator/:id", getEnumerator);

module.exports = { router };
