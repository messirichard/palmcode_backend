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
    //change length data for whatsapp number just 20
    await queryInterface.changeColumn('Submissions', 'whatsapp_number', {
      type: Sequelize.STRING(20)
    });
    // change length data for name just 50
    await queryInterface.changeColumn('Submissions', 'name', {
      type: Sequelize.STRING(50)
    });
    // change length data for email just 30
    await queryInterface.changeColumn('Submissions', 'email', {
      type: Sequelize.STRING(30)
    });
    // change length data for surfing experience for number just 1
    await queryInterface.changeColumn('Submissions', 'surfing_experience', {
      type: Sequelize.INTEGER(1)
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
