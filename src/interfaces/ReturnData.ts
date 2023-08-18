export default interface ReturnData {
  service_name: string;
  instance_uuid: string | null;
  current_workers: number | null;
  max_workers: number;
}
