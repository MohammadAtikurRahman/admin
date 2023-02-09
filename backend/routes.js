const express = require("express");
const router = express.Router();

const {getEnumerator, userLogin} = require("./controllers/enumeratorController");

const {
    addBeneficiary,
    updateBeneficiary,
    getBeneficiaries,
    beneficiaryLogin,
    saveTestScore,
    saveTest,

    addBeneficiaryScore,
    addBeneficiaryInBulk,
    deleteBeneficiary,
    saveMultiScore,
    newlogin,
    transaction,
    examStatus,
    enumeratorObservation,
    lastPagetext,
} = require("./controllers/beneficiaryController");

router.get("/enumerator/:id", getEnumerator);

router.get("/beneficiary", getBeneficiaries);
router.patch("/beneficiary/:id", updateBeneficiary);
router.post("/beneficiary", addBeneficiary);
router.delete("/beneficiary/:id", deleteBeneficiary);

router.post("/beneficiary/add/bulk", addBeneficiaryInBulk);

router.post("/save-test/add", saveTest);

router.post("/get-login", beneficiaryLogin); // beneficiary login
router.post("/get-score-saved", addBeneficiaryScore); // beneficiary login








router.post("/nowillingtoexam", examStatus); // beneficiary login

router.post("/observation", enumeratorObservation); // beneficiary login



router.get("/get-last-page-text/:beneficiaryId",lastPagetext); // beneficiary login







router.post("/get-saved-multi-score", saveMultiScore); // beneficiary login

router.post("/save-score", addBeneficiaryScore); // beneficiary login

/* admin login api */
router.post("/login", userLogin);

router.post("/ben-score", saveTestScore);

router.post("/get-login2",newlogin);
router.post("/transaction",transaction);

module.exports = {router};
