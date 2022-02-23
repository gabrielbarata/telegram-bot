// const env = require('../.env')
const { config } = require('dotenv-safe');
config()
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

const axios = require('axios');
const { promises: fs } = require("fs");
const { read_pdf } = require('./pdf_reader.js')

// let descricao = ''
// let preco = 0
// let data = null

// const confirmacao = Extra.markup(Markup.inlineKeyboard([
//     Markup.callbackButton('Sim', 's'),
//     Markup.callbackButton('Não', 'n'),
// ]))

// const precoHandler = new Composer()
// precoHandler.hears(/(\d+)/, ctx => {
//     preco = ctx.match[1]
//     ctx.reply('É para pagar que dia?')
//     ctx.wizard.next()
// })

// precoHandler.use(ctx => ctx.reply('Apenas números são aceitos...'))

// const dataHandler = new Composer()
// dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
//     data = ctx.match[1]
//     ctx.reply(`Aqui está um resumo da sua compra:
//         Descrição: ${descricao}
//         Preço: ${preco}
//         Data: ${data}
//     Confirma?`, confirmacao)
//     ctx.wizard.next()
// })

// dataHandler.use(ctx => ctx.reply('Entre com uma data no formato dd/MM/YYYY'))

const documentScene = new Scene('document')

const documenthandler = new Composer()
documenthandler.on('document', async (ctx) => {
    console.log('documento')
    const { file_id } = ctx.message.document
    try {
        const { data: { result: { file_path } } } = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
        await downloadPDF(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`, "temp.pdf");
        const total = await read_pdf("temp.pdf")
        console.log(total)
        ctx.reply(`seu total é de: R$${total}`)
        ctx.session.total = total
        ctx.wizard.next()
    } catch (erro) {
        ctx.reply(`houve um erro, tente novamente por favor`)
        console.log({ erro })
    }
});
documenthandler.command('cancelar', ctx => {
    ctx.reply('cancelado')
    // ctx.scene.leave()
    ctx.wizard.next()
})

documenthandler.on('text',ctx=>{
    ctx.reply('envie seu documento ou digite /cancelar para cancelar')
})

// confirmacaoHandler.action('n', ctx => {
//     ctx.reply('Compra excluída!')
//     ctx.scene.leave()
// })



async function downloadPDF(pdfURL, outputFilename) {
    const { data } = await axios.get(pdfURL, {
        responseType: 'arraybuffer'
    })
    const buff = Buffer.from(data)
    await fs.writeFile(outputFilename, buff);
    console.log("done");


}






// confirmacaoHandler.use(ctx => ctx.reply('Apenas confirme', confirmacao))

const wizardCompra = new WizardScene('compra',
    ctx => {
        ctx.reply('envie seu documento')
        ctx.wizard.next()
    },
    documenthandler,
    ctx => {
        ctx.reply(`asasdafaf ${ctx.session.total}`)
        ctx.wizard.next()
    },
    // ctx => {
    //     descricao = ctx.update.message.text
    //     ctx.reply('Quanto foi?')
    //     ctx.wizard.next()
    // },
    // precoHandler,
    // dataHandler,
    // confirmacaoHandler
)

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Stage([wizardCompra], { default: 'compra' })
bot.use(session())
bot.use(stage.middleware())

bot.startPolling()

module.exports = { bot }