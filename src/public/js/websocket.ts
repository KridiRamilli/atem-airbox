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
    let status: string = "green";
    if (data[device].isAlive) {
      status = "red";
    }
    console.log(htmlNode);
    const statusLight = htmlNode?.querySelector(`.${status}`) as HTMLElement;
    //Turn off status light based on isAlive
    statusLight.style.display = "none";
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
  console.log(event);
  const { data } = event;
  if (data) {
    updateStatus(data);
  }
  console.log("Message from server ", event.data);
});
