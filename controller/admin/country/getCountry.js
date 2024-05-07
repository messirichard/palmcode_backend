const models = require( '../../../models/index');
exports.getCountry = async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    try {
        const country = await models.Country.findAll({
            limit,
            offset,
        });
        res.status(200).json(country);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
