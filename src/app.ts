const { Atem } = require("atem-connection");
const myAtem = new Atem();
myAtem.on("info", console.log);
myAtem.on("error", console.error);

myAtem.connect("192.168.0.222");

myAtem.on("connected", () => {
  // myAtem.changeProgramInput(3).then(() => {
  //   // Fired once the atem has acknowledged the command
  //   // Note: the state likely hasnt updated yet, but will follow shortly
  //   console.log("Program input set");
  // });
  console.log(myAtem.state);
});

console.log("Starteddddd");

myAtem.on("stateChanged", (state, pathToChange) => {
  console.log(state); // catch the ATEM state.
});
