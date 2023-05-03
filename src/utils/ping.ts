import ping, { PingConfig, PingResponse } from "ping";

const pingAirBox = async (airBoxIp: string, timeout: number) => {
  let pingRes: Awaited<Promise<PingResponse>>;
  const config: PingConfig = {
    timeout,
  };
  pingRes = await ping.promise.probe(airBoxIp, config);
  return pingRes;
};

export default pingAirBox;
