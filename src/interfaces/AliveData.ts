export interface AliveData {
  name: string;
  instances: {
    name: string;
    uuid: string;
    start_time: bigint;
    work_time_ms: bigint;
  }[];
}
