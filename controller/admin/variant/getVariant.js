const models = require( '../../../models/index');
const {paginate} = require("../../../util/util");

exports.getVariant = async (req, res) => {
    const pageSize = req.body.page || 10;
    const page = req.body.offset || 0;

    try {
        const {count, rows, variant} = await models.Variant.findAndCountAll(paginate(
            {
                 // conditions
            },
            { page, pageSize },
        ));

        let data = rows

        if (data.length === 0) {
            return res.status(404).json({ message: "Variant Data Not Found" });
        }

        return res.status(200).json({message: "Variant Data", count, data, variant});

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.getVariantById = async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await models.Variant.findOne({
            where: {
                id
            }
        });

        if (!variant) {
            return res.status(404).json({ message: "Variant Data Not Found" });
        }

        return res.status(200).json({message: "Variant Data", variant});

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
