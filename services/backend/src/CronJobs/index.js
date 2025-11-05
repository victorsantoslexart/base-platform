const { fork } = require('child_process');
const path = require('path');
const currentFilePath = path.dirname(__filename);
const pathFiles = currentFilePath + '/scripts'
const red = '\x1b[31m';
const magenta = '\x1b[35m';
const reset = '\x1b[0m';
const processes = require('./cron_list');

const startCronJobs = (script_process) => {
    const scriptPath = `${pathFiles}/${script_process.scriptFile}`;
    const childProcess = fork(scriptPath);
    const cron_expression = script_process.cron_expression;
    childProcess.send(`CRONJOB ${script_process.name} (PID ${childProcess.pid}) READY {${cron_expression}}.`);
    childProcess.on('message', (message) => {
        if (message.connectionMessage) {
            return console.log(`${magenta} ${message.connectionMessage} ${reset}`);
        }
        if (message.debug) {
            return console.log(`${magenta} ${new Date().toLocaleString()} | ${message.debug} ${reset}`);
        }
    });

    childProcess.on('close', (code) => {
        console.log(`${red} ${script_process.name} (PID ${childProcess.pid}) (CODE ${code}) FINISHED. ${reset}`);
    });
}

const init = async () => {
    processes.forEach((script_process) => {
        startCronJobs(script_process)
    })
}

module.exports = {
    init
};
