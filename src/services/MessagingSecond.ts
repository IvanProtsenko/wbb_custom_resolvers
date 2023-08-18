import amqplib from 'amqplib';
import { Buffer } from 'buffer';
import { RabbitData } from '../interfaces/RabbitData';

const sleep = (delay: any) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export default async function getData(): Promise<RabbitData | null> {
  try {
    const queue = 'worker-manager';
    const connection = await amqplib.connect(
      'amqp://TradeBot:62fj45l65%27b26456@amqp.console-bot.com:5672/Trading'
    );
    const channel = await connection.createChannel();

    const responseQueue = await channel.assertQueue('', { exclusive: true });

    const data = { command: 8, payload: {} };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      replyTo: responseQueue.queue,
    });

    const msg = await getMessage(channel, responseQueue.queue);

    await channel.close();
    await connection.close();

    return JSON.parse(msg.content.toString());
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getMessage(channel: any, queue: any) {
  for (let i = 0; i < 5; i++) {
    const msg = await channel.get(queue);
    if (msg) {
      return msg;
    }
    await sleep(1000);
  }
  throw new Error('timeout');
}
