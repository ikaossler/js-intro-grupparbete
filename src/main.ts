import "./style.css";
import { initRoom1 } from "./rooms/room1";
import { renderCaptchaRoom } from "./room2/room2";
import "./room2/room2.css";
import "./rooms/room4";

/*********************************************************
***************************TIMER**************************
**********************************************************/

const totalTimerElement = document.getElementById('total-time') as HTMLDivElement;

let totalStartTime = 0;
let totalTimerInterval: number | null = null;

function startTotalTimer() {
  totalStartTime = Date.now();
  
  //Skapa ett intervall som körs varje sekund
  totalTimerInterval = setInterval(() => {

    //Räkna ut hur många sekunder som gått sedan start
    //Date.now() minus starttid ger millisekunder, dela med 1000 för sekunder
    //Math.floor avrundar nedåt till hela sekunder
    const elapsedTime = Math.floor((Date.now() - totalStartTime) / 1000);

    //Räkna ut antal hela minuter genom att dela sekunder med 60
    //Math.floor avrundar nedåt till hela minuter
    const minutes = Math.floor(elapsedTime / 60);

    //Räkna ut resterande sekunder efter att minuter räknats bort
    //Modulo (%) ger resten efter division
    const seconds = elapsedTime % 60;

    //Uppdatera timer-elementets text
    //toString() gör om nummer till text
    //padStart(2, '0') lägger till nolla framför ensiffriga tal
    totalTimerElement.textContent = `Total Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);  
}

export function stopTotalTimer() {
  if (totalTimerInterval !== null) {
    clearInterval(totalTimerInterval);
    totalTimerInterval = null;
  }
}

/*********************************************************
***************************TIMER**************************
**********************************************************/



const startButton = document.getElementById('start-btn') as HTMLButtonElement;

startButton?.addEventListener('click', () => {
  startTotalTimer();
  showSection('room1');
});



/************ALLT EFTER DENNA KOMMENTAR ÄR MARIAS KOD********************/


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
  const room3Section = document.querySelector<HTMLElement>("#room3");
// If the first room section is not found, we cannot proceed with initializing the rooms.
  if (!room1Section || !room2Section) return;
// Update the progress bar to indicate the start of the game.
  updateProgress(0);
  const captchaRoom = renderCaptchaRoom(() => {
    updateProgress(3);
    room3Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const captchaHost = room2Section.querySelector<HTMLElement>("#captcha-room");
  if (captchaHost) {
    captchaHost.replaceWith(captchaRoom);
  } else {
    room2Section.appendChild(captchaRoom);
  }
// Initialize room 1 and provide a callback to update progress and
// scroll to the next room upon completion.
  initRoom1(room1Section, () => {
    updateProgress(2);
    room2Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
// The application starts by calling the initRooms function, which sets up the initial state and event listeners for the rooms.
// Start the application by initializing the rooms and setting up the initial state.
initRooms();
