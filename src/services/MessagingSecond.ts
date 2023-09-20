import amqplib from 'amqplib';
import { Buffer } from 'buffer';
import { RabbitData } from '../interfaces/RabbitData';
import dotenv from 'dotenv';

dotenv.config();

const sleep = (delay: any) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export async function getData(): Promise<RabbitData | null> {
  try {
    const queue = process.env.WORKER_QUEUE!;
    const connection = await amqplib.connect(process.env.AMQP_URL!);
    const channel = await connection.createChannel();

    const responseQueue = await channel.assertQueue('', { exclusive: true });

    const data = { command: 8, payload: {} };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      replyTo: responseQueue.queue,
    });

    const msg = await getMessage(channel, responseQueue.queue);

    await channel.close();
    await connection.close();

    const result = JSON.parse(msg.content.toString());

    // console.log(result);

    return result;
  } catch (e) {
    console.log('rabbit error: ' + e);
    return null;
  }
}

export async function pullData(serviceNames: string[]): Promise<void> {
  try {
    const queue = process.env.WORKER_QUEUE!;
    const connection = await amqplib.connect(process.env.AMQP_URL!);
    const channel = await connection.createChannel();

    serviceNames.map(async (serviceName) => {
      const data = { 
        command: 5,
        payload: {
            "name": 'spider-client',
            "server_id": serviceName
        } 
      };
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    })

    await channel.close();
    await connection.close();
  } catch (e) {
    console.log('rabbit error: ' + e);
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
