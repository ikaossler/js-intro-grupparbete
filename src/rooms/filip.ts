interface ICaptchaItem {
    imageSrc: string;
    isCorrect: boolean;
    altText: string;
}

interface ICaptchaRound {
    prompt: string;
    items: ICaptchaItem[];
}

const CAPTCHA_ROUNDS: ICaptchaRound[] = [
    {
        prompt: "Select all characters that are dark.",
        items: [
            { imageSrc: "dark1.png", isCorrect: true, altText: "Dark character 1" },
            { imageSrc: "dark2.png", isCorrect: true, altText: "Dark character 2" },
            { imageSrc: "light1.png", isCorrect: false, altText: "Light character 1" },
            { imageSrc: "light2.png", isCorrect: false, altText: "Light character 2" },
        ],
    },
    {
        prompt: "Select all characters that are light.",
        items: [
            { imageSrc: "dark1.png", isCorrect: false, altText: "Dark character 1" },
            { imageSrc: "dark2.png", isCorrect: false, altText: "Dark character 2" },
            { imageSrc: "light1.png", isCorrect: true, altText: "Light character 1" },
            { imageSrc: "light2.png", isCorrect: true, altText: "Light character 2" },
        ],
    },
    {
        prompt: "Select all characters that are smiling.",
        items: [
            { imageSrc: "smile1.png", isCorrect: true, altText: "Smiling character 1" },
            { imageSrc: "smile2.png", isCorrect: true, altText: "Smiling character 2" },
            { imageSrc: "neutral1.png", isCorrect: false, altText: "Neutral character 1" },
            { imageSrc: "neutral2.png", isCorrect: false, altText: "Neutral character 2" },
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
    }, 1000);
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