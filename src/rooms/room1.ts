import "./room1.css";

// Rummet har två verifieringsfaser:
// 1) primaryCode
// 2) secondaryCode
type VerificationPhase = "primaryCode" | "secondaryCode";

// Samlar alla element som room1-logiken behöver.
type Room1Elements = {
  resendButton: HTMLButtonElement;
  flashCode: HTMLElement;
  codeInput: HTMLInputElement;
  checkButton: HTMLButtonElement;
  continueButton: HTMLButtonElement;
  message: HTMLElement;
  timer: HTMLElement;
};

// Detta är room1:s egna minne medan spelaren kör rummet.
// Här sparas t.ex. kod, antal fel och vilket steg spelaren är på.
type Room1State = {
  latestCode: string;
  previousCode: string;
  failedAttempts: number;
  hasUnlockedNextRoom: boolean;
  phase: VerificationPhase;
  secondsLeft: number;
  timerId: number | null;
};

// Hint-texter i ordning vid fel i första verifieringsfasen.
const PRIMARY_FAILURE_HINTS = [
  "Invalid code.",
  "Invalid code. Hint: First comes first. Second won't help you.",
  "Invalid code. Hint: Use the code that came first, not the most recent one.",
];
const PRIMARY_FAILURE_FALLBACK =
  "Invalid code. Hint: Press Resend twice, then enter the first of those two codes.";
// Texter för andra fasen.
const SECONDARY_VERIFICATION_PROMPT =
  "Security update: Two-step verification required.\nEnter the first valid code again.";
const SECONDARY_FAILURE_MESSAGE =
  "Second step failed. Hint: Same rule applies here.\nThe first valid code wins.";
const ROOM1_TIME_LIMIT_SECONDS = 3 * 60;
const ROOM1_TIMEOUT_MESSAGE = "Time is up. The room is restarting.";
const FLASH_PLACEHOLDER = "------";

// Hämtar alla element som room1 behöver för att fungera.
function getRoom1Elements(room: HTMLElement): Room1Elements | null {
  // Knapp för att skicka ny kod.
  const resendButton = room.querySelector<HTMLButtonElement>("#resend-btn");
  // Element där den nya koden visas kort.
  const flashCode = room.querySelector<HTMLElement>("#flash-code");
  // Input där användaren skriver sin kod.
  const codeInput = room.querySelector<HTMLInputElement>("#code-input");
  // Knapp för att verifiera koden.
  const checkButton = room.querySelector<HTMLButtonElement>("#check-btn");
  // Knapp för att gå vidare till rum 2 (visas när rummet är klart).
  const continueButton = room.querySelector<HTMLButtonElement>("#room1-continue-btn");
  // Element för feedback/hints till användaren.
  const message = room.querySelector<HTMLElement>("#room1-message");
  // Element som visar timern för room1.
  const timer = room.querySelector<HTMLElement>("#room1-timer");

  // Om något viktigt element saknas kan vi inte köra room1-logiken säkert.
  if (
    !resendButton ||
    !flashCode ||
    !codeInput ||
    !checkButton ||
    !continueButton ||
    !message ||
    !timer
  ) {
    return null;
  }

  // Returnerar alla hittade element samlade i ett objekt.
  return { resendButton, flashCode, codeInput, checkButton, continueButton, message, timer };
}

// Formaterar tid till mm:ss.
function formatRoomTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Skapar en 6-siffrig kod.
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hämtar rätt felmeddelande för antal misslyckade försök i primary-fasen.
function getPrimaryFailureMessage(failedAttempts: number): string {
  return PRIMARY_FAILURE_HINTS[failedAttempts - 1] ?? PRIMARY_FAILURE_FALLBACK;
}

