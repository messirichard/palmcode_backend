const models = require('../../../models');
const {paginate} = require("../../../util/util");
exports.getSubmission = async (req, res) => {
    const pageSize = req.body.page || 10;
    const page = req.body.offset || 0;

    try {
        const {count, rows, submission} = await models.Submission.findAndCountAll(
            (paginate(
                {
                    // conditions
                    attributes: ['id', 'name', 'email', 'id_variant', 'id_country', 'status'],
                    include: [
                        {
                            model: models.Variant,
                            attributes: ['name'],
                        },
                        {
                            model: models.Country,
                            attributes: ['name']
                        }
                    ],
                    order: [
                        ['id', 'ASC']
                    ]
                },
                { page, pageSize },
            ))
        )

        let data = rows

        if (data.length === 0) {
            return res.status(404).json({ message: "Submission Data Not Found" });
        }

        return res.status(200).json({ message: "Data Submission", count, data });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.getSubmissionById = async (req, res) => {
    const { id } = req.params;
    try {
        const submission = await models.Submission.findOne({
            where: {
                id
            },
            include: [
                {
                    model: models.Variant,
                    attributes: ['name'],
                },
                {
                    model: models.Country,
                    attributes: ['name']
                }
            ]
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission Data Not Found" });
        }

        return res.status(200).json({ data: submission });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.deleteSubmission = async (req, res) => {
    const { id } = req.params;
    const {status} = req.body;
    try {
        await models.Submission.update(
            {
                status
            },
            {
                where: {
                    id
                }
            }
        );
        return res.status(200).json({ message: "Submission Deleted" });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
