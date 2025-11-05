module.exports = [
    {
        name: 'DESTROY_LOGS',
        type: 'cron',
        scriptFile: 'DESTROY_LOGS.js',
        cron_expression: '0 0 */30 * *'
        // cron_expression: '* * * * *' // De um em um minuto para teste
    }
]