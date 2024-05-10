const models = require('../../../models');

exports.createVariant = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name fields are required' });
    }

    try {
        const checkVariantName = await models.Variant.findOne({ where: { name } });

        if (checkVariantName) {
            return res.status(400).json({ message: 'Variant Already Exists' });
        }

        const variant = await models.Variant.create({
            name,
            status: 1
        });

        return res.status(200).json({ message: "Variant Created", variant });

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
