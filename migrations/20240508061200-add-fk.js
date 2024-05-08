'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint('Submissions', 'fk_new_variant_id');
    await queryInterface.addConstraint('Submissions', {
      fields: ['id_variant'],
      type: 'foreign key',
      name: 'fk_new_variant_id',
      references: {
        table: 'Variants',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Submissions', {
      fields: ['id_country'],
      type: 'foreign key',
      name: 'fk_new_country_id',
      references: {
        table: 'Countries',
        field: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
