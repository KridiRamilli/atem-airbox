export type WsData = {
  atemSwitch: {
    isAlive: boolean;
    info: {
      message: string;
      error?: Error;
    };
  };
  primaryAirBox: {
    isAlive: boolean;
    info: {
      message: string;
      error?: Error;
    };
  };
  secondaryAirBox: {
    isAlive: boolean;
    info: {
      message: string;
      error?: Error;
    };
  };
};

export type InputArgs = {
  atemIp: string;
  primaryIp: string;
  secondaryIp: string;
  primaryInputNumber: number;
  secondaryInputNumber: number;
  frequency: number;
};

export type Inputs = {
  primary: number;
  secondary: number;
};

// export type IpNodes = {
//   atemSwitch: HTMLElement | null;
//   primaryAirBox: HTMLElement | null;
//   secondaryAirBox: HTMLElement | null;
// };

export type Devices = ["atemSwitch", "primaryAirBox", "secondaryAirBox"];

export type IpNodes = Record<string, HTMLElement | null>;
