const cron = require('node-cron');
const { initSequelize, authenticate, closeSequelize } = require('./conexao_sequeliza');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

const startTask = async () => {
    try {
        /* Your code here */
        console.log(`Cron para destruir logs antigos iniciado`)
        process.send({ debug: `Cron para destruir logs antigos iniciado` });
        initSequelize();

        await authenticate();

        console.log(`Finalizado com sucesso!`)
        process.send({ debug: `Finalizado com sucesso!` });
    } catch (error) {
        /* Error handling */
        console.log(`DESTROY_LOGS ERROR: ${error.message}.`)
        process.send({ debug: `${error.message}` });
        process.exit(0)
    } finally {
        try {
            await closeSequelize();
            process.send({ debug: `Conexão fechada (${process.pid})` });
        } catch (cErr) {
            process.send({ debug: `Erro fechando conexão: ${cErr.message}` });
        }
    }
};

process.on('message', (message) => {
    // startTask()
    const cron_expression = message.match(/\{(.*?)\}/);
    if (!cron_expression) {
        console.log("No cron expression found");
    }
    process.send({ connectionMessage: message });
    cron.schedule(cron_expression[1], startTask);
});