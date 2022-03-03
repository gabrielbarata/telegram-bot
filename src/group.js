// const env = require('../.env')
const schedule = require('node-schedule')
// const Telegraf = require('telegraf')
// const Telegram = require('telegraf/telegram')
// const Extra = require('telegraf/extra')
// const Markup = require('telegraf/markup')
// const telegram = new Telegram(env.token)
// const bot = new Telegraf(env.token)


const notificar = () => {
    telegram.sendMessage(env.userID, `Essa é uma mensagem de evento [${contador++}]`, botoes)
}

const notificacao = new schedule.scheduleJob('*/5 * * * * *', notificar)

// bot.action('cancel', ctx => {
//     notificacao.cancel()
//     ctx.reply('Ok! Parei de pertubar...')
// })
