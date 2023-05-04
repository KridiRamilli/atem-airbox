import { AtemState, Atem } from "atem-connection";
import logger from "./logger";

type Inputs = {
  primary: number;
  secondary: number;
};

export const ntvAtem = (atemIp: string) => {
  const myAtem = new Atem();

  //When updating ip address, remove previus connection
  myAtem.disconnect();
  myAtem.connect(atemIp);
  myAtem.on("info", logger.info);
  myAtem.on("error", logger.error);
  myAtem.on("connected", () => {
    // myAtem.changeProgramInput(3).then(() => {
    //   // Fired once the atem has acknowledged the command
    //   // Note: the state likely hasnt updated yet, but will follow shortly
    //   console.log("Program input set");
    // });
    logger.info(myAtem.state);
  });

  myAtem.on("stateChanged", (state: AtemState, pathToChange: string[]) => {
    logger.info(state); // log the ATEM state.
  });

  return myAtem;
};

export const changeAirboxInput = async (
  atem: Atem,
  isPrimaryBoxAlive: boolean = true,
  primaryInputNumber: number,
  secondaryInputNumber: number
) => {
  // Program input
  const activeInput = atem.state?.video.mixEffects[0]?.programInput;

  if (!isPrimaryBoxAlive && activeInput === primaryInputNumber) {
    const res = await atem
      .changeProgramInput(secondaryInputNumber)
      .catch((err) => logger.error(err));
    logger.info(`Atem input changed to ${secondaryInputNumber}`);
  } else if (isPrimaryBoxAlive && activeInput === secondaryInputNumber) {
    const res = await atem.changeProgramInput(primaryInputNumber);
  } else {
    return;
  }
};
