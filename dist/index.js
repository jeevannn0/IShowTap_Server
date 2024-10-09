"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const http_1 = require("http");
const graphql_yoga_1 = require("graphql-yoga");
const schema_1 = require("./schema");
const dbConfig_1 = __importDefault(require("./dbConfig"));
const yoga = (0, graphql_yoga_1.createYoga)({ schema: schema_1.schema });
const server = (0, http_1.createServer)(yoga);
const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error('BOT_TOKEN is missing in environment variables');
}
const bot = new node_telegram_bot_api_1.default(token, {
    polling: true,
});
const WEB_APP_URL = 'https://tap-me-client.vercel.app';
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || '';
    const lastName = msg.from?.last_name || '';
    const username = `${firstName} ${lastName}`;
    try {
        //check if user exists in db
        const { data, error } = await dbConfig_1.default
            .from('users')
            .select('*')
            .eq('chat_id', chatId)
            .single();
        if (!data) {
            // If user doesn't exist, insert new user
            const { error: insertError } = await dbConfig_1.default
                .from('users')
                .insert([{ chat_id: chatId, name: username, coin_balance: 0 }]);
            if (insertError) {
                throw new Error(`Error inserting user: ${insertError.message}`);
            }
            bot.sendMessage(chatId, `Welcome, ${username}! Start tapping to earn coins!`, {
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
        else {
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
    }
    catch (error) {
        console.error('Error handling /start:', error);
        bot.sendMessage(chatId, 'An error occurred.');
    }
});
server.listen(4000, () => {
    console.log('server is running');
});
console.log('bot is running');
