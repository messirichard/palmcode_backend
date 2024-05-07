const models = require( '../../../models/index');
exports.getVariant = async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    try {
        const variant = await models.Variant.findAll({
            limit,
            offset,
        });
        res.status(200).json(variant);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
