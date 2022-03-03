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
const schedule = require('node-schedule')

const { read_pdf, verify_pdf, download_pdf } = require('./pdf_reader.js')
const { total_a_pagar } = require('./total_a_pagar')

const opt_button = ['envie sua consulta', 'meu total', 'meu total a pagar', 'contatar um atendente']

const delete_msg = async (ctx, many) => {
    for (let i = 0; i < many; i++) {
        const last_message_id = JSON.stringify(ctx.update).match(/"message_id":\d+/g).map(m => +m.match(/\d+/))[0];
        // console.log({last_message_id})
        await ctx.deleteMessage(last_message_id - i)
    }
}


const reply_with_buttons = async (ctx, title, buttons) => {
    try {
        await ctx.editMessageText(
            title,
            Extra.HTML().markup(m =>
                m.inlineKeyboard(
                    buttons.map(i => m.callbackButton(i, i))
                    , { columns: 1 })
            )
        );
    } catch {
        console.log('replyWithHTML')
        await ctx.replyWithHTML(
            title,
            Extra.HTML().markup(m =>
                m.inlineKeyboard(
                    buttons.map(i => m.callbackButton(i, i))
                    , { columns: 1 })
            )
        );
    }

}

const tela_inicial = async ctx => {
    await reply_with_buttons(ctx, "<b>escolha uma opção</b>", opt_button)
}


const documentScene = new Scene('documento')

documentScene.on('document', async (ctx) => {
    await ctx.reply(`calculando`)
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

        // await ctx.reply(`seu total é de: R$ ${total}`)
        // await ctx.reply(ctx.session.total_a_pagar ? `seu total a pagar é de: R$ ${ctx.session.total_a_pagar}` : 'só fazemos até R$ 5000')

        ctx.scene.leave()
    } catch (erro) {
        ctx.reply(`houve um erro, tente novamente por favor`)
        console.log({ erro })
    }
});
documentScene.action('cancelar', async ctx => {
    // await ctx.reply('cancelado');
    await ctx.answerCbQuery();
    await ctx.scene.leave()
})


documentScene.on('text', async ctx => await ctx.deleteMessage())
documentScene.enter(async ctx => await reply_with_buttons(ctx, "<b>envie seu documento</b>", ['cancelar']))

documentScene.leave(tela_inicial)



const bot = new Telegraf(process.env.BOT_TOKEN)
bot.telegram.sendMessage(process.env.CHAT_ID, 'Hello Telegram!');
// bot.telegram.sendMessage(process.env.CHAT_ID, JSON.stringify({ uno: 5521994651911, dos: '5521994651911' }, null, '\t'));
const stage = new Stage([documentScene])
bot.use(session())
bot.use(stage.middleware())

const notificacao = new schedule.scheduleJob('*/5 * * * * *', async () => {

    await bot.telegram.sendMessage(process.env.GROUP_ID, 'questionMessage', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'show dogs', url: "https://covid19.who.int/" },
                    { text: 'show cats', url: "https://covid19.who.int/" },
                    { text: 'show cats', url: "https://covid19.who.int/" },
                ],
                [
                    { text: 'show dogs', url: "https://covid19.who.int/" },
                    { text: 'show cats', url: "https://covid19.who.int/" },
                    { text: 'show dogs', url: "https://covid19.who.int/" },
                    { text: 'show cats', url: "https://covid19.who.int/" },

                ]
            ]
        },
    })
})

bot.use((ctx, next) => {
    console.log(ctx.message)
    if (ctx.message?.chat?.type == 'private') {
        return next()
    }
})

bot.action('envie sua consulta', async ctx => {
    enter('documento')(ctx);
    await ctx.answerCbQuery();
})


const get_tot = async (ctx, val, text) => {
    val ?
        await reply_with_buttons(ctx, `${text}${val}`, opt_button)
        : enter('documento')(ctx)
}


bot.action('meu total', async ctx => {
    await get_tot(ctx, ctx.session.total, 'seu total é de: R$ ')
    await ctx.answerCbQuery();
})
bot.action('meu total a pagar', async ctx => {
    await get_tot(ctx, ctx.session.total_a_pagar, 'seu total a pagar é de: R$ ')
    await ctx.answerCbQuery();
})

bot.action('contatar um atendente', async ctx => {
    await ctx.answerCbQuery();
    if (!ctx.session.total_a_pagar) {
        return await reply_with_buttons(ctx, `clique para enviar seu documento primeiro`, opt_button)
    }
    await ctx.reply('envie seu contato', { reply_markup: { keyboard: [[{ text: 'clique para enviar', request_contact: true }]] } })

})

bot.start(tela_inicial)

bot.on("contact", async ctx => {
    ctx.session.numero_de_telefone = ctx.message.contact.phone_number;
    const { first_name, last_name } = ctx.message.contact

    ctx.session.nome = `${first_name} ${last_name}`
    if (!ctx.session.total_a_pagar) {
        return enter('documento')(ctx)
    }
    const { nome, numero_de_telefone, total, total_a_pagar } = ctx.session
    await bot.telegram.sendMessage(process.env.ATTENDANT_ID, JSON.stringify({ nome, numero_de_telefone, total, total_a_pagar }, null, '\t'));
    await bot.telegram.sendMessage(process.env.ATTENDANT_ID, numero_de_telefone)
    await ctx.reply(`um atendente já irá contata-lo`)
});

bot.on('message', async ctx => {
    console.log(ctx.message)
    await ctx.deleteMessage()
    await ctx.reply(`inicie com /start`)
})




// const notificacao = new schedule.scheduleJob('*/5 * * * * *', async () => {
//     telegram.sendMessage(env.userID, `Essa é uma mensagem de evento [${contador++}]`, botoes)
//     await bot.telegram.sendMessage(process.env.ATTENDANT_ID, 'teste programd')
// })


bot.startPolling()



module.exports = { bot }