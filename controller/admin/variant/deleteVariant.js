const models = require('../../../models');

exports.deleteVariant = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const checkId = await models.Variant.findOne({ where: { id } });

        if (!checkId) {
            return res.status(404).json({ message: 'Variant Not Found' });
        }

        await models.Variant.update(
            {
                status
            },
            {
                where: {
                    id
                }
            }
        );

        return res.status(200).json({ message: "Variant Delete using Soft Delete" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
