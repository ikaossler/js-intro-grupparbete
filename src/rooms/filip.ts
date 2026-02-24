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
            { imageSrc: "filip/dark1.png", isCorrect: true, altText: "Dark character 1" },
            { imageSrc: "filip/dark2.png", isCorrect: true, altText: "Dark character 2" },
            { imageSrc: "filip/light1.png", isCorrect: false, altText: "Light character 1" },
            { imageSrc: "filip/light2.png", isCorrect: false, altText: "Light character 2" },
        ],
    },
    {
        prompt: "Select all characters that are light.",
        items: [
            { imageSrc: "filip/dark1.png", isCorrect: false, altText: "Dark character 1" },
            { imageSrc: "filip/dark2.png", isCorrect: false, altText: "Dark character 2" },
            { imageSrc: "filip/light1.png", isCorrect: true, altText: "Light character 1" },
            { imageSrc: "filip/light2.png", isCorrect: true, altText: "Light character 2" },
        ],
    },
    {
        prompt: "Select all characters that are smiling.",
        items: [
            { imageSrc: "filip/smile1.png", isCorrect: true, altText: "Smiling character 1" },
            { imageSrc: "filip/smile2.png", isCorrect: true, altText: "Smiling character 2" },
            { imageSrc: "filip/neutral1.png", isCorrect: false, altText: "Neutral character 1" },
            { imageSrc: "filip/neutral2.png", isCorrect: false, altText: "Neutral character 2" },
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
    attachKeyboardControls(onComplete);

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
    const timerElement = document.querySelector("#captcha-timer") as HTMLElement;
    if (!timerElement) return;
    const elapsedSeconds = Math.floor((Date.now() - roomStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    timerElement.textContent = `Time: ${formattedTime}`;
}

function injectRoundHtml(onComplete: () => void): void {
    const round = CAPTCHA_ROUNDS[currentRoundIndex];
    roomContainer.innerHTML = `
        <div class="captcha-room-header">
            <h2 class="captcha-room-title">Confirm you are human</h2>
            <div class="captcha-room-timer-wrapper">
                <span class="captcha-room-timer-label">Time:</span>
                <span class="captcha-room-timer" id="captcha-timer">Time: 0:00</span>
            </div>
        </div>

        <p class="captcha-room-prompt">${round.prompt}</p>

        <div 
            class="captcha-room-grid"
            id="captcha-grid"
            aria-label="Captcha selection grid">
            ${buildAllItemsHtml(round.items)}
        </div>

        <p class="captcha-room-feedback" id="captcha-feedback" aria-live="polite"></p>

        <button
            class="captcha-room-verify-btn"
            id="captcha-verify-btn">
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
            aria-label="${item.altText}">
            <img src="${item.imageSrc}" alt="${item.altText}" />
        </button>
    `;
}