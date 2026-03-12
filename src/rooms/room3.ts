import "./room3.css";
/* /borttagen kod för att main.ts ska lyssna på event istället för knappen direkt /maria*/
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
    hint: "One word",
    answer: "PET",
    altAnswers: ["PET", "PETS"],
  },
  {
    text: "🐍 + 📱 = ?",
    hint: "A game",
    answer: "SNAKE",
    altAnswers: ["SNAKE", "SNAKE GAME", "SNAKE SPEL"],
  },
  {
    text: "👁️ + 🥶 + 🐻",
    hint: "A animale",
    answer: "ICEBEAR",
    altAnswers: ["ICEBEAR", "ICE BEAR"],
  },
  {
    text: "🔥 + ❤️ + 🧊 + ⛓️",
    hint: "One word",
    answer: "COLDHEARTED",
    altAnswers: ["COLDHEARTED", "COLD HEARTED"],
  },
  {
    text: "❤️ + 💔 + 🌧️",
    hint: "One word",
    answer: "HEARTBREAK",
    altAnswers: ["HEARTBREAK", "HEART BREAK"],
  },
  {
    text: "☀️ + 👓 + 🧴",
    hint: "One Word",
    answer: "SUNSCREEN",
    altAnswers: ["SUNSCREEN", "SUN SCREEN"],
  },
  {
    text: "❄️ + 🏃 + 👟",
    hint: "One word",
    answer: "SNOWSHOES",
    altAnswers: ["SNOWSHOES", "SNOW SHOES"],
  },
  {
    text: "☀️ + 🌸 + 🌱",
    hint: "Two words",
    answer: "SUMMER MEADOW",
    altAnswers: ["SUMMER MEADOW", "SUMMER MEADOW"],
  },
  {
    text: "👁️ + 🌊 + 🍵 + 🗝️",
    hint: "One Word",
    answer: "IDENTITY",
    altAnswers: ["IDENTITY", "IDENTITY", "IDENTITY"],
  },
  {
    text: "⏰ + 🪟 + 🤔 + 💡",
    hint: "One word",
    answer: "INSIGHT",
    altAnswers: ["INSIGHT", "INSIGHT", "INSIGHT"],
  },
  {
    text: "🔥 + 🦊 + ❄️ + 🎭",
    hint: "Two words",
    answer: "FOX PLAY",
    altAnswers: ["FOX PLAY", "FOX GAME", "FOX GAME"],
  },
  {
    text: "🧠 + 🗝️ + 🚪 + 🌑",
    hint: "One word",
    answer: "SECRET",
    altAnswers: ["SECRET", "SECRET", "SECRET"],
  },
  {
    text: "🧠 + 🚂 + 👟",
    hint: "Two words",
    answer: "THOUGHT TRAIN",
    altAnswers: ["THOUGHT TRAIN", "THOUGHT TRAIN", "THOUGHT TRAIN"],
  },
  {
    text: "❤️ + ➡️ + 🎯",
    hint: "Two words",
    answer: "TARGET ORIENTED",
    altAnswers: ["TARGET ORIENTED", "TARGET ORIENTED", "TARGET ORIENTED"],
  },
  {
    text: "📖 + 🌙 + ⏰",
    hint: "Two words",
    answer: "GOODNIGHT STORY",
    altAnswers: ["GOODNIGHT STORY", "GOOD NIGHT STORY", "GOOD NIGHT STORY"],
  },
];

