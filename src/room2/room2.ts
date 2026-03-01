interface ICaptchaItem {
    imageSrc: string;
    isCorrect: boolean;
    altText: string;
}

interface ICaptchaRound {
    prompt: string;
    items: ICaptchaItem[];
}

const BASE_URL = import.meta.env.BASE_URL;

const CAPTCHA_ROUNDS: ICaptchaRound[] = [
    {
        prompt: "Select all characters that are dark.",
        items: [
            { imageSrc: `${BASE_URL}img/Vader.jpeg`, isCorrect: true,  altText: "Darth Vader" },
            { imageSrc: `${BASE_URL}img/Neo.jpeg`, isCorrect: false,  altText: "Neo" },
            { imageSrc: `${BASE_URL}img/Snape.jpeg`, isCorrect: false,  altText: "Snape" },
            { imageSrc: `${BASE_URL}img/Batman.jpeg`, isCorrect: false,  altText: "Batman" },
            { imageSrc: `${BASE_URL}img/Voldemort.jpeg`, isCorrect: true,  altText: "Voldemort" },
            { imageSrc: `${BASE_URL}img/V.jpeg`, isCorrect: false,  altText: "V" },
            { imageSrc: `${BASE_URL}img/Morpheus.jpeg`, isCorrect: false,  altText: "Morpheus" },
            { imageSrc: `${BASE_URL}img/John-Wick.jpeg`, isCorrect: false,  altText: "John Wick" },
            { imageSrc: `${BASE_URL}img/Smith.jpeg`, isCorrect: true,  altText: "Agent Smith" },
        ],
    },
    {
        prompt: "Select all characters that are mutants.",
        items: [
            { imageSrc: `${BASE_URL}img/wolverine.jpeg`, isCorrect: true, altText: "Wolverine" },
            { imageSrc: `${BASE_URL}img/juggernaut.jpeg`, isCorrect: false, altText: "Juggernaut" },
            { imageSrc: `${BASE_URL}img/rogue.jpeg`, isCorrect: true, altText: "Rogue" },
            { imageSrc: `${BASE_URL}img/deadpool.jpeg`, isCorrect: false, altText: "Deadpool" },
            { imageSrc: `${BASE_URL}img/cyclops.jpeg`, isCorrect: true, altText: "Cyclops" },
            { imageSrc: `${BASE_URL}img/captain-marvel.jpeg`, isCorrect: false, altText: "Captain Marvel" },
            { imageSrc: `${BASE_URL}img/magneto.jpeg`, isCorrect: true, altText: "Magneto" },
            { imageSrc: `${BASE_URL}img/spider-man.jpeg`, isCorrect: false, altText: "Spider-Man" },
            { imageSrc: `${BASE_URL}img/storm.jpeg`, isCorrect: true, altText: "Storm" },
        ],
    },
    {
        prompt: "Select all kings.",
        items: [
            { imageSrc: `${BASE_URL}img/aragorn.jpeg`, isCorrect: true, altText: "Aragorn" },
            { imageSrc: `${BASE_URL}img/robert.jpeg`, isCorrect: true, altText: "Robert Baratheon" },
            { imageSrc: `${BASE_URL}img/aquaman.jpeg`, isCorrect: true, altText: "Aquaman" },
            { imageSrc: `${BASE_URL}img/mufasa.jpeg`, isCorrect: true, altText: "Mufasa" },
            { imageSrc: `${BASE_URL}img/elvis.jpeg`, isCorrect: false, altText: "Elvis Presley" },
            { imageSrc: `${BASE_URL}img/joffrey.jpeg`, isCorrect: true, altText: "Joffrey Baratheon" },
            { imageSrc: `${BASE_URL}img/martin-luther-king.jpeg`, isCorrect: false, altText: "Martin Luther King" },
            { imageSrc: `${BASE_URL}img/jon.jpeg`, isCorrect: false, altText: "Jon Snow" },
            { imageSrc: `${BASE_URL}img/freddie.jpeg`, isCorrect: false, altText: "Freddie Mercury" },
        ],
    },
];

let currentRoundIndex = 0;
let selectedItems: Set<number> = new Set();
let roomContainer: HTMLElement;
let focusedItemIndex: number = 0;
let timerIntervalId: number | null = null;
let roomStartTime: number = 0;

export function renderCaptchaRoom(onComplete: () => void): HTMLElement {
    resetRoomState();
    startRoomTimer();

    roomContainer = document.createElement("div");
    roomContainer.id = "captcha-room";
    roomContainer.className = "room-container";

    injectRoundHtml(onComplete);

    return roomContainer;
}

function resetRoomState(): void {
    currentRoundIndex = 0;
    selectedItems = new Set();
    focusedItemIndex = 0;
    timerIntervalId = null;
    roomStartTime = 0;
}

function startRoomTimer(): void {
    roomStartTime = Date.now();
    timerIntervalId = window.setInterval(updateTimerDisplay, 1000);
}

function stopRoomTimer(): void {
    if (timerIntervalId !== null) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
}

