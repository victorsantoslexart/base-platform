// db.js
const { Sequelize } = require('sequelize');

const config = {
  database: process.env.DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'host.docker.internal',
  port: process.env.DB_PORT,
  dialect: process.env.DIALECT || 'mysql',
  logging: false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5', 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: { max: 3 },
  dialectOptions: { multipleStatements: true },
};

let sequelizeInstance = null;

function initSequelize() {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(config.database, config.username, config.password, config);
  }
  return sequelizeInstance;
}

async function authenticate() {
  const s = initSequelize();
  console.log("Conexão autenticada para o Cron");

  await s.authenticate();
  return s;
}

async function closeSequelize() {
  if (sequelizeInstance) {
    try {
      await sequelizeInstance.close();
    } finally {
      sequelizeInstance = null;
    }
  }
}

function getSequelize() {
  return sequelizeInstance;
}

module.exports = {
  initSequelize,
  authenticate,
  closeSequelize,
  getSequelize,
};
