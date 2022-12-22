const express = require("express");
const router = express.Router();
const { getEnumerator } = require("./controllers/enumeratorController");
const {
    addBeneficiary,
    getBeneficiaries,
} = require("./controllers/beneficiaryController");

router.get("/enumerator/:id", getEnumerator);

router.get("/beneficiary", getBeneficiaries);
router.post("/beneficiary/add", addBeneficiary);

module.exports = { router };
