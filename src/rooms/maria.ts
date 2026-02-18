export function initMariaRoom(room: HTMLElement): void {
  room.innerHTML = `
    <h2 id="room1-title">Verification Code</h2>
    <p>A verification code has been sent.</p>

    <button id="resend-btn" type="button">Resend?</button>

    <p>
      Code:
      <span id="flash-code" aria-live="polite">------</span>
    </p>

    <label for="code-input">Enter code</label>
    <input
      id="code-input"
      name="code-input"
      type="text"
      maxlength="6"
      autocomplete="one-time-code"
    />

    <button id="check-btn" type="button">Check</button>
    <p id="room1-message" aria-live="polite"></p>
  `;
}
