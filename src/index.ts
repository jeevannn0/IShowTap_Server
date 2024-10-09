import dotenv from 'dotenv';
dotenv.config();
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import supabase from './dbConfig';
const yoga = createYoga({ schema });
const server = createServer(yoga);

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('TOKEN is missing');
}
const bot = new TelegramBot(token, {
  polling: true,
});
const WEB_APP_URL = 'https://tap-me-client.vercel.app';
bot.onText(/\/start/, async (msg: Message) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || '';
  const lastName = msg.from?.last_name || '';
  const username = `${firstName} ${lastName}`;

  try {
    //check if user exists in db
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('chat_id', chatId)
      .single();
    if (!data) {
      // If user doesn't exist, insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ chat_id: chatId, name: username, coin_balance: 0 }]);
      if (insertError) {
        throw new Error(`Error inserting user: ${insertError.message}`);
      }
      bot.sendMessage(
        chatId,
        ` ${username}⚡ Start IShowTap`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Open IShowTap game',
                  web_app: { url: WEB_APP_URL },
                },
              ],
            ],
          },
        }
      );
    } else {
      // If user already exists, send a welcome back message
      bot.sendMessage(chatId, `Welcome back, ${username}!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open TapMe Game',
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
    }
  } catch (error) {
    console.error('Error handling /start:', error);
    bot.sendMessage(chatId, 'An error occurred. ');
  }
});

server.listen(4000, () => {
  console.log('server is running');
});
console.log('bot is running');
