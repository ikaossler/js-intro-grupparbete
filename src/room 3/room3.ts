import "./room3.css";
import { showSection, SectionId } from "../main";

/*******************************************/
/***************** TYPES *******************/
/*******************************************/

interface IRebus {
    text: string;
    hint: string;
    answer: string;
    altAnswers?: string[];
}

/*******************************************/
/***************** DATA ********************/
/*******************************************/

const REBUSES: IRebus[] = [
    {
        text: "🏠 + 🦁 = ?",
        hint: "ett ord",
        answer: "HUSDJUR",
        altAnswers: ["HUSDJUR", "HUS DJUR", "PET", "PETS"]
    },
    {
        text: "🐍 + 📱 = ?",
        hint: "Spel",
        answer: "SNAKE",
        altAnswers: ["SNAKE", "SNAKE GAME", "SNAKE SPEL"]
    },
    {
        text: "👁️ + 🥶 + 🐻",
        hint: "Ett djur",
        answer: "ISBJÖRN",
        altAnswers: ["ISBJÖRN", "IS BJÖRN", "ISBEAR", "IS BEAR"]
    },
    {
        text: "🔥 + ❤️ + 🧊 + ⛓️",
        hint: "Ett ord",
        answer: "KALLHJÄRTAD",
        altAnswers: ["KALLHJÄRTAD", "KALL HJÄRTAD", "COLDHEARTED", "COLD HEARTED"]
    },
    {
        text: "❤️ + 💔 + 🌧️",
        hint: "Ett ord",
        answer: "HJÄRTESORG",
        altAnswers: ["HJÄRTESORG", "HEARTSICK", "HEART SICK"]
    },
    {
        text: "☀️ + 👓 + 🧴",
        hint: "Ett ord",
        answer: "SOLKRÄM",
        altAnswers: ["SOLKRÄM", "SOL KRÄM", "SUNSCREEN", "SUN SCREEN"]
    },
    {
        text: "❄️ + 🏃 + 👟",
        hint: "Ett ord",
        answer: "SNÖSKOR",
        altAnswers: ["SNÖSKOR", "SNOWSHOES", "SNOW SHOES"]
    },
    {
        text: "☀️ + 🌸 + 🌱",
        hint: "Ett ord",
        answer: "SOMMARÄNG",
        altAnswers: ["SOMMARÄNG", "SUMMER MEADOW", "SUMMER MEADOW"]
    },
    {
        text: "👁️ + 🌊 + 🍵 + 🗝️",
        hint: "Ett ord",
        answer: "IDENTITET",
        altAnswers: ["IDENTITET", "IDENTITY", "IDENTITY"]
    },
    {
        text: "⏰ + 🪟 + 🤔 + 💡",
        hint: "Ett ord",
        answer: "INSIKT",
        altAnswers: ["INSIKT", "INSIGHT", "INSIGHT"]
    },
    {
        text: "🔥 + 🦊 + ❄️ + 🎭",
        hint: "Ett ord",
        answer: "RÄVSPEL",
        altAnswers: ["RÄVSPEL", "RÄV SPEL", "FOX GAME", "FOX GAME"]
    },
    {
        text: "🧠 + 🗝️ + 🚪 + 🌑",
        hint: "Ett ord",
        answer: "HEMLIGHET",
        altAnswers: ["HEMLIGHET", "SECRET", "SECRET"]
    },
    {
        text: "🧠 + 🚂 + 👟",
        hint: "Ett ord",
        answer: "TANKEBANA",
        altAnswers: ["TANKEBANA", "THOUGHT TRAIN", "THOUGHT TRAIN"]
    },
    {
        text: "❤️ + ➡️ + 🎯",
        hint: "Ett ord",
        answer: "MÅLINRIKTAD",
        altAnswers: ["MÅLINRIKTAD", "TARGET ORIENTED", "TARGET ORIENTED"]
    },
    {
        text: "📖 + 🌙 + ⏰",
        hint: "Ett ord",
        answer: "GODNATTSAGA",
        altAnswers: ["GODNATTSAGA", "GOOD NIGHT STORY", "GOOD NIGHT STORY"]
    }
];

const JUNK_TEXTS: string[] = [
  "⚠️ VARNING: Din dator har 0 virus. Grattis!",
  "🍕 Du glömde stänga av ugnen... eller?",
  "📣 VIKTIGT MEDDELANDE: Ingenting har hänt.",
  "🐸 En groda blinkade just åt dig.",
  "💡 Visste du att lampor lyser när de är på?",
  "📞 MISSAT SAMTAL från: Okänd (7 gånger)",
  "🚨 ALERT: Du har 9999 orelaterade notiser.",
  "🌍 Jordens rotation: PÅGÅR (uppdaterat nu)",
  "🦆 En anka vill bli din vän. Acceptera?",
  "💾 ERROR: 'fun.exe' has stopped working",
  "🎵 Nu spelar: [Tyst] – Volym: 0/10",
  "☕ Påminnelse: Du har inte druckit tillräckligt vatten idag.",
  "🔋 Batteri: 100%... men det känns inte så.",
  "📬 Du har (1) ny tanke. Klicka här för att ignorera den.",
  "👾 CHEAT CODE UNLOCKED: Gör ingenting annorlunda.",
  "🎯 UPPDATERING TILLGÄNGLIG: Popup 3.0 – Nu med 50% fler popups!",
  "🧠 FYI: Hjärnan glömmer 90% av allt. Inklusive detta.",
  "🪴 Din krukväxt mår bra. Du behöver inte vattna den.",
  "⏰ Det är precis rätt tid just nu.",
  "📊 Statistik: 100% av dig läser detta just nu.",
  "🌈 Regnbåge detekterad: INGEN regnbåge hittades i din omgivning.",
  "🎲 Slumpen har beslutat: Inget händer.",
  "🤖 AI-ANALYS: Du är mänsklig. Troligen.",
  "🔐 LÖSENORD KRÄVS... nah, det räcker med X.",
  "🐧 En pingvin har precis tänkt på dig.",
  "📡 SIGNAL MOTTAGEN: Ingenting att rapportera.",
  "🧦 Du har förmodligen ett par missmatchade strumpor på dig.",
  "🌵 Visste du att kaktusar inte pratar? Bra.",
  "🪞 Du blinkar ungefär 15 gånger per minut. Nu tänker du på det.",
  "🦷 Kom ihåg att borsta tänderna... eller gör det inte, vi är en popup.",
  "📺 Ingenting händer på TV just nu heller.",
  "🎪 VÄLKOMMEN TILL POPUP-CIRKUSEN. Utgångarna är igenbommade.",
  "💣 BOMBA DETEKTERAD: Haha nej. Men kolla upp!",
  "🐌 En snigel försöker nå utgången. Det tar ett tag.",
  "🎩 Trollkarlen vill visa dig ett trick. Han misslyckades.",
  "🌮 TACO-TISDAG: Det är inte tisdag. Det spelar ingen roll.",
  "🔔 PING! Du har inga nya meddelanden. Men nu vet du det.",
  "🧊 Kyl-temperaturen i ditt kylskåp är okänd för oss. Trevligt.",
  "🚪 Det finns en dörr här. Den leder till ingenstans.",
  "🎈 EN BALLONG HAR JUST SPRUCKIT någonstans i världen.",
  "🕹️ Tryck på alla knappar! Det händer ändå ingenting.",
  "🌀 LADDNINGSANIMATION: ████░░░░░░ 40% klar. (Kommer aldrig bli 100%.)",
  "🐔 Hönan eller ägget? Vi vet inte. Stäng rutan.",
  "📎 Hej! Vill du ha hjälp med din popup? (Det kan jag inte ge.)",
];

const WINDOW_TITLE_JUNK: string[] = [
  "VIKTIG INFO",
  "FELMEDDELANDE",
  "UPDATERING",
  "ALERT",
  "NOTIS",
  "VARNING",
  "FYI",
  "CHEAT CODE",
  "HEMLIG INFO",
  "TOP SECRET",
  "POPUP #" + Math.floor(Math.random() * 9999),
];

/*******************************************/
/************** START BUTTON ***************/
/*******************************************/
let intervalsStarted: boolean = false;

document.querySelector("#start-room3-btn")?.addEventListener("click", () => {
    const btn = document.querySelector("#start-room3-btn") as HTMLButtonElement;
    btn.style.display = "none";
    startRoom3();
});

function startRoom3(): void {
  startTimer();
  initialSpawn();

  if (!intervalsStarted) {
    intervalsStarted = true;

    setInterval(() => {
      if (activePopups < MAX_POPUPS && solvedRebuses.size < REBUSES.length) {
        spawnPopup();
      }
    }, 1200);

    setInterval(() => {
      if (activePopups < MAX_POPUPS - 2 && solvedRebuses.size < REBUSES.length) {
        spawnPopup();
        setTimeout(spawnPopup, 300);
      }
    }, 3500);
  }
}

/*******************************************/
/***************** TIMER *******************/
/*******************************************/

let timerInterval: number | null = null;
let timerSeconds: number = 0;

function startTimer(): void {
  timerSeconds = 600;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const min = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const sec = String(timerSeconds % 60).padStart(2, "0");
    (document.querySelector("#room3-timer") as HTMLElement).textContent = `${min}:${sec}`;
  }, 1000);
}

function stopTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/*******************************************/
/********** NEXT ROOM BUTTON ***************/
/*******************************************/

document.querySelector("#next-room-btn")?.addEventListener("click", () => {
  showSection("room4");
});

/*******************************************/
/***************** STATE *******************/
/*******************************************/

const solvedRebuses: Set<number> = new Set<number>();
let closedCount: number = 0;
let activePopups: number = 0;
const MAX_POPUPS: number = 25;

/*******************************************/
/***************** HELPERS *****************/
/*******************************************/

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o");
}

function updateProgress(): void {
    const pct: number = (solvedRebuses.size / REBUSES.length) * 100;
    (document.querySelector("#progress-bar-room3") as HTMLElement).style.width = Math.min(pct, 100) + "%";
}

/*******************************************/
/**************** POPUP LOGIC **************/
/*******************************************/

interface IPopupOption {
    x: number;
    y: number;
}

function randomPos(w:number = 320, h:number = 240): IPopupOption {
    const hudH = 36;
    const barH = 8;
    const x: number = Math.random() * (window.innerWidth - w - 20) + 10;
    const y: number = Math.random() * (window.innerHeight - h - hudH - barH - 20) + hudH + barH + 10;
    return { x, y };
}

function spawnPopup(): void {
  if (activePopups >= MAX_POPUPS) return;

  const unsolved: number[] = REBUSES.map((_, i) => i).filter((i) => !solvedRebuses.has(i));
  const showRebus: boolean = unsolved.length > 0 && (Math.random() < 0.35 || closedCount % 4 === 3);

  if (showRebus) {
    const rebusIndex: number = randomPick(unsolved);
    spawnRebusPopup(rebusIndex);
  } else {
    spawnJunkPopup();
  }
}

function spawnJunkPopup(): void {
  const popup: HTMLDivElement = document.createElement("div");
  popup.className = "popup junk-popup";

  const text: string = randomPick(JUNK_TEXTS);
  const title: string = randomPick(WINDOW_TITLE_JUNK);
  const fakeId: string = "junk-" + Math.random().toString(36).slice(2, 8);
  const { x, y } = randomPos(280, 200);

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  popup.innerHTML = `
    <div class="popup-titlebar">
      <span class="title-text">${title}</span>
      <button class="close-btn" onclick="closePopup(this)">✕</button>
    </div>
    <div class="popup-body">${text}</div>
    <div class="answer-input-wrap">
      <input class="answer-input" placeholder="Skriv svar..." onkeydown="if(event.key==='Enter')fakeSubmit(this,'${fakeId}')">
      <button class="answer-submit" onclick="fakeSubmit(this.previousElementSibling,'${fakeId}')">OK</button>
    </div>
    <div class="answer-feedback" id="${fakeId}"></div>
  `;

  document.body.appendChild(popup);
  activePopups++;
  makeDraggable(popup);
}

function spawnRebusPopup(idx: number): void {
  const rebus: IRebus = REBUSES[idx];
  const popup: HTMLDivElement = document.createElement("div");
  popup.className = "popup rebus-popup";
  popup.dataset.rebusIdx = String(idx);

  const { x, y } = randomPos(300, 220);
  popup.style.left = x + "px";
  popup.style.top = y + "px";

  popup.innerHTML = `
    <div class="popup-titlebar">
      <span class="title-text">MEDDELANDE #${idx + 1}</span>
      <button class="close-btn" onclick="closePopup(this)">✕</button>
    </div>
    <div class="popup-body">${rebus.text}<br><small style="font-size:14px;color:#aaa">Tips: ${rebus.hint}</small></div>
    <div class="answer-input-wrap">
      <input class="answer-input" placeholder="Skriv svar..." onkeydown="if(event.key==='Enter')checkRebus(this,${idx})">
      <button class="answer-submit" onclick="checkRebus(this.previousElementSibling,${idx})">OK</button>
    </div>
    <div class="answer-feedback" id="rf-${idx}"></div>
  `;

  document.body.appendChild(popup);
  activePopups++;
  makeDraggable(popup);

  const input = popup.querySelector<HTMLInputElement>(".answer-input");
  input?.focus();
}

/*******************************************/
/************** CLOSE & SPAWN **************/
/*******************************************/

function closePopup(btn: HTMLButtonElement): void {
  const popup = btn.closest<HTMLElement>(".popup");
  if (!popup) return;

  popup.style.animation = "none";
  popup.style.transform = "scale(0)";
  popup.style.opacity = "0";
  popup.style.transition = "transform 0.12s, opacity 0.12s";

  setTimeout(() => {
    popup.remove();
    activePopups--;
    closedCount++;
    (document.getElementById("closed-count") as HTMLElement).textContent = String(closedCount);
    spawnPopup();
  }, 120);
}

function checkRebus(input: HTMLInputElement, idx: number): void {
  const val: string = normalise(input.value.trim());
  const rebus: IRebus = REBUSES[idx];

  const correct: string[] = [rebus.answer, ...(rebus.altAnswers ?? [])].map(normalise);
  const fb = document.getElementById("rf-" + idx) as HTMLElement;

  const isCorrect: boolean = correct.some(
    (c) => val === c || (val.includes(c) && val.length >= 3) || (c.includes(val) && val.length >= 3)
  );

  if (isCorrect) {
    fb.textContent = "✓ RÄTT! Bra jobbat!";
    fb.className = "answer-feedback right";
    solvedRebuses.add(idx);

    (document.getElementById("solved-count") as HTMLElement).textContent = String(
      solvedRebuses.size
    );
    updateProgress();

    setTimeout(() => {
      const popup = document.querySelector<HTMLElement>(`.popup[data-rebus-idx="${idx}"]`);
      if (popup) {
        popup.style.transform = "scale(0)";
        popup.style.opacity = "0";
        popup.style.transition = "transform 0.15s, opacity 0.15s";

        setTimeout(() => {
          popup.remove();
          activePopups--;
          spawnPopup();
          checkWin();
        }, 150);
      }
    }, 600);
  } else {
    fb.textContent = "✗ FEL SVAR – försök igen!";
    fb.className = "answer-feedback wrong";
    input.value = "";
    input.focus();
    setTimeout(() => {
      fb.textContent = "";
      fb.className = "answer-feedback";
    }, 1500);
  }
}

