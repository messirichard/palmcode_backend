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
    //add indexing country
    await queryInterface.addIndex('Submissions', ['id_country'], { name: 'submissionIdCountry' });
    //add indexing variant
    await queryInterface.addIndex('Submissions', ['id_variant'], { name: 'submissionIdVariant' });
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
