import "./maria.css";


export function initMariaRoom(room: HTMLElement, onComplete: () => void): void {
  // Get references to the interactive elements within the room.
  const resendButton = room.querySelector<HTMLButtonElement>("#resend-btn");
  const flashCode = room.querySelector<HTMLElement>("#flash-code");
  const codeInput = room.querySelector<HTMLInputElement>("#code-input");
  const checkButton = room.querySelector<HTMLButtonElement>("#check-btn");
  const message = room.querySelector<HTMLElement>("#room1-message");
  const roomTimerEl = room.querySelector<HTMLElement>("#room1-timer");
    // If any of the required elements are missing, we cannot proceed with the room logic.
  if (!resendButton || !flashCode || !codeInput || !checkButton || !message || !roomTimerEl) return;
  const startTime = Date.now();
  const timerId = window.setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    roomTimerEl.textContent = `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);

  // State variables to manage the verification code logic.
  let latestCode = "";
  let previousCode = "";
  let failedAttempts = 0;
  let isCompleted = false;
  let phase: "step1" | "step2" = "step1";

  // Function to generate a random 6-digit code.
  function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  // Event listener for the resend button to generate and display a new code.
  resendButton.addEventListener("click", () => {
    previousCode = latestCode;
    latestCode = generateCode();
    // Flash the new code to the user.
    flashCode.textContent = latestCode;
    setTimeout(() => {
      flashCode.textContent = "------";
    }, 500);
  });
// Event listener for the check button to validate the entered code based on the current phase of verification.
  checkButton.addEventListener("click", () => {
    const userValue = codeInput.value.trim();
 // Validate the user input against the appropriate code based on the current phase of verification.
    if (!previousCode) {
      message.textContent = "Invalid code.";
      return;
    }
// First phase: Validate against the previous code. If correct, move to the second phase. 
// If incorrect, provide hints and track failed attempts.
    if (phase === "step1") {
      if (userValue === previousCode) {
        message.textContent = "Access granted. Door unlocked...";
        phase = "step2";
        failedAttempts = 0;
        codeInput.value = "";
 // After a short delay, prompt the user for the second step of verification.
        setTimeout(() => {
          message.textContent =
            "Security update: Two-step verification required.\nEnter the first valid code again.";
        }, 900);
        return;
      }
      // Incorrect code entered in the first step. Provide hints based on the number of failed attempts.
      failedAttempts += 1;
      // Provide increasingly specific hints after each failed attempt, up to a certain limit.
      const hints = [
        "Invalid code.",
        "Invalid code. Hint: First comes first. Second won't help you.",
        "Invalid code. Hint: Use the code that came first, not the most recent one.",
      ];
      // After 3 failed attempts, provide a more direct hint about the process of obtaining the code.
      message.textContent =
        hints[failedAttempts - 1] ??
        "Invalid code. Hint: Press Resend twice, then enter the first of those two codes.";
      return;
    }
    // Second phase: Validate against the previous code again. If correct, complete the verification process.
    if (userValue === previousCode) {
      message.textContent = "Two-step verification complete. Escape successful.";
      if (!isCompleted) {
        isCompleted = true;
        const continueButton = document.createElement("button");
        continueButton.type = "button";
        continueButton.id = "continue-btn";
        continueButton.textContent = "Continue to room 2";
        continueButton.addEventListener("click", () => {
          window.clearInterval(timerId);
          onComplete();
        });
        room.appendChild(continueButton);
      }
      return;
    }
    // Incorrect code entered in the second step. Provide a hint that the same rule applies.
    message.textContent =
      "Second step failed. Hint: Same rule applies here.\nThe first valid code wins.";
  });
}
