// const env = require('../.env')
const { config } = require('dotenv-safe');
config()
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const { enter, leave } = Stage
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const Scene = require('telegraf/scenes/base')

const axios = require('axios');
const { promises: fs } = require("fs");
const { read_pdf, verify_pdf } = require('./pdf_reader.js')

const documentScene = new Scene('document')

documentScene.on('document', async (ctx) => {
    console.log('documento')
    const { file_id } = ctx.message.document
    try {
        const { data: { result: { file_path } } } = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
        await downloadPDF(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`, "temp.pdf");

        if (!(await verify_pdf("temp.pdf"))){
            return await ctx.reply(`arquivo invalido, tente novamente`)
        }
        const total = await read_pdf("temp.pdf")
        console.log(total)
        ctx.reply(`seu total é de: R$${total}`)
        ctx.session.total = total
        ctx.scene.leave()
    } catch (erro) {
        ctx.reply(`houve um erro, tente novamente por favor`)
        console.log({ erro })
    }
});
documentScene.command('cancelar', async ctx => {
    await ctx.reply('cancelado')
    await ctx.scene.leave()
})

documentScene.on('text', ctx => {
    ctx.reply('lalalla envie seu documento ou digite /cancelar para cancelar')
})


documentScene.enter(ctx => {
    ctx.reply('envie seu documento ou digite /cancelar para cancelar')
})

documentScene.leave(ctx => {
    ctx.reply('tela inicial')
})


async function downloadPDF(pdfURL, outputFilename) {
    const { data } = await axios.get(pdfURL, {
        responseType: 'arraybuffer'
    })
    const buff = Buffer.from(data)
    await fs.writeFile(outputFilename, buff);
    console.log("done");


}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.telegram.sendMessage(process.env.CHAT_ID, 'Hello Telegram!');
const stage = new Stage([documentScene])
bot.use(session())
bot.use(stage.middleware())

bot.command('document', enter('document'))
bot.command('meu_total', ctx => ctx.session.total ? ctx.reply(`seu total é de: R$${ctx.session.total}`) : enter('document')(ctx))

bot.on('message', ctx => ctx.reply('Entre com /document ou /meu_total'))

bot.startPolling()

module.exports = { bot }