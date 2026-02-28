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
**********************************************************
**********************************************************/



const startButton = document.getElementById('start-btn') as HTMLButtonElement;

startButton?.addEventListener('click', () => {
  startTotalTimer();
  showSection('room1');
});



/************ALLT EFTER DENNA KOMMENTAR ÄR MARIAS KOD********************/


// OBS! Rummen initieras just nu på olika sätt.
// room1 använder init-funktion, medan andra rum körs via side-effect import.
// Kommer antagligen ändra detta senare för att få en mer enhetlig struktur /maria



// Lista med alla sektioner i spelet i den ordning de finns i HTML.
const sectionOrder = ["start", "room1", "room2", "room3", "room4"] as const;

// Skapar en typ av alla tillåtna sektionsnamn.
// Exempel: "start" | "room1" | "room2" | "room3" | "room4".
export type SectionId = (typeof sectionOrder)[number];

// Visar den valda sektionen.
// Gömmer alla andra sektioner.
export function showSection(activeId: SectionId): void {
  sectionOrder.forEach((id) => {
    const section = document.querySelector<HTMLElement>(`#${id}`);
    if (!section) return;
    section.hidden = id !== activeId;
  });
}

// Referens till progressbar-elementet i DOM.
const progressBar = document.querySelector<HTMLElement>("#progress-bar");
// Uppdaterar progressbaren utifrån vilket rum spelaren är i.
function updateProgress(roomNumber: number): void {
  if (!progressBar) return;
  progressBar.style.width = `${(roomNumber / 4) * 100}%`;
}
// Startar room1 och kopplar vad som ska hända när room1 är klart.
function initRooms(): void {
  const room1Section = document.querySelector<HTMLElement>("#room1");
  const room2Section = document.querySelector<HTMLElement>("#room2");
  const room3Section = document.querySelector<HTMLElement>("#room3");
  // Om room1 eller room2 inte finns i HTML kan vi inte starta spelet.
  if (!room1Section || !room2Section) return;
  // Startläge: ingen progression ännu.
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
  // När room1 är klart: uppdatera progress och scrolla till room2.
  initRoom1(room1Section, () => {
    updateProgress(2);
    room2Section?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
// Startar appen.
initRooms();
