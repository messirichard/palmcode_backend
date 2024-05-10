const models = require('../../../models');

exports.updateCountry = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    if (!name && !code) {
        return res.status(400).json({ message: 'Some fields are required' });
    }

    try {
        const checkCountryName = await models.Country.findOne({ where: { name } });
        const checkCountryCode = await models.Country.findOne({ where: { code } });

        if (checkCountryName || checkCountryCode) {
            return res.status(400).json({ message: 'Country Already Exists' });
        }

        await models.Country.update(
            {
                name,
                code
            },
            {
                where: {
                    id
                }
            },
        );
        return res.status(200).json({ message: "Country Updated"});
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