function updateTimerDisplay(): void {
    const timerElement = document.querySelector<HTMLElement>("#captcha-timer");
    if (!timerElement) return;
    const elapsedSeconds = Math.floor((Date.now() - roomStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    timerElement.textContent = formattedTime;
}

function injectRoundHtml(onComplete: () => void): void {
    const round = CAPTCHA_ROUNDS[currentRoundIndex];
    roomContainer.innerHTML = `
        <p class="captcha-room-prompt">${round.prompt}</p>

        <div 
            class="captcha-room-grid"
            id="captcha-grid"
            role="group"
            aria-label="Captcha selection grid">
            ${buildAllItemsHtml(round.items)}
        </div>

        <p class="captcha-room-feedback" id="captcha-feedback" aria-live="polite"></p>

        <button
            class="captcha-room-verify-btn"
            id="captcha-verify-btn"
            aria-label="Verify selections">
            Verify
        </button>
    `;

    updateTimerDisplay();

    attachItemClickListeners(onComplete);
    attachVerifyButtonListener(onComplete);
    updateFocusedItemVisual();
}

function buildAllItemsHtml(items: ICaptchaItem[]): string {
    return items.map((item, index) => buildSingleItemHtml(item, index)).join("");
}

function buildSingleItemHtml(item: ICaptchaItem, index: number): string {
    const isSelected = selectedItems.has(index);
    const isFocused = index === focusedItemIndex;
    const selectedClass = isSelected ? "selected" : "";
    const focusedClass = isFocused ? "focused" : "";
    return `
        <button
            class="captcha-item ${selectedClass} ${focusedClass}"
            data-index="${index}"
            aria-label="${item.altText}"
            aria-pressed="${isSelected}">
            <img src="${item.imageSrc}" alt="${item.altText}" />
            <span class="captcha-item-label">${item.altText}</span>
        </button>
    `;
}

function attachItemClickListeners(onComplete: () => void): void {
    const itemButtons = roomContainer.querySelectorAll<HTMLButtonElement>(".captcha-item");
    itemButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index!);
            toggleItemSelection(index, onComplete);
        });
    });
}

function toggleItemSelection(itemIndex: number, onComplete: () => void): void {
    if (selectedItems.has(itemIndex)) {
        selectedItems.delete(itemIndex);
    } else {
        selectedItems.add(itemIndex);
    }
    focusedItemIndex = itemIndex;
    injectRoundHtml(onComplete);
    restoreFocusToCurrentItem();
}

function attachVerifyButtonListener(onComplete: () => void): void {
    const verifyButton = roomContainer.querySelector<HTMLButtonElement>("#captcha-verify-btn");
    verifyButton?.addEventListener("click", () => {
        handleVerifyAttempt(onComplete);
    });
}

function handleVerifyAttempt(onComplete: () => void): void {
    const round = CAPTCHA_ROUNDS[currentRoundIndex];
    const correctIndexes = round.items
        .map((item, index) => (item.isCorrect ? index : -1))
        .filter(index => index !== -1);

        const allCorrectItemsSelected = correctIndexes.every(index => selectedItems.has(index));
        const noWrongItemsSelected = [...selectedItems].every(index => round.items[index].isCorrect);
        if (allCorrectItemsSelected && noWrongItemsSelected) {
            handleCorrectSelection(onComplete);
        } else {
            handleWrongSelection(onComplete);
        }
}

function handleCorrectSelection(onComplete: () => void): void {
    const isLastRound = currentRoundIndex === CAPTCHA_ROUNDS.length - 1;
    if (isLastRound) {
        stopRoomTimer();
        injectSuccessScreen(onComplete);
    } else {
        currentRoundIndex++;
        selectedItems = new Set();
        focusedItemIndex = 0;
        injectRoundHtml(onComplete);
    }
}

function handleWrongSelection(onComplete: () => void): void {
    showFeedback("Incorrect selection. Please try again.", "error");

    const grid = roomContainer.querySelector<HTMLElement>("#captcha-grid");

    setTimeout(() => {
        selectedItems = new Set();
        focusedItemIndex = 0;
        injectRoundHtml(onComplete);
    }, 2000);
}

function showFeedback(message: string, type: "error" | "success"): void {
    const feedbackElement = roomContainer.querySelector<HTMLElement>("#captcha-feedback");
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.classList.remove("error", "success");
        feedbackElement.classList.add(`feedback-${type}`);
    }
}

function injectSuccessScreen(onComplete: () => void): void {
    roomContainer.innerHTML = `
        <h2 class="captcha-success-title">Verification Complete!</h2>
        <p class="captcha-success-message">You have successfully completed the captcha challenge.</p>
        <button
            class="captcha-success-continue-btn"
            id="captcha-continue-btn"
            aria-label="Continue to next room">
            Continue
        </button>
    `;

    const continueButton = roomContainer.querySelector<HTMLButtonElement>("#captcha-continue-btn");
    continueButton?.addEventListener("click", () => {
        onComplete();
    });
    continueButton?.focus();
}

function moveFocusToItem(newIndex: number, onComplete: () => void): void {
    focusedItemIndex = newIndex;
    injectRoundHtml(onComplete);
    restoreFocusToCurrentItem();
}

function restoreFocusToCurrentItem(): void {
    const focusedButton = roomContainer.querySelector<HTMLButtonElement>(`[data-index="${focusedItemIndex}"]`);
    focusedButton?.focus();
}

function updateFocusedItemVisual(): void {
    const allButtons = roomContainer.querySelectorAll<HTMLButtonElement>(".captcha-item");
    allButtons.forEach((button, index) => {
        if (index === focusedItemIndex) {
            button.classList.add("focused");
        } else {
            button.classList.remove("focused");
        }
    });
}