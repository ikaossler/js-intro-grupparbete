import "./style.css";
import "./room 4/room4.css";
import "./room 4/room4";
import { initMariaRoom } from "./rooms/maria";

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

function initRooms(): void {
  const room1Section = document.querySelector<HTMLElement>("#room1");
  const room2Section = document.querySelector<HTMLElement>("#room2");

  if (!room1Section) return;

  updateProgress(0);

  initMariaRoom(room1Section, () => {
    updateProgress(2);
    room2Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

initRooms();
