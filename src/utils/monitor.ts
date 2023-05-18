import { ntvAtem, changeAirboxInput } from "./atem";
import logger from "./logger";
import sendMail from "./mail";
import pingAirBox from "./ping";

type InputArgs = {
  atemIp: string;
  primaryIp: string;
  primaryInputNumber: number;
  secondaryInputNumber: number;
  frequency: number;
};

const monitorAirbox = (data: InputArgs) => {
  const atemSwitch = ntvAtem(data.atemIp);
  let pingFailures = 0;
  const id = setInterval(async () => {
    const pingRes = await pingAirBox(data.primaryIp, 5);
    let isPrimaryBoxAlive = pingFailures < 4;
    if (pingRes.alive === true) {
      pingFailures = 0;
      logger.info(pingFailures);
    } else {
      pingFailures++;
      logger.error(pingFailures);
    }

    !isPrimaryBoxAlive &&
      sendMail(["kridiramilli@gmail.com"], "AirBox1 Failed the transmission");
    changeAirboxInput(
      atemSwitch,
      isPrimaryBoxAlive,
      data.primaryInputNumber,
      data.secondaryInputNumber
    );
  }, data.frequency);

  return id;
};

export default monitorAirbox;
