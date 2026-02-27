import "./style.css";
import "./rooms/room4";
import { initRoom1 } from "./rooms/room1";

const sectionOrder = ["start", "room1", "room2", "room3", "room4"] as const;
export type SectionId = (typeof sectionOrder)[number];

export function showSection(activeId: SectionId): void {
  sectionOrder.forEach((id) => {
    const section = document.querySelector<HTMLElement>(`#${id}`);
    if (!section) return;
    section.hidden = id !== activeId;
  });
}

const progressBar = document.querySelector<HTMLElement>("#progress-bar");

function updateProgress(roomNumber: number): void {
  if (!progressBar) return;
  progressBar.style.width = `${(roomNumber / 4) * 100}%`;
}
// Initializes the rooms and sets up the necessary event listeners for room interactions.
function initRooms(): void {
  const room1Section = document.querySelector<HTMLElement>("#room1");
  const room2Section = document.querySelector<HTMLElement>("#room2");
  // If the first room section is not found, we cannot proceed with initializing the rooms.
  if (!room1Section) return;
  // Update the progress bar to indicate the start of the game.
  updateProgress(0);
  // Initialize room 1 and provide a callback to update progress and
  // scroll to the next room upon completion.
  initRoom1(room1Section, () => {
    updateProgress(2);
    room2Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
// Start the application by initializing the rooms and setting up the initial state.
initRooms();
