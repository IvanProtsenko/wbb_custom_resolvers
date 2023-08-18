import { NodeQueue } from './NodeQueue';

export interface RabbitData {
  command: number;
  status: number;
  payload: {
    node_queue: string;
    max_workers: number;
    up_time: bigint;
    node: NodeQueue;
  }[];
}
