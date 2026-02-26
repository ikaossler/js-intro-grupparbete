import "./style.css";
import { initMariaRoom } from "./rooms/maria";

const progressBar = document.querySelector<HTMLElement>("#progress-bar");
// Function to update the progress bar based on the current room number.
function updateProgress(roomNumber: number): void {
  if (!progressBar) return;
  progressBar.style.width = `${(roomNumber / 4) * 100}%`;
}
 // Initializes the rooms and sets up the necessary event listeners and logic for each room.
function initRooms(): void {
  const room1Section = document.querySelector<HTMLElement>("#room1");
  const room2Section = document.querySelector<HTMLElement>("#room2");

  if (!room1Section) return;

  updateProgress(0);
// Initialize the first room (Maria's room) and provide a callback to 
// update progress and scroll to the next room upon completion.
  initMariaRoom(room1Section, () => {
    updateProgress(2);
    room2Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

initRooms();
