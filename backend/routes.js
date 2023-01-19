const express = require("express");
const router = express.Router();

const {getEnumerator, userLogin} = require("./controllers/enumeratorController");

const {
    addBeneficiary,
    getBeneficiaries,
    beneficiaryLogin,
    saveTestScore,
    saveTest,
    benenScore,
    addBeneficiaryScore,
    addBeneficiaryInBulk,
} = require("./controllers/beneficiaryController");

router.get("/enumerator/:id", getEnumerator);

router.get("/beneficiary", getBeneficiaries);
router.post("/beneficiary/add", addBeneficiary);
router.post("/beneficiary/add/bulk", addBeneficiaryInBulk);

router.post("/save-test/add", saveTest);

router.post("/get-login", beneficiaryLogin); // beneficiary login
router.post("/get-score-saved", addBeneficiaryScore); // beneficiary login
router.post("/save-score", addBeneficiaryScore); // beneficiary login

/* admin login api */
router.post("/login", userLogin);

router.post("/ben-score", saveTestScore);

module.exports = {router};
