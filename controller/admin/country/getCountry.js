const models = require( '../../../models/index');
const {paginate} = require("../../../util/util");

exports.getCountry = async (req, res) => {
    const pageSize = req.body.page || 10;
    const page = req.body.offset || 0;

    try {
        const {count, rows, country} = await models.Country.findAndCountAll(paginate(
            {
                 // conditions
                order: [
                    ['id', 'ASC']
                ]
            },
            { page, pageSize },
        ));

        let data = rows

        if (data.length === 0) {
            return res.status(404).json({ message: "Country Data Not Found" });
        }

        return res.status(200).json({message: "Country Data", count, data, country});

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.getCountryById = async (req, res) => {
    const { id } = req.params;
    try {
        const country = await models.Country.findOne({
            where: {
                id
            }
        });

        if (!country) {
            return res.status(404).json({ message: "Country Data Not Found" });
        }

        return res.status(200).json({message: "Country Data", country});

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
