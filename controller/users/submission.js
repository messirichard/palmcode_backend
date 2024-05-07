const {sign} = require("jsonwebtoken");
const models = require("../../models/index");
const upload = require('../../middleware/fileMiddleware');

/**
 * Create new submission step 1
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.submissionStep1 = async (req, res) => {
    const {name, email, whatsapp_number, id_country} = req.body;
    try {
        const emailExists = await models.Submission.findOne({ where: { email: email }});
        const whatsappExists = await models.Submission.findOne({ where: { whatsapp_number: whatsapp_number }});
        // const emailValid = await validateEmail(email);

        if (emailExists || whatsappExists) {
            return res.status(404).json({ message: 'User Already Exists' });
        }

        // if (!emailValid) {
        //     return res.status(400).json({ message: 'Invalid Email' });
        // }

        const submission = await models.Submission.create({
            name,
            email,
            whatsapp_number,
            id_country,
        });

        const token = sign({ id: submission.id, whatsapp_number, role: process.env.JWTUSERROLE }, process.env.JWTUSERSECRETTOKEN, {
            expiresIn: 86400, // 24 hours
        });

        return res.status(200).json({ message: 'Success create submission step 1', token});
    } catch (error) {
        return  res.status(404).json({ message: error.message });
    }
}

/**
 * Create new submission step 2
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.submissionStep2 = async (req, res) => {
    const { surfing_experience, date, id_variant } = req.body;
    const {id} = res.locals.jwtData

    try {
        const checkId = await models.Submission.findOne({ where: { id }});

        if (parseInt(surfing_experience) < 1 || parseInt(surfing_experience) > 10) {
            return res.status(400).json({ message: 'Surfing experience must be in the range of 1-10' });
        }

        if (!checkId) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        if (!parseInt(surfing_experience) || !date || !id_variant) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const checkIdVariant = await models.Variant.findOne({ where: { id: id_variant }});

        if(!checkIdVariant) {
            return res.status(404).json({ message: 'Variant Not Found' });
        }

        await models.Submission.update({
            surfing_experience,
            date,
            id_variant,
        }, {
            where: { id }
        });

        return res.status(200).json({ message: 'Success create submission step 2' });
    } catch (error) {
        return  res.status(404).json({ message: error.message });
    }
}

/**
 * Create new submission step 3
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.submissionStep3 = async (req, res) => {
    const {id} = res.locals.jwtData

    try {
        const checkId = await models.Submission.findOne({ where: { id }});

        if (!checkId) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        if (req.file) {
            console.log('Uploaded File:', req.file);
            await models.Submission.update({
                identity: req.file.path
            }, {
                where: { id }
            });
        }

        return res.status(200).json({
            message: 'Success create submission step 3',
            fileUploaded: !!req.file
        });

    } catch (error) {
        return  res.status(404).json({ message: error.message });
    }
}
