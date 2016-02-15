'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connecton opions
  sequelize: {
    uri: 'postgres://andy:Buttugly1@localhost:5432/andy',
    //uri: 'mysql://use:Buttugly1@localhost:3306/Res',
    options: {
      
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: false

};
