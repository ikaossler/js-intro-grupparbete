import "./style.css"; // Import the main stylesheet for the application
import "./room 4/room4.css";
import "./room 4/room4";
import { initMariaRoom } from "./rooms/maria"; // Import the room initialization function from the maria room module
// This file is the entry point of the application. It loads the room definitions from a JSON file
type RoomDefinition = {
  id: string;
  name: string;
  description: string;
};
// In a real application, you would likely have separate HTML files or templates for each room, 
// but for simplicity, we are using a single HTML file with multiple sections for each room.

const sectionOrder = ["start", "room1", "room2", "room3", "room4"] as const;
export type SectionId = (typeof sectionOrder)[number];

// Utility function to show only the active section and hide the others.
export function showSection(activeId: SectionId): void {
  sectionOrder.forEach((id) => {
    const section = document.querySelector<HTMLElement>(`#${id}`);
    if (!section) return;
    section.hidden = id !== activeId;
  });
}
// For simplicity, we are using a single HTML file with multiple sections for each room.
function renderFinalRoom(roomSection: HTMLElement, room: RoomDefinition): void {
  roomSection.innerHTML = `
    <h2>${room.name}</h2>
    <p>${room.description}</p>
  `;
}
// For simplicity, we are using a single HTML file with multiple sections for each room.
function renderSimpleRoom(
  roomSection: HTMLElement,
  room: RoomDefinition,
  buttonId: string,
  buttonText: string,
  onNext: () => void,
): void {
  roomSection.innerHTML = `
    <h2>${room.name}</h2>
    <p>${room.description}</p>
    <button type="button" id="${buttonId}">${buttonText}</button>
  `;
// Add event listener to the button to proceed to the next room.
  const nextButton = roomSection.querySelector<HTMLButtonElement>(`#${buttonId}`);
  if (!nextButton) return;
  nextButton.addEventListener("click", onNext);
}
// In a real application, you would likely fetch room data from a server or have more complex 
// logic to determine the flow between rooms.

async function loadRooms(): Promise<void> {
  const response = await fetch(`${import.meta.env.BASE_URL}rooms.json`);
  const rooms = (await response.json()) as RoomDefinition[];
// Find the room definitions for each room by their IDs.
  const room1 = rooms.find((room) => room.id === "room1");
  const room2 = rooms.find((room) => room.id === "room2");
  const room3 = rooms.find((room) => room.id === "room3");
  const room4 = rooms.find((room) => room.id === "room4");
// Get references to the necessary DOM elements.
  const startButton = document.querySelector<HTMLButtonElement>("#start-btn");
  const room1Section = document.querySelector<HTMLElement>("#room1");
  const room2Section = document.querySelector<HTMLElement>("#room2");
  const room3Section = document.querySelector<HTMLElement>("#room3");
  const room4Section = document.querySelector<HTMLElement>("#room4");

// If any of the required elements are missing, we cannot proceed.
  if (
    !startButton ||
    !room1 ||
    !room2 ||
    !room3 ||
    !room4 ||
    !room1Section ||
    !room2Section ||
    !room3Section ||
    !room4Section
  ) {
    return;
  }
// Start by showing the initial section with the start button.
  showSection("start");

  startButton.addEventListener("click", () => {
    showSection("room1");
    initMariaRoom(room1Section, () => {
      showSection("room2");
      renderSimpleRoom(room2Section, room2, "to-room3-btn", "Go to room 3", () => {
        showSection("room3");
        renderSimpleRoom(room3Section, room3, "to-room4-btn", "Go to room 4", () => {
          showSection("room4");
          renderFinalRoom(room4Section, room4);
        });
      });
    });
  });
}

void loadRooms();
