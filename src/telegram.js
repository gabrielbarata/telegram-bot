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
const { read_pdf, verify_pdf, download_pdf } = require('./pdf_reader.js')
const { total_a_pagar } = require('./total_a_pagar')


const reply_with_buttons = (ctx, title, buttons) => {
    ctx.replyWithHTML(
        title,
        Extra.HTML().markup(m =>
            m.inlineKeyboard(
                buttons.map(i => m.callbackButton(i, i))
                , { columns: 1 })
        )
    );
}

const tela_inicial = ctx => {
    // ctx.reply('Entre com /document, /meu_total ou /meu_total_a_pagar')
    reply_with_buttons(ctx, "<b>clique para começar</b>", ['documento', 'meu total', 'meu total a pagar'])
}






const documentScene = new Scene('documento')

documentScene.on('document', async (ctx) => {
    console.log('documento')
    const { file_id } = ctx.message.document
    try {
        const { data: { result: { file_path, file_unique_id } } } = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
        const path = `./consultas/${file_unique_id}.pdf`

        await download_pdf(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`, path);

        if (!(await verify_pdf(path))) {
            return await ctx.reply(`arquivo invalido, tente novamente`)
        }
        const total = await read_pdf(path)
        console.log(total)
        ctx.session.total = total
        ctx.session.total_a_pagar = total_a_pagar(total)

        await ctx.reply(`seu total é de: R$ ${total}`)
        await ctx.reply(ctx.session.total_a_pagar ? `seu total a pagar é de: R$ ${ctx.session.total_a_pagar}` : 'só fazemos até R$ 5000')

        ctx.scene.leave()
    } catch (erro) {
        ctx.reply(`houve um erro, tente novamente por favor`)
        console.log({ erro })
    }
});
documentScene.action('cancelar', async ctx => {
    await ctx.reply('cancelado');
    await ctx.answerCbQuery();
    await ctx.scene.leave()
})

const on_text = ctx => {
    reply_with_buttons(ctx, "<b>envie seu documento</b>", ['cancelar'])
    // ctx.reply('envie seu documento')
}


documentScene.on('text', on_text)
documentScene.enter(on_text)

documentScene.leave(tela_inicial)



const bot = new Telegraf(process.env.BOT_TOKEN)
bot.telegram.sendMessage(process.env.CHAT_ID, 'Hello Telegram!');
const stage = new Stage([documentScene])
bot.use(session())
bot.use(stage.middleware())

bot.action('documento', async ctx => {
    enter('documento')(ctx);
    await ctx.answerCbQuery();
})
bot.action('meu total', async ctx => {
    ctx.session.total ? ctx.reply(`seu total é de: R$ ${ctx.session.total}`) : enter('documento')(ctx)
    await ctx.answerCbQuery();
})
bot.action('meu total a pagar', async ctx => {
    ctx.session.total_a_pagar ? ctx.reply(`seu total a pagar é de: R$ ${ctx.session.total_a_pagar}`) : enter('documento')(ctx)
    await ctx.answerCbQuery();
})

bot.on('message', tela_inicial)

bot.startPolling()

module.exports = { bot }