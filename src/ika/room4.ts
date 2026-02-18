const passwordInput = document.getElementById('password-input') as HTMLInputElement;
const submitButton = document.getElementById('room4-submit') as HTMLButtonElement;
const requirementsList = document.getElementById('requirements-list') as HTMLUListElement;
const messageElement = document.getElementById('room4-message') as HTMLParagraphElement;

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    console.log(value);
});