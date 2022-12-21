const express = require("express");
const router = express.Router();
const { getEnumerator } = require("./controllers/enumeratorController");
const { addBeneficiary } = require("./controllers/beneficiaryController");

router.get("/enumerator/:id", getEnumerator);
router.post("/beneficiary/add", addBeneficiary);

module.exports = { router };
