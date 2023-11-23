const telegramApi = require('node-telegram-bot-api');

const token = '6428636826:AAG9XwKcTK9RrVTMfv5yJvhdrvAHncgq4so';

const bot = new telegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./option')

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать)');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай)', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о получателе'},    
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/12.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в тестовый телеграм бот Сахаи');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }
        if (text === '/game') {

            return startGame(chatId);

        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю( попробуй еще раз. ');
    
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
           return startGame(chatId)
        }
        if (data != chats[chatId]){
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]} != ${data}! Чэ буоллун`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${data} = ${chats[chatId]}! Э5эрдэ`, againOptions)
        }
    })
}

start()