const JUNK_TEXTS: string[] = [
  "⚠️ WARNING: Your computer has 0 viruses. Congrats!",
  "🍕 You forgot to turn off the oven... or did you?",
  "📣 IMPORTANT MESSAGE: Nothing has happened.",
  "🐸 A frog just winked at you.",
  "💡 Did you know that lights shine when they're on?",
  "📞 MISSED CALL from: Unknown (7 times)",
  "🚨 ALERT: You have 9999 unrelated notifications.",
  "🌍 Earth's rotation: ONGOING (updated just now)",
  "🦆 A duck wants to be your friend. Accept?",
  "💾 ERROR: 'fun.exe' has stopped working",
  "🎵 Now playing: [Silence] – Volume: 0/10",
  "☕ Reminder: You haven't drunk enough water today.",
  "🔋 Battery: 100%... but it doesn't feel like it.",
  "📬 You have (1) new thought. Click here to ignore it.",
  "👾 CHEAT CODE UNLOCKED: Do nothing differently.",
  "🎯 UPDATE AVAILABLE: Popup 3.0 – Now with 50% more popups!",
  "🧠 FYI: The brain forgets 90% of everything. Including this.",
  "🪴 Your houseplant is doing fine. You don't need to water it.",
  "⏰ It is exactly the right time right now.",
  "📊 Statistics: 100% of you are reading this right now.",
  "🌈 Rainbow detected: NO rainbow was found in your vicinity.",
  "🎲 Randomness has decided: Nothing happens.",
  "🤖 AI ANALYSIS: You are human. Probably.",
  "🔐 PASSWORD REQUIRED... nah, X will do.",
  "🐧 A penguin just thought of you.",
  "📡 SIGNAL RECEIVED: Nothing to report.",
  "🧦 You probably have a pair of mismatched socks on.",
  "🌵 Did you know that cacti don't talk? Good.",
  "🪞 You blink about 15 times per minute. Now you're thinking about it.",
  "🦷 Remember to brush your teeth... or don't, we're just a popup.",
  "📺 Nothing is happening on TV right now either.",
  "🎪 WELCOME TO THE POPUP CIRCUS. The exits are sealed.",
  "💣 BOMB DETECTED: Haha no. But look out!",
  "🐌 A snail is trying to reach the exit. It takes a while.",
  "🎩 The magician wanted to show you a trick. He failed.",
  "🌮 TACO TUESDAY: It's not Tuesday. It doesn't matter.",
  "🔔 PING! You have no new messages. But now you know.",
  "🧊 The temperature in your fridge is unknown to us. Nice.",
  "🚪 There is a door here. It leads nowhere.",
  "🎈 A BALLOON HAS JUST POPPED somewhere in the world.",
  "🕹️ Press all the buttons! Nothing will happen anyway.",
  "🌀 LOADING ANIMATION: ████░░░░░░ 40% done. (Will never reach 100%.)",
  "🐔 The chicken or the egg? We don't know. Close the window.",
  "📎 Hi! Would you like help with your popup? (I can't help with that.)",
];

const WINDOW_TITLE_JUNK: string[] = [
  "IMPORTANT INFO",
  "ERROR MESSAGE",
  "UPDATE",
  "ALERT",
  "NOTIFICATION",
  "WARNING",
  "FYI",
  "CHEAT CODE",
  "SECRET INFO",
  "TOP SECRET",
  "POPUP #" + Math.floor(Math.random() * 9999),
];

