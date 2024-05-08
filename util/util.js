const models = require("../models");
const bcrypt = require("bcryptjs");
const {sign} = require("jsonwebtoken");
/**
 * Check if data exists
 * @param data
 * @returns {Promise<Model>}
 */
exports.checkExists = async (table, column, data) => {
    let Table = table
    return await models.Table.findOne({ where: { column: data }})
}

exports.validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        );
};

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

exports.paginate = (query, { page, pageSize }) => {
    const offset = page * pageSize;
    const limit = pageSize;

    return {
        ...query,
        offset,
        limit,
    };
};

exports.generateToken = async (id, role, secret) => {
    return sign({ id, role}, secret, {
        expiresIn: 86400, // 24 hours
    });
}
