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
    addobservation,
    addBeneficiaryScore,
    addBeneficiaryInBulk,
    deleteBeneficiary,
    saveMultiScore,
    newlogin,
    examStatus,
    enumeratorObservation,
    lastPagetext,
    saveMultiObservation,
} = require("./controllers/beneficiaryController");

const {

    addTransaction,
    getTransactions 
   
} = require("./controllers/onlineController");








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







router.post("/get-saved-multi-score", saveMultiScore); 


router.post("/get-saved-multi-observation", saveMultiObservation); 




router.post("/save-score", addBeneficiaryScore); // beneficiary login

/* admin login api */
router.post("/login", userLogin);

router.post("/ben-score", saveTestScore);

router.post("/get-login2",newlogin);


router.post("/transaction",addTransaction);


router.get("/get-tran", getTransactions);

router.post("/add-observation",addobservation);


module.exports = {router};
