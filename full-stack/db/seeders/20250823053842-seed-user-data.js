'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const { faker } = require('@faker-js/faker');

    try {
      await queryInterface.bulkInsert(
        'user',
        [
          {
            email: faker.internet.email(),
            password: 'password',
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            role: 'admin',
          },
          {
            email: faker.internet.email(),
            password: 'password',
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            role: 'user',
          },
        ],
        { transaction: transaction }
      );

      await queryInterface.addIndex('user', ['email'], {
        transaction: transaction,
        unique: true,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', {
      [Sequelize.Op.or]: [{ role: 'ADMIN' }, { role: 'USER' }],
    });
  },
};
