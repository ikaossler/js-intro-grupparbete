export function initMariaRoom(room: HTMLElement): void {
  room.innerHTML = `
    <h2 id="room1-title">Verification Code</h2>
    <p>A verification code has been sent.</p>
    <p>Enter your verification code to escape.</p>

    <button id="resend-btn" type="button">Resend</button>

    <p>
      Code:
      <span id="flash-code" aria-live="polite">------</span>
    </p>

    <label for="code-input">Verification code</label>
    <input
      id="code-input"
      name="code-input"
      type="text"
      maxlength="6"
      autocomplete="one-time-code"
    />

    <button id="check-btn" type="button">Verify</button>
    <p id="room1-message" aria-live="polite"></p>
  `;

  const resendButton = room.querySelector<HTMLButtonElement>("#resend-btn");
  const flashCode = room.querySelector<HTMLElement>("#flash-code");
  const codeInput = room.querySelector<HTMLInputElement>("#code-input");
  const checkButton = room.querySelector<HTMLButtonElement>("#check-btn");
  const message = room.querySelector<HTMLElement>("#room1-message");

  if (!resendButton || !flashCode || !codeInput || !checkButton || !message) return;

  let latestCode = "";
  let previousCode = "";
  let failedAttempts = 0;

  function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  resendButton.addEventListener("click", () => {
    previousCode = latestCode;
    latestCode = generateCode();

    flashCode.textContent = latestCode;
    setTimeout(() => {
      flashCode.textContent = "------";
    }, 500);
  });

  checkButton.addEventListener("click", () => {
    const userValue = codeInput.value.trim();

    if (!previousCode) {
      message.textContent = "Invalid code.";
      return;
    }

    if (userValue === previousCode) {
      message.textContent = "Access granted. Door unlocked.";
      return;
    }

    failedAttempts += 1;
    if (failedAttempts >= 2) {
      message.textContent = "Invalid code. Hint: format or timing might matter.";
    } else {
      message.textContent = "Invalid code.";
    }
  });
}
