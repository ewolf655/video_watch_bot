import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { Telegraf, Scenes, session } from 'telegraf';
import path from 'path';

dotenv.config();
if (process.env.NODE_ENV == ('development' || 'development ')) {
  dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
} else if (process.env.NODE_ENV == ('production' || 'production ')) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (process.env.NODE_ENV == ('staging' || 'staging ')) {
  dotenv.config({ path: path.join(__dirname, '..', '.env.staging') });
}

/**
 * Clusters of Node.js processes can be used to run multiple instances of Node.js
 *  that can distribute workloads among their application threads. When process isolation
 *  is not needed, use the worker_threads module instead, which allows running multiple 
 * application threads within a single Node.js instance.
 */

// ========================= Telegraf Bot =============================
const bot = new Telegraf(process.env.TELEGRAM_API_KEY, { handlerTimeout: 9_000_000 });
console.log(`configured bot [${process.env.TELEGRAM_API_KEY}]`);

bot.use((ctx, next) => {
  // if (ctx.update.message?.from.id === 5024160149 && ctx.update.message?.message_id === 3467) {
  //     return
  // }
  // console.log('>>>', ctx)
  return next();
});

bot.catch((err: any) => {
  console.log('Oops', err);

  bot.stop();

  process.exit(1);
});

const stage = new Scenes.Stage([
  // walletKeyListener as any,
]);
bot.use(session()); // Important! Scenes require session first
bot.use(stage.middleware()); // enable our scenes

// ------------- commands --------------
//start command
const startCommand = require('./commands/start');
startCommand(bot);

const app: Express = express();

app.use(express.json());
app.use('/', require('./routes/app.routes'));

app.get('/', (request: Request, response: Response) => {
  response.send('Health check v3');
});

// app.use('/transactions', require('./routes/transactions'));
app.listen(process.env.PORT, async function () {
  console.log(`Ready to go. listening on port:[${process.env.PORT}] on pid:[${process.pid}]`);
});

if (process.env.BOT_MODE === 'polling') bot.launch();