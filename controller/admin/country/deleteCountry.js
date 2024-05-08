const models = require('../../../models');

exports.deleteCountry = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const checkId = await models.Country.findOne({ where: { id } });

        if (!checkId) {
            return res.status(404).json({ message: 'Country Not Found' });
        }

        await models.Country.update(
            {
                status
            },
            {
                where: {
                    id
                }
            }
        );

        return res.status(200).json({ message: "Country Delete using Soft Delete" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
