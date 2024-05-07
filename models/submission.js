'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Submission.init({
    name: DataTypes.STRING,
    id_country: DataTypes.SMALLINT,
    email: DataTypes.STRING,
    whatsapp_number: DataTypes.STRING,
    surfing_experience: DataTypes.SMALLINT,
    date: DataTypes.DATE,
    id_variant: DataTypes.SMALLINT,
    identity: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
};
