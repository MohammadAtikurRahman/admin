import FuzzySearch from "fuzzy-search"; // Or: var FuzzySearch = require('fuzzy-search');

export function searchBeneficiary(beneficiaries, needle) {
    const searcher = new FuzzySearch(beneficiaries, ["name", "beneficiaryId"], {
        caseSensitive: false,
    });

    const result = searcher.search(needle);
    return result;
}
