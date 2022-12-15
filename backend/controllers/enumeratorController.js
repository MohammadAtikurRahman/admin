async function getEnumerator(req, res) {
    const { id } = req.params;
    const enumerator = await product.findById(id);
    return res.status(200).json(enumerator);
}

module.exports = { getEnumerator };
