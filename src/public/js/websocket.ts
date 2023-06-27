import type { WsData, IpNodes, Devices } from "../../types";

const ipNodes: IpNodes = {
  atemSwitch: document.querySelector(".atemSwitch"),
  primaryAirBox: document.querySelector(".primaryAirBox"),
  secondaryAirBox: document.querySelector(".secondaryAirBox"),
};

const updateStatus = (data: WsData) => {
  const devices = Object.keys(data) as Devices;

  //Do not show red light for active devices
  devices.forEach((device) => {
    const htmlNode = ipNodes[device];
    const redStatusLight = htmlNode?.querySelector(".red") as HTMLElement;
    const greenStatusLight = htmlNode?.querySelector(".green") as HTMLElement;

    if (data[device].isAlive) {
      //Turn off status light based on isAlive
      redStatusLight.style.display = "none";
      greenStatusLight.style.display = "block";
    } else {
      //Turn off status light based on isAlive
      redStatusLight.style.display = "block";
      greenStatusLight.style.display = "none";
    }
  });
};

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  let { data } = event;
  data = JSON.parse(data);
  if (data) {
    updateStatus(data);
  }
});
