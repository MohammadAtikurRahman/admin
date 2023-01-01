const express = require("express");
const router = express.Router();

const {getEnumerator, userLogin} = require("./controllers/enumeratorController");

const {
    addBeneficiary,
    getBeneficiaries,
    beneficiaryLogin,
    saveTestScore,
} = require("./controllers/beneficiaryController");

router.get("/enumerator/:id", getEnumerator);

router.get("/beneficiary", getBeneficiaries);
router.post("/beneficiary/add", addBeneficiary);
router.post("/beneficiary-login", beneficiaryLogin);

/* adming login api */
router.post("/login", userLogin);

router.post("/ben-score", saveTestScore);

module.exports = {router};
