import { RabbitData } from '../interfaces/RabbitData';
import ReturnData from '../interfaces/ReturnData';

export default function convertToReturnData(data: RabbitData): ReturnData[] {
  const result: ReturnData[] = [];

  data.payload.forEach((payload) => {
    console.log(payload);
    payload.node.payload.alive[0].instances.forEach((instance) => {
      let oneReturnData: ReturnData = {
        service_name: payload.node.payload.uuid,
        instance_uuid: instance.uuid,
        current_workers: payload.node.payload.workers_count,
        max_workers: payload.max_workers,
      };

      result.push(oneReturnData);
    });
  });

  return result;
}
