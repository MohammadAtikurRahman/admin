const User = require("../model/user");

function getRandomNumber() {
    return Math.floor(Math.random() * 90000000) + 10000000;
}

async function randomNumberNotInUserCollection() {
    let x = getRandomNumber();

    let exists = await User.exists({userId: x});

    if (!exists) {
        return x;
    }
    return randomNumberNotInUserCollection();
}

function existsInArray(arr = [], x) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.beneficiaryId === x) {
            return true;
        }
    }
    return false;
}

async function randomNumberNotInBeneficiaryCollection(beneficiary) {
    let x = getRandomNumber();

    if (existsInArray(beneficiary, x)) {
        return randomNumberNotInUserCollection(beneficiary);
    }

    return x;
}

module.exports = {
    randomNumberNotInUserCollection,
    randomNumberNotInBeneficiaryCollection,
    getRandomNumber,
};
