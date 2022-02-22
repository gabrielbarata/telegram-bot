import { config } from 'dotenv-safe';
config()

import { Telegraf } from 'telegraf';
import axios, { Axios } from 'axios';

// console.log(process.env.BOT_TOKEN,process.env.CHAT_ID)

const bot = new Telegraf(process.env.BOT_TOKEN!);
bot.telegram.sendMessage(process.env.CHAT_ID!, 'Hello Telegram!');

bot.on('text', (ctx) => {
  // console.log(ctx)
  // Explicit usage

  // Using context shortcut
  ctx.reply(`repetindo: ${ctx.message.text}`)
})

bot.on('document',async (ctx)=>{
  // console.log(ctx.message)
  const {file_id} = ctx.message.document.thumb!
  const a = await ctx.telegram.getFileLink(file_id)
  // const {data}=await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
  console.log(a)
})
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