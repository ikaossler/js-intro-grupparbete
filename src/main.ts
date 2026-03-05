import "./style.css";
import { initRoom1 } from "./rooms/room1";
import { renderCaptchaRoom } from "./room2/room2";
import "./rooms/room3"
import "./login"
import "./room2/room2.css";
import "./rooms/room4";

const startButton = document.getElementById('start-btn') as HTMLButtonElement;


let gameStarted = false;

startButton?.addEventListener('click', () => {
  if (gameStarted) {
    return;
  }
  gameStarted = true;
  startTotalTimer();
  showSection('room4'); //ÄNDRA TILL RUM 1 INNAN PR!! 
});

// OBS! Rummen initieras just nu på olika sätt.
// room1 använder init-funktion, medan andra rum körs via side-effect import.
// Kommer antagligen ändra detta senare för att få en mer enhetlig struktur /maria

// Lista med alla sektioner i spelet i den ordning de finns i HTML.
const sectionOrder = ["start", "room1", "room2", "room3", "room4", "results"] as const;

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

/********************************************/
/**************** ABOUT US*******************/
/********************************************/

const aboutBtn = document.querySelector<HTMLButtonElement>("#about-btn");
const aboutSection = document.querySelector<HTMLElement>("#about");
const aboutCloseBtn = document.querySelector<HTMLButtonElement>("#about-close-btn");

aboutBtn?.addEventListener("click", () => {
  aboutSection?.classList.add("open");
});

aboutCloseBtn?.addEventListener("click", () => {
  aboutSection?.classList.remove("open")
});

aboutSection?.addEventListener("click", (e) => {
  if (e.target === aboutSection) aboutSection.classList.remove("open");
});

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
    totalTimerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000); 
}

export function stopTotalTimer() {
  if (totalTimerInterval !== null) {
    clearInterval(totalTimerInterval);
    totalTimerInterval = null;
  } else {
  }
}

export function showResults() {
  showSection('results'); // ← lägg till denna
  //Hämta elementet från html
  const finalTimeDisplay = document.getElementById('final-time-display') as HTMLSpanElement;

  //Hämta texten från totalTimerElement
  const timeText = totalTimerElement.textContent || '0:00';

  //Ta bort order "time:"
  const timeOnly = timeText.replace('Time: ', '');
  
  if (finalTimeDisplay) { 
  finalTimeDisplay.textContent = timeOnly;
  } else {
  }
   displayTop3();
}

/*********************************************************
********************HIGHSCORE TOP 10**********************
**********************************************************/

//Denna funktion röäknar ut hur många sek som gått sen start 
//Returnerar ett nummer (tex 245 för 4min o 5 sek)
export function getTotalTime(): number {
  const elapsedTime = Math.floor((Date.now() - totalStartTime) / 1000);
  return elapsedTime;
}

//Array för att lagra highscore
let highscore: { name: string; time: number }[] = [];

// LADDA highscores från localStorage när sidan startar
function loadHighscores() {
  const saved = localStorage.getItem('highscores');
  if (saved) {
    highscore = JSON.parse(saved);
    displayHighscores();
  }
}

export function addScore(name: string, time: number) {
  //Kolla om spelaren redan finns i listan
  const existingIndex = highscore.findIndex(score => score.name === name);

  if (existingIndex !== -1) {
    //Spelaren finns redan
    if (time < highscore[existingIndex].time) {  // ← Saknades {
      //Nytt resultat är bättre -> uppdatera tiden
      highscore[existingIndex].time = time;
    } else {
      //Nytt resultat är sämre -> gör ingenting, funktionen avslutas
      return;
    }
  } else {  // ← Ta bort duplicerad else här
    //Ny spelare -> lägg till i arrayen
    highscore.push({ name: name, time: time });
  }

  //Sortera - snabbast = bäst
  highscore.sort((a, b) => a.time - b.time);

  //Behåll bara top 10
  highscore = highscore.slice(0, 10);

  //Spara i LS
  localStorage.setItem('highscores', JSON.stringify(highscore));

  //Visa på sidan
  displayHighscores();
}

function displayHighscores() {
  const highscoreList = document.getElementById('highscore-top10-list') as HTMLOListElement;
  //Tömmer listan ifall där redan finns innehåll
  highscoreList.innerHTML = '';
  //Loopa ala highscore
  highscore.forEach((score) => {
    //skapa <li>-element
    const li = document.createElement('li');

  //formetera tiden från sek till M:SS
  const minutes = Math.floor(score.time / 60);
  const seconds = score.time % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  //Sätt texten: "namn - tid"
  li.textContent = `${score.name} - ${timeFormatted}`;
  //läg till <li> i <ol>
  highscoreList.appendChild(li);
});
}

/*********************************************************
********************HIGHSCORE TOP 3***********************
**********************************************************/

function displayTop3() {
  const top3List = document.getElementById('top3') as HTMLOListElement;
  
  //Töm listan
  top3List.innerHTML = '';
  
  //Tar bara de 3 första från highscore arrayen
  const top3 = highscore.slice(0, 3);
  
  //Loopa och skapa <li> 
  top3.forEach((score) => {
    const li = document.createElement('li');
    
    // Formatera tiden
    const minutes = Math.floor(score.time / 60);
    const seconds = score.time % 60;
    const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    li.textContent = `${score.name} - ${timeFormatted}`;
    top3List.appendChild(li);
  });
}

loadHighscores();



/*********************************************************
**************************RESET***************************
**********************************************************/

const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;


resetBtn?.addEventListener('click', () => {
  location.reload();
});

/*********************************************************
**********************SHARE RESULTS***********************
**********************************************************/

const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
const shareFeedback = document.getElementById('share-feedback') as HTMLParagraphElement;

shareBtn?.addEventListener('click', () => {
  const timeText = totalTimerElement.textContent?.replace('Time: ', '') || '0:00';
  const shareText = `I completed Error 404 in ${timeText}! Can you beat my record? 👾 https://länka-repot-här`;
  
  navigator.clipboard.writeText(shareText).then(() => {
    shareFeedback.textContent = '✅ Copied to clipboard!';
    setTimeout(() => {
      shareFeedback.textContent = '';
    }, 3000);
  });
});
