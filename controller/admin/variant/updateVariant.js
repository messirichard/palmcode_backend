const models = require('../../../models');

exports.updateVariant = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Variant are required' });
    }

    try {
        const checkVariantName = await models.Variant.findOne({ where: { name } });

        if (checkVariantName) {
            return res.status(400).json({ message: 'Variant Already Exists' });
        }

        await models.Variant.update(
            {
                name,
            },
            {
                where: {
                    id
                }
            },
        );
        return res.status(200).json({ message: "Variant Updated"});
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
