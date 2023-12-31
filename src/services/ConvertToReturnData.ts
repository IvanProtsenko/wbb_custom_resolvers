import { RabbitData } from '../interfaces/RabbitData';
import ReturnData from '../interfaces/ReturnData';

function checkIfEmail(testForEmail: string) {
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  return regex.test(testForEmail)
}

export default function convertToReturnData(data: RabbitData): ReturnData[] {
  const result: ReturnData[] = [];

  data.payload.forEach((payload) => {
    if (payload.node && payload.node.payload.alive[0].instances.length > 0) {
      payload.node.payload.alive[0].instances.forEach((instance) => {
        let oneReturnData: ReturnData = {
          service_name: payload.node_queue,
          instance_uuid: checkIfEmail(instance.profile_email) ? instance.profile_email : instance.uuid,
          current_workers: payload.node.payload.workers_count,
          max_workers: payload.max_workers,
        };

        result.push(oneReturnData);
      });
    } else {
      let oneReturnData: ReturnData = {
        service_name: payload.node_queue,
        instance_uuid: null,
        current_workers: null,
        max_workers: payload.max_workers,
      };

      result.push(oneReturnData);
    }
  });

  return result;
}
