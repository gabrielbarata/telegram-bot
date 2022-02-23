// import { config } from 'dotenv-safe';
// config()

// import { Context, Scenes, session, Telegraf } from 'telegraf';
// // import session from '@telegraf/session'
// // const session = require('@telegraf/session')

// import axios, { Axios } from 'axios';
// // import fs from "fs";
// import request from "request-promise-native";
// const { read_pdf } = require('./pdf_reader.js')
// import { promises as fs } from 'fs';
// import { buffer } from 'stream/consumers';
// // import { Stage, WizardScene } from 'telegraf/typings/scenes';


// // interface SessionData {
// //   lala: number
// //   // ... more session data go here
// // }

// // Define your own context type
// interface MyContext extends Context {
//   session?:any

//   // session?: SessionData
//   // ... more props go here
// }

// const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);
// bot.use(session())
// bot.telegram.sendMessage(process.env.CHAT_ID!, 'Hello Telegram!');

// bot.on('text', (ctx) => {
//   // ctx.session 
//   // console.log(ctx)

//   ctx.reply(`menagem anterior: ${ctx.session?ctx.session: ' ' }`)
//   ctx.session=ctx.message.text;

// })




// async function downloadPDF(pdfURL: string, outputFilename: string) {
//   // let pdfBuffer = await axios.get(pdfURL,{ responseEncoding: undefined });
//   const { data } = await axios.get(pdfURL, {
//     responseType: 'arraybuffer'
//   })
//   const buff = Buffer.from(data)
//   await fs.writeFile(outputFilename, buff);
//   console.log("done");
//   // let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });

//   // fs.writeFileSync(outputFilename, pdfBuffer);
//   // await fs.writeFile(outputFilename, pdfBuffer.data);
//   // await fs.writeFile(outputFilename, pdfBuffer);

// }



// bot.on('document', async (ctx) => {
//   console.log('documento')
//   const { file_id } = ctx.message.document
//   // const a = await ctx.telegram.getFileLink(file_id)
//   try {
//     const { data: { result: { file_path } } } = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
//     await downloadPDF(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`, "temp.pdf");
//     const total = await read_pdf("temp.pdf")
//     console.log(total)
//     ctx.reply(`seu total é de: R$${total}`)
//   } catch (erro) {
//     ctx.reply(`houve um erro`)
//     console.log({ erro })
//   }
// });




// // const Telegraf = require('telegraf');
// // const session = require('telegraf/session');
// // import Stage from 'telegraf/stage';
// import { Stage, WizardScene } from 'telegraf/typings/scenes';
// // import WizardScene from 'telegraf/scenes/wizard';
// // const superWizard = new WizardScene(
// //   'super-wizard',
// //   ctx => {
// //     ctx.reply("What's your name?");
// //     ctx.wizard.state.data = {};
// //     return ctx.wizard.next();
// //   },
// //   ctx => {
// //     ctx.wizard.state.data.name = ctx.message.text;
// //     ctx.reply('Enter your phone number');
// //     return ctx.wizard.next();
// //   },
// //   ctx => {
// //     ctx.wizard.state.data.phone = ctx.message.text;
// //     ctx.reply(`Your name is ${ctx.wizard.state.data.name}`);
// //     ctx.reply(`Your phone is ${ctx.wizard.state.data.phone}`);
// //     return ctx.scene.leave();
// //   }
// // );



// // const wizardCompra = new WizardScene('compra',
// //     ctx => {
// //         ctx.reply('O que você comprou?')
// //         ctx.wizard.next()
// //     },
// //     ctx => {
// //         // descricao = ctx.update.message.text
// //         ctx.reply('Quanto foi?')
// //         ctx.wizard.next()
// //     },
// //     // precoHandler,
// //     // dataHandler,
// //     // confirmacaoHandler
// // ) as scene

// // const stage = new Stage([wizardCompra]);




// // const dataScene = new Scenes.WizardScene(
// //   'compra',
// //     ctx => {
// //         ctx.reply('O que você comprou?')
// //         ctx.wizard.next()
// //     },
// //     ctx => {
// //         // descricao = ctx.update.message.text
// //         ctx.reply('Quanto foi?')
// //         ctx.wizard.next()
// //     },
// // )



// // const wizardCompra = new WizardScene('compra',
// //     ctx => {
// //         ctx.reply('O que você comprou?')
// //         ctx.wizard.next()
// //     },
// //     ctx => {
// //         // descricao = ctx.update.message.text
// //         ctx.reply('Quanto foi?')
// //         ctx.wizard.next()
// //     },
// //     // precoHandler,
// //     // dataHandler,
// //     // confirmacaoHandler
// // )

// // const bot = new Telegraf(env.token)
// // const stage = new Stage([wizardCompra,wizardCompra], { default: 'compra' })
// // const stage = new Scenes.Stage([dataScene.middleware()],);
// // bot.use(session())
// // bot.use([dataScene.middleware()])

// // bot.startPolling()



// // (async () => {
// //   console.log("começou")
// //   // fs.writeFileSync('aaa.txt', 'lalallalalala',{encoding:'utf8'})
// //   await downloadPDF("https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ecf_faq.pdf", "somePDF.pdf");
// //   console.log("acabou")
// // })()




// // (async()=>{
// //   const headers = {
// //     Accept: 'application/pdf',
// //     'Content-Type': 'application/json',
// //     mode: 'no-cors'
// //   }
// //   var { data } = await axios({
// //     url:
// //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
// //     method: "GET",
// //     responseType: "blob"
// //   })
// //   // var { data } = await axios.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/documents/file_2.pdf`, { headers }) as any
// // fs.writeFile('temp.pdf',data,'binary')})()




// // downloadPDF("https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ecf_faq.pdf", "somePDF.pdf");

// // bot.on('message', (ctx) => {
// //   console.log(ctx)
// //   // Explicit usage
// //   ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

// //   // Using context shortcut
// //   ctx.reply(`Hello ${ctx.state.role}`)
// // })


// // console.log({session})

// bot.launch()
// export { bot }
// // bot.telegram.sendMessage(process.env.CHAT_ID, 'Hello Telegram!');