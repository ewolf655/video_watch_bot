import { Input } from 'telegraf';
import { botEnum } from '../constants/botEnum';
import fs from 'fs'

const invokeStart = async (ctx: any) => {
    const telegramId = ctx.from.id;
    // check if user exist, save if not found
    try {

        try {
            if (ctx.update?.message?.text === undefined) {
                await ctx.deleteMessage();
            }
        } catch { }

        let text = ''
        text += '<b>What can this bot do?</b>\n'
        text += `Greetings human! 🖐 Linkuei is the place of ...\n`

        await ctx.telegram.sendMessage(ctx.chat.id, text, {
            parse_mode: botEnum.PARSE_MODE_V2,
            reply_markup: {
                keyboard: [
                    [
                        { text: botEnum.combat1.key, callback_data: botEnum.combat1.value },
                    ],
                    [
                        { text: botEnum.combat2.key, callback_data: botEnum.combat2.value }
                    ],
                    [
                        { text: botEnum.combat3.key, callback_data: botEnum.combat3.value }
                    ]
                ],
                // inline_keyboard: [
                //     [
                //         { text: botEnum.combat1.key, callback_data: botEnum.combat1.value }
                //     ]
                // ]
            }
        });
    } catch (err) {
        console.error(err)
    }
};

const invokeCombat1 = async (ctx: any) => {
    const telegramId = ctx.from.id;
    // check if user exist, save if not found
    try {

        try {
            if (ctx.update?.message?.text === undefined) {
                await ctx.deleteMessage();
            }
        } catch { }

        let text = ''
        text += 'Great choice! 🥰 Here it is ->'

        await ctx.telegram.sendMessage(ctx.chat.id, text, {
            parse_mode: botEnum.PARSE_MODE_V2
        });
        // await ctx.replyWithVideo(Input.fromReadableStream(fs.createReadStream('./Mortal Kombat 3 Liu Kang Gameplay Playthrough.mp4')))
        await ctx.replyWithVideo({source: './sync-theme.mp4'})
    } catch (err) {
        console.error(err)
    }
}

module.exports = (bot: any) => {
    bot.start(invokeStart);

    bot.on('text', async (ctx) => {
        const commandTexts = [
            botEnum.combat1.key,
            botEnum.combat2.key,
            botEnum.combat3.key
        ]

        if (commandTexts.find(c => c === ctx.message.text)) {
            await invokeCombat1(ctx)
        }
    })
};