function fakeSubmit(input: HTMLInputElement, id: string): void {
  if (!input.value.trim()) return;

  const jokes: string[] = [
    "✗ FEL – detta är ingen rebus.",
    "✗ Nä. Det var fel.",
    "✗ Verkligen? Prova igen (nej).",
    "✗ Fel! Men bra försök.",
    "✗ Detta är ju bara onödig info...",
    "✗ SYSTEM ERROR: Svaret spelar ingen roll.",
    "✗ Du svarade något. Det hjälpte inte.",
    "✗ Hmm. Nope.",
    "✗ Intressant svar. Men fel.",
    "✗ 404 – Rätt svar hittades ej.",
  ];

  const fb = document.getElementById(id) as HTMLElement;
  fb.textContent = randomPick(jokes);
  fb.className = "answer-feedback wrong";
  input.value = "";

  setTimeout(() => {
    fb.textContent = "";
    fb.className = "answer-feedback";
  }, 1800);
}

function checkWin(): void {
  if (solvedRebuses.size >= 10) {
    stopTimer();
    setTimeout(() => {
      document.getElementById("win-screen")?.classList.add("show");
    }, 800);
  }
}

function restartGame(): void {
  solvedRebuses.clear();
  closedCount = 0;
  activePopups = 0;

  (document.getElementById("solved-count") as HTMLElement).textContent = "0";
  (document.getElementById("closed-count") as HTMLElement).textContent = "0";
  (document.getElementById("progress-bar") as HTMLElement).style.width = "0%";
  document.getElementById("win-screen")?.classList.remove("show");
  stopTimer();
  (document.querySelector("#room3-timer") as HTMLElement).textContent = "10:00";

  document.querySelectorAll<HTMLElement>(".popup").forEach((p) => p.remove());
  startRoom3();
}

/*******************************************/
/****************** DRAG *******************/
/*******************************************/

function makeDraggable(popup: HTMLElement): void {
  const titlebar = popup.querySelector<HTMLElement>(".popup-titlebar")!;
  let dragging = false;
  let ox = 0;
  let oy = 0;

  titlebar.addEventListener("mousedown", (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("close-btn")) return;
    dragging = true;
    ox = e.clientX - popup.offsetLeft;
    oy = e.clientY - popup.offsetTop;
    popup.style.zIndex = "600";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (!dragging) return;
    popup.style.left =
      Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, e.clientX - ox)) + "px";
    popup.style.top =
      Math.max(36, Math.min(window.innerHeight - popup.offsetHeight - 8, e.clientY - oy)) + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    popup.style.zIndex = "500";
  });

  titlebar.addEventListener(
    "touchstart",
    (e: TouchEvent) => {
      if ((e.target as HTMLElement).classList.contains("close-btn")) return;
      const t: Touch = e.touches[0];
      dragging = true;
      ox = t.clientX - popup.offsetLeft;
      oy = t.clientY - popup.offsetTop;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e: TouchEvent) => {
      if (!dragging) return;
      const t: Touch = e.touches[0];
      popup.style.left =
        Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, t.clientX - ox)) + "px";
      popup.style.top =
        Math.max(36, Math.min(window.innerHeight - popup.offsetHeight - 8, t.clientY - oy)) + "px";
    },
    { passive: true }
  );

  document.addEventListener("touchend", () => {
    dragging = false;
  });
}

/*******************************************/
/******************* INIT ******************/
/*******************************************/

function initialSpawn(): void {
  for (let i = 0; i < 9; i++) {
    setTimeout(() => spawnPopup(), i * 120);
  }
}

(document.getElementById("solved-count") as HTMLElement).textContent = "0";

(window as any).closePopup = closePopup;
(window as any).checkRebus = checkRebus;
(window as any).fakeSubmit = fakeSubmit;
(window as any).restartGame = restartGame;