/*******************************************/
/************** START BUTTON ***************/
/*******************************************/
let intervalsStarted: boolean = false;
let spawnInterval1: number | null = null;
let spawnInterval2: number | null = null;

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

    spawnInterval1 = setInterval(() => {
      if (activePopups < MAX_POPUPS && solvedRebuses.size < REBUSES.length) {
        spawnPopup();
      }
    }, 1200);

    spawnInterval2 = setInterval(() => {
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
    timerSeconds--;
    const min = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const sec = String(timerSeconds % 60).padStart(2, "0");
    (document.querySelector("#room3-timer") as HTMLElement).textContent = `${min}:${sec}`;

    if (timerSeconds <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleTimeout(): void {
  cleanupRoom3();
  showSection("room3-timeout");
}

/*******************************************/
/********** NEXT ROOM BUTTON ***************/
/*******************************************/


/*
BORTTAGEN KOD för att den inte behövs längre när vi skickar event till main.ts istället för att main.ts ska lyssna på knappen direkt. /maria
document.querySelector("#next-room-btn-room3")?.addEventListener("click", () => {
  cleanupRoom3();
  showSection("room4");
});*/

// Skickar event till main.ts att room3 är klart.
function notifyRoom3Completed(): void {
  document.dispatchEvent(new Event("room3:completed"));
}

// Körs när spelaren klickar på "Next room" i room3.
function handleNextRoomButtonClick(): void {
  cleanupRoom3();
  notifyRoom3Completed();
}

const nextRoomButton = document.querySelector<HTMLButtonElement>("#next-room-btn-room3");
if (nextRoomButton) {
  nextRoomButton.addEventListener("click", handleNextRoomButtonClick);
}

/*******************************************/
/*************** RESTART *******************/
/*******************************************/

document.querySelector("#restart-btn-room3")?.addEventListener("click", () => {
  cleanupRoom3();
  showSection("room1");
});

/*******************************************/
/*************** START OVER ****************/
/*******************************************/

document.querySelector("#timeout-startover-btn")?.addEventListener("click", () => {
  solvedRebuses.clear();
  closedCount = 0;

  (document.querySelector("#solved-count-room3") as HTMLElement).textContent = "0";
  (document.querySelector("#closed-count-room3") as HTMLElement).textContent = "0";
  (document.querySelector("#progress-bar-room3") as HTMLElement).style.width = "0%";
  (document.querySelector("#room3-timer") as HTMLElement).textContent = "10:00";

  const btn = document.querySelector("#start-room3-btn") as HTMLButtonElement;
  btn.style.display = "";

  showSection("room1");
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

function updateProgressRoom3(): void {
  const pct: number = (solvedRebuses.size / REBUSES.length) * 100;
  (document.querySelector("#progress-bar-room3") as HTMLElement).style.width =
    Math.min(pct, 100) + "%";
}

/*******************************************/
/**************** POPUP LOGIC **************/
/*******************************************/

interface IPopupOption {
  x: number;
  y: number;
}

function randomPos(w: number = 320, h: number = 240): IPopupOption {
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
      <input class="answer-input" placeholder="Your answer..." onkeydown="if(event.key==='Enter')fakeSubmit(this,'${fakeId}')">
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
      <span class="title-text">MESSAGE #${idx + 1}</span>
      <button class="close-btn" onclick="closePopup(this)">✕</button>
    </div>
    <div class="popup-body">${rebus.text}<br><small style="font-size:14px;color:#aaa">Tips: ${rebus.hint}</small></div>
    <div class="answer-input-wrap">
      <input class="answer-input" placeholder="Your answer..." onkeydown="if(event.key==='Enter')checkRebus(this,${idx})">
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
    (document.querySelector("#closed-count-room3") as HTMLElement).textContent =
      String(closedCount);
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
    fb.textContent = "✓ CORRECT! Well done!";
    fb.className = "answer-feedback right";
    solvedRebuses.add(idx);

    (document.querySelector("#solved-count-room3") as HTMLElement).textContent = String(
      solvedRebuses.size
    );
    updateProgressRoom3();

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
    fb.textContent = "✗ WRONG – try again!";
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
    "✗ WRONG – this is not a rebus.",
    "✗ Nope. That was incorrect.",
    "✗ Really? Try again (no).",
    "✗ Wrong! But nice try.",
    "✗ This is just useless info...",
    "✗ SYSTEM ERROR: The answer doesn't matter.",
    "✗ You answered something. It didn't help.",
    "✗ Hmm. Nope.",
    "✗ Interesting answer. But wrong.",
    "✗ 404 – Correct answer not found.",
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
      document.querySelector<HTMLElement>("#win-screen-room3")?.classList.add("show");
      setTimeout(() => {
        document.querySelector<HTMLElement>("#next-room-btn-room3")?.focus();
      }, 100);
    }, 800);
  }
}

function restartGame(): void {
  cleanupRoom3();
  solvedRebuses.clear();
  closedCount = 0;
  activePopups = 0;
  intervalsStarted = false;

  (document.querySelector("#solved-count-room3") as HTMLElement).textContent = "0";
  (document.querySelector("#closed-count-room3") as HTMLElement).textContent = "0";
  (document.querySelector("#progress-bar-room3") as HTMLElement).style.width = "0%";
  document.querySelector<HTMLElement>("#win-screen-room3")?.classList.remove("show");
  stopTimer();
  (document.querySelector("#room3-timer") as HTMLElement).textContent = "10:00";

  document.querySelectorAll<HTMLElement>(".popup").forEach((p) => p.remove());

  const btn = document.querySelector("#start-room3-btn") as HTMLButtonElement;
  btn.style.display = "";
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

(document.querySelector("#solved-count-room3") as HTMLElement).textContent = "0";

(window as any).closePopup = closePopup;
(window as any).checkRebus = checkRebus;
(window as any).fakeSubmit = fakeSubmit;
(window as any).restartGame = restartGame;

/*******************************************/
/***************** CLEANUP *****************/
/*******************************************/

function cleanupRoom3(): void {
  stopTimer();
  if (spawnInterval1 !== null) {
    clearInterval(spawnInterval1);
    spawnInterval1 = null;
  }
  if (spawnInterval2 !== null) {
    clearInterval(spawnInterval2);
    spawnInterval2 = null;
  }
  intervalsStarted = false;

  document.querySelectorAll<HTMLElement>(".popup").forEach((p) => p.remove());
  activePopups = 0;
}
