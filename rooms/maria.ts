const room = document.querySelector<HTMLElement>("#room1");

if (room) {
  room.innerHTML = `
    <h2>Verification Code Room</h2>
    <p>A verification code has been sent.</p>
  `;
}
