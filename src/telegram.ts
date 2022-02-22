import { config } from 'dotenv-safe';
config()

import { Telegraf } from 'telegraf';
import axios, { Axios } from 'axios';
import fs from "fs";
import request from "request-promise-native";
const { read_pdf } = require('./pdf_reader.js')
// import { promises as fs } from 'fs';

// console.log(process.env.BOT_TOKEN,process.env.CHAT_ID)

const bot = new Telegraf(process.env.BOT_TOKEN!);
bot.telegram.sendMessage(process.env.CHAT_ID!, 'Hello Telegram!');

bot.on('text', (ctx) => {
  // console.log(ctx)
  // Explicit usage

  // Using context shortcut
  ctx.reply(`repetindo: ${ctx.message.text}`)
})




async function downloadPDF(pdfURL: string, outputFilename: string) {
  let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
  console.log("Writing downloaded PDF file to " + outputFilename + "...");
  fs.writeFileSync(outputFilename, pdfBuffer);
}



bot.on('document', async (ctx) => {
  console.log('documento')
  const { file_id } = ctx.message.document
  // const a = await ctx.telegram.getFileLink(file_id)
  // try {
    var { data } = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
    downloadPDF(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${data.result.file_path}`, "temp.pdf");
    const total = await read_pdf("temp.pdf")
    console.log(total)
    ctx.reply(`seu total é de: R$${total}`)
  // } catch(erro) {
    // ctx.reply(`houve um erro`)
    // console.log({erro})
  // }

  // const headers = {
  //   Accept: 'application/pdf',
  //   'Content-Type': 'application/json',
  //   mode: 'no-cors'
  // }
  // var { data } = await axios.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${data.result.file_path}`, { headers })
  // fs.writeFile('temp.pdf',data,)
  // console.log(data)
});


// (async()=>{
//   const headers = {
//     Accept: 'application/pdf',
//     'Content-Type': 'application/json',
//     mode: 'no-cors'
//   }
//   var { data } = await axios({
//     url:
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     method: "GET",
//     responseType: "blob"
//   })
//   // var { data } = await axios.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/documents/file_2.pdf`, { headers }) as any
// fs.writeFile('temp.pdf',data,'binary')})()




// downloadPDF("https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/ecf_faq.pdf", "somePDF.pdf");

// bot.on('message', (ctx) => {
//   console.log(ctx)
//   // Explicit usage
//   ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

//   // Using context shortcut
//   ctx.reply(`Hello ${ctx.state.role}`)
// })

bot.launch()
export { bot }
// bot.telegram.sendMessage(process.env.CHAT_ID, 'Hello Telegram!');