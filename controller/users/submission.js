exports.submissionStep1 = async (req, res) => {
    const {name, email, whatsapp_number, id_country} = req.body;
    try {
        const submission = await models.Submission.create({
            name,
            email,
            whatsapp_number,
            id_country,
        });

        const token = jwt.sign({ id: submission.id }, process.env.SECRET, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).json({ message: 'Success create submission step 1', token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