// Entry point för room1:
// kopplar element, startar timer och registrerar alla event handlers.
export function initRoom1(room: HTMLElement, onComplete: () => void): void {
  // Hämta allt room1 behöver från DOM.
  const elements = getRoom1Elements(room);
  if (!elements) {
    return;
  }
  const room1Elements = elements;

  // Delay-id för att kunna städa bort väntande timeouts.
  let hideCodeTimeoutId: number | null = null;
  let secondaryPromptTimeoutId: number | null = null;

  // Samlat state för hela room1.
  const state: Room1State = {
    latestCode: "",
    previousCode: "",
    failedAttempts: 0,
    hasUnlockedNextRoom: false,
    phase: "primaryCode",
    secondsLeft: ROOM1_TIME_LIMIT_SECONDS,
    timerId: null,
  };

  // Ritar timern i UI.
  function renderRoomTimer(): void {
    room1Elements.timer.textContent = `Time: ${formatRoomTime(state.secondsLeft)}`;
  }

  // Stoppar timern om den körs.
  function stopRoomTimer(): void {
    if (state.timerId === null) {
      return;
    }
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  // Rensar väntande timeouts i room1.
  function clearPendingTimeouts(mode: "hide" | "secondary" | "all" = "all"): void {
    if ((mode === "hide" || mode === "all") && hideCodeTimeoutId !== null) {
      window.clearTimeout(hideCodeTimeoutId);
      hideCodeTimeoutId = null;
    }
    if ((mode === "secondary" || mode === "all") && secondaryPromptTimeoutId !== null) {
      window.clearTimeout(secondaryPromptTimeoutId);
      secondaryPromptTimeoutId = null;
    }
  }

  // Döljer den flashade koden.
  function hideFlashedCode(): void {
    room1Elements.flashCode.textContent = FLASH_PLACEHOLDER;
  }

  // Planerar när flash-koden ska döljas.
  function scheduleHideFlashedCode(): void {
    clearPendingTimeouts("hide");
    hideCodeTimeoutId = window.setTimeout(() => {
      hideCodeTimeoutId = null;
      hideFlashedCode();
    }, 500);
  }

  // Planerar texten för verifieringssteg 2.
  function scheduleSecondaryPrompt(): void {
    clearPendingTimeouts("secondary");
    secondaryPromptTimeoutId = window.setTimeout(() => {
      secondaryPromptTimeoutId = null;
      showSecondaryVerificationPrompt();
    }, 900);
  }

  // Visar meddelandet för andra verifieringssteget.
  function showSecondaryVerificationPrompt(): void {
    room1Elements.message.textContent = SECONDARY_VERIFICATION_PROMPT;
  }

  // Återställer room1 till startläge efter timeout.
  function resetRoomAfterTimeout(): void {
    state.latestCode = "";
    state.previousCode = "";
    state.failedAttempts = 0;
    state.hasUnlockedNextRoom = false;
    state.phase = "primaryCode";
    state.secondsLeft = ROOM1_TIME_LIMIT_SECONDS;

    room1Elements.codeInput.value = "";
    room1Elements.flashCode.textContent = FLASH_PLACEHOLDER;
    room1Elements.continueButton.hidden = true;
    room1Elements.message.textContent = ROOM1_TIMEOUT_MESSAGE;
    renderRoomTimer();
  }

  // Körs när tiden tar slut.
  function handleRoomTimeout(): void {
    stopRoomTimer();
    clearPendingTimeouts();
    resetRoomAfterTimeout();
    startRoomTimer();
  }

  // Tickar ner timern en sekund.
  function tickRoomTimer(): void {
    state.secondsLeft -= 1;
    renderRoomTimer();

    if (state.secondsLeft > 0) {
      return;
    }
    handleRoomTimeout();
  }

  // Startar en ny 3-minuters nedräkning.
  function startRoomTimer(): void {
    stopRoomTimer();
    state.secondsLeft = ROOM1_TIME_LIMIT_SECONDS;
    renderRoomTimer();
    state.timerId = window.setInterval(tickRoomTimer, 1000);
  }

  // Körs när spelaren klickar på "Resend".
  // Flyttar senaste kod till previousCode, skapar ny kod och flashar den kort.
  function handleResendClick(): void {
    // Den tidigare "latestCode" blir nu koden som spelaren ska verifiera mot.
    state.previousCode = state.latestCode;
    // Skapa en ny kod och spara den som senaste kod.
    state.latestCode = generateCode();
    // Visa den nya koden kort i UI.
    room1Elements.flashCode.textContent = state.latestCode;
    // Dölj den visade koden efter 500 ms.
    scheduleHideFlashedCode();
  }

  // Körs när spelaren klickar på "Continue to room 2".
  // Stoppar room1-timer och skickar kontroll tillbaka till main-flödet.
  function handleContinueClick(): void {
    stopRoomTimer();
    clearPendingTimeouts();
    onComplete();
  }

  // Låser upp nästa rum en gång.
  // Hindrar att knappen visas/förbereds flera gånger.
  function unlockNextRoomOnce(): void {
    if (state.hasUnlockedNextRoom) {
      return;
    }

    state.hasUnlockedNextRoom = true;
    room1Elements.continueButton.hidden = false;
    stopRoomTimer();
    clearPendingTimeouts();
  }

  // Hanterar kontroll i första steget (primaryCode).
  function handlePrimaryVerification(userValue: string): void {
    // Rätt kod i steg 1: byt till steg 2 och visa nästa instruktion.
    if (userValue === state.previousCode) {
      // Bekräfta att steg 1 är klar.
      room1Elements.message.textContent = "Access granted. Door unlocked...";
      // Byt intern state till steg 2.
      state.phase = "secondaryCode";
      // Nollställ felräknaren inför nästa steg.
      state.failedAttempts = 0;
      // Töm inputfältet innan användaren skriver i steg 2.
      room1Elements.codeInput.value = "";
      // Visa instruktionen för steg 2 efter en kort paus.
      scheduleSecondaryPrompt();
      return;
    }

    // Fel kod i steg 1: öka försök och visa nästa hint.
    state.failedAttempts += 1;
    room1Elements.message.textContent = getPrimaryFailureMessage(state.failedAttempts);
  }

  // Hanterar kontroll i andra steget (secondaryCode).
  function handleSecondaryVerification(userValue: string): void {
    // Rätt kod i steg 2: rummet är klart och continue-knappen visas.
    if (userValue === state.previousCode) {
      room1Elements.message.textContent = "Two-step verification complete. Escape successful.";
      unlockNextRoomOnce();
      return;
    }

    // Fel kod i steg 2: visa separat felmeddelande för andra steget.
    room1Elements.message.textContent = SECONDARY_FAILURE_MESSAGE;
  }

  // Körs när användaren klickar "Verify".
  // Väljer rätt verifieringsfas beroende på state.phase.
  function handleCheckClick(): void {
    const userValue = room1Elements.codeInput.value.trim();

    if (!state.previousCode) {
      room1Elements.message.textContent = "Invalid code.";
      return;
    }

    if (state.phase === "primaryCode") {
      handlePrimaryVerification(userValue);
      return;
    }

    handleSecondaryVerification(userValue);
  }

  // Kopplar alla klickhändelser för room1.
  room1Elements.resendButton.addEventListener("click", handleResendClick);
  room1Elements.checkButton.addEventListener("click", handleCheckClick);
  room1Elements.continueButton.addEventListener("click", handleContinueClick);

  // Starta room1 med en nedräkning från 03:00.
  startRoomTimer();
}
