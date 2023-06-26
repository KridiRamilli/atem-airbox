import { ntvAtem, changeAirboxInput } from "./atem";
import logger from "./logger";
import sendMail from "./mail";
import pingAirBox from "./ping";

import type { InputArgs } from "../types";
import { sendWsData } from "./websocket";
import { PingResponse } from "ping";

const handlePingRes = (
  pingRes: PingResponse,
  boxNumber: number,
  statusData: any
) => {
  if (pingRes.alive === true) {
    //reset safe variables
    statusData[boxNumber].pingFailures = 0;
    statusData[boxNumber].isEmailSent = false;
    if (statusData[boxNumber].shouldStatusNotify) {
      sendWsData({
        primaryAirBox: {
          isAlive: true,
          info: { message: "Primary AirBox is alive" },
        },
      });
      //Stop sending info every interval
      statusData[boxNumber].shouldStatusNotify = false;
    }
  } else {
    //timeout of 4 failures
    statusData[boxNumber].pingFailures++;
    logger.error(statusData[boxNumber].pingFailures++);
  }
};

const monitorAirbox = (data: InputArgs) => {
  const atemSwitch = ntvAtem(data.atemIp);
  let box1PingFailures = 0;
  let box2PingFailures = 0;
  let isEmailSent = false;
  let shouldStatusNotify = true;
  const boxStatusData = {
    1: {
      pingFailures: 0,
      isEmailSent: false,
      shouldStatusNotify: true,
    },
    2: {
      pingFailures: 0,
      isEmailSent: false,
      shouldStatusNotify: true,
    },
  };
  const id = setInterval(async () => {
    const pingResPrimary = await pingAirBox(data.primaryIp, 5);
    const pingResSecondary = await pingAirBox(data.secondaryIp, 5);
    let isPrimaryBoxAlive = boxStatusData[1].pingFailures < 4;
    let isSecondaryBoxAlive = boxStatusData[2].pingFailures < 4;
    handlePingRes(pingResPrimary, 1, boxStatusData);
    handlePingRes(pingResSecondary, 2, boxStatusData);
    // if (pingRes.alive === true) {
    //   //reset safe variables
    //   box1PingFailures = 0;
    //   isEmailSent = false;
    //   if (shouldStatusNotify) {
    //     sendWsData({
    //       primaryAirBox: {
    //         isAlive: true,
    //         info: { message: "Primary AirBox is alive" },
    //       },
    //     });
    //     //Stop sending info every interval
    //     shouldStatusNotify = false;
    //   }
    // } else {
    //   //timeout of 4 failures
    //   box1PingFailures++;
    //   logger.error(box1PingFailures);
    // }

    if (!isPrimaryBoxAlive) {
      sendWsData({
        primaryAirBox: {
          isAlive: false,
          info: { message: "Primary AirBox is dead" },
        },
      });
      if (!isEmailSent) {
        sendMail(["kridiramilli@gmail.com"], "AirBox1 Failed the transmission");
        boxStatusData[1].isEmailSent = true;
      }
      //Reset alive status when ping is success
      boxStatusData[1].shouldStatusNotify = true;
    }

    if (!isSecondaryBoxAlive) {
      sendWsData({
        secondaryAirBox: {
          isAlive: false,
          info: { message: "Secondary AirBox is dead" },
        },
      });
      if (!isEmailSent) {
        sendMail(["kridiramilli@gmail.com"], "AirBox1 Failed the transmission");
        boxStatusData[2].isEmailSent = true;
      }
      //Reset alive status when ping is success
      boxStatusData[2].shouldStatusNotify = true;
    }

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
