const models = require("../models");

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
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
