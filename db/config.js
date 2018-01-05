const Sequelize = require('sequelize');
const CLEARDB_DATABASE_URL = 'mysql://b03e5e18f3e601:b92c6c39@us-cdbr-iron-east-05.cleardb.net/heroku_4d344af8cb59e0f?reconnect=true'




            match = process.env.CLEARDB_DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+)\/(.+)\?/);
            
            config = {
                user: match[1],
                pass: match[2],
                base: match[4],
                options: {
                    dialect: 'mysql',
                    protocol: 'mysql',
                    host: match[3],
                    port: 3306,
                    logging: false,
                    dialectOptions: {
                        ssl: true
                    }
                }
            };
            


        const sequelize = new Sequelize(config.base, config.user, config.pass, config.options)


//         const sequelize = new Sequelize('heroku_4d344af8cb59e0f', 'b03e5e18f3e601', 'b92c6c39', {
//   host: 'us-cdbr-iron-east-05.cleardb.net',
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

sequelize.authenticate().catch(err => console.log(err))
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
