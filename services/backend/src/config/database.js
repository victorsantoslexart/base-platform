const { Sequelize } = require('sequelize');

const config = {
  database: process.env.DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'host.docker.internal',
  port: process.env.DB_PORT,
  dialect: process.env.DIALECT || 'mysql',
  logging: false,
  connectAttributes: {
    program_name: 'Sequelize',
    '_os': process.platform,
    '_client_name': 'libmysql',
    '_client_version': '8.0.21',
    '_pid': process.pid
  },
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(`${process.env.DB_PASSWORD}\0`)
  },
  dialectOptions: {
    multipleStatements: true,
  }
}

const sequelize = new Sequelize(config);

(async () => {
  try {
    await sequelize.authenticate();

    console.log('Conexão com o Banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao Banco de dados:', error);
  }
})();

module.exports = {
  sequelize,
  Sequelize
};