import "./style.css"; // Import the main stylesheet for the application
import { initMariaRoom } from "./rooms/maria"; // Import the room initialization function from the maria room module
// This file is the entry point of the application. It loads the room definitions from a JSON file
type RoomDefinition = {
  id: string;
  name: string;
  description: string;
};
// Load the room definitions from a JSON file and initialize the rooms on the page
async function loadRooms(): Promise<void> {
  const response = await fetch("/rooms.json");
  const rooms = (await response.json()) as RoomDefinition[];

  const mariaRoom = rooms.find((room) => room.id === "room1");
  const roomSection = document.querySelector<HTMLElement>("#room1");

  // If the maria room or the room section is not found, return early
  if (!mariaRoom || !roomSection) return;
  // Set the inner HTML of the room section to display the room name, description, and a button to start the room
  roomSection.innerHTML = `
    <h2>${mariaRoom.name}</h2>
    <p>${mariaRoom.description}</p>
    <button type="button" id="start-room1">Start room</button>
  `;
  // Add an event listener to the start button that initializes the maria room when clicked
  const startButton = roomSection.querySelector<HTMLButtonElement>("#start-room1");
  if (!startButton) return;
  // When the start button is clicked, initialize the maria room by calling the initMariaRoom function and passing the room section as an argument
  startButton.addEventListener("click", () => {
    initMariaRoom(roomSection);
  });
}
// Call the loadRooms function to start the application and load the rooms on the page
void loadRooms();
