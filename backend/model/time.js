db.users.updateMany(
    { "beneficiary.beneficiaryId": 11181329 },
    {
        $set: {
            "beneficiary.$[ben].mob": "1729913104",
            "beneficiary.$[ben].transaction.$[trx].beneficiaryMobile": "1729913104"
        }
    },
    {
        arrayFilters: [
            { "ben.beneficiaryId": 11181329 },
            { "trx.beneficiaryId": 11181329 }
        ]
    }
)
