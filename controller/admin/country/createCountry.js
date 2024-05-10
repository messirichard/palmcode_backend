const models = require('../../../models');

exports.createCountry = async (req, res) => {
    const { name, code } = req.body;

    if (!name && !code) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const checkCountryName = await models.Country.findOne({ where: { name } });
        const checkCountryCode = await models.Country.findOne({ where: { code } });

        if (checkCountryName || checkCountryCode) {
            return res.status(400).json({ message: 'Country Already Exists' });
        }

        const country = await models.Country.create({
            name,
            code,
            status: 1
        });

        return res.status(200).json({ message: "Country Created", country });

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
