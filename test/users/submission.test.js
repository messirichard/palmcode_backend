const models = require('../../models'); // Update this path to where your models are located
const { generateToken, validateEmail } = require('../../util/util'); // Adjust to your utility file path
const submissionStep1 = require('../../controller/users/submission'); // Adjust to the path of your controller
const { Op } = require('sequelize');

jest.mock('../../models');
jest.mock('../../util/util');

describe('Submission Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                whatsapp_number: '123456789',
                id_country: '1'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if the email is invalid', async () => {
        validateEmail.mockResolvedValue(false);

        await submissionStep1(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Email' });
    });

    it('should return 400 with a token if email or WhatsApp number already exists', async () => {
        validateEmail.mockResolvedValue(true);
        models.Submission.findOne.mockResolvedValueOnce({ id: 1 });
        generateToken.mockResolvedValue('test-token');

        await submissionStep1(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User Already Exists', token: 'test-token' });
    });

    it('should create a submission and return 200 with a success message and token', async () => {
        validateEmail.mockResolvedValue(true);
        models.Submission.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        models.Submission.create.mockResolvedValue({ id: 2 });
        generateToken.mockResolvedValue('success-token');

        await submissionStep1(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success create submission step 1', token: 'success-token' });
    });

    it('should handle errors and return 404', async () => {
        validateEmail.mockResolvedValue(true);
        models.Submission.findOne.mockImplementation(() => { throw new Error('Test Error'); });

        await submissionStep1(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test Error' });
    });
});
