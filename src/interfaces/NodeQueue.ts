import { AliveData } from './AliveData';

export interface NodeQueue {
  command: number;
  status: number;
  payload: {
    is_running: boolean;
    uuid: string;
    workers_count: number;
    alive: AliveData[];
  };
}
