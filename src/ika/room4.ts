//import './room4.css';

const passwordInput = document.getElementById('password-input') as HTMLInputElement;
const submitButton = document.getElementById('room4-submit') as HTMLButtonElement;
const showRequirementsBtn = document.getElementById('show-requirements-btn') as HTMLButtonElement; 
const requirementsList = document.getElementById('requirements-list') as HTMLUListElement;
const messageElement = document.getElementById('room4-message') as HTMLParagraphElement;

// Dagens datum
const todaysDate = new Date().getDate();

// Lösenordskrav
const requirements = [
  { id: 1, text: "Must be exactly 12 characters", check: (pw: string) => pw.length === 12 },
  { id: 2, text: "Must start with a capital letter", check: (pw: string) => /^[A-Z]/.test(pw) },
{ id: 3, text: "Must contain at least one number", check: (pw: string) => /[0-9]/.test(pw) },
 { id: 4, text: "Must contain today's date", check: (pw: string) => pw.includes(String(todaysDate)) },
  { id: 5, text: "Must contain at least one special character (!@#$...)", check: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  { id: 6, text: "You must ask nicely", check: (pw: string) => pw.toLowerCase().includes("please") },
];

// Funktion för att displaya kraven
function displayRequirements() {
  requirementsList.innerHTML = ''; 
  requirementsList.style.display = "block"; // Visa listan
  
  requirements.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req.text;
    li.id = `req-${req.id}`;
    requirementsList.appendChild(li);
  });

  // göm kraven efter 5 sec
  setTimeout(() => {
    requirementsList.style.display = "none";
  }, 5000)
} 

showRequirementsBtn.addEventListener("click", () => {
  displayRequirements();
});

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
});
submitButton.addEventListener("click", () => {
    const password = passwordInput.value;

    //chacka alla krav
    const allPassed = requirements.every(req => req.check(password));

    if (allPassed) {
        messageElement.textContent = "✅ SUCCESS! Password accepted!";
        messageElement.style.color = 'green';
        //TODO: Gå vidare till nästa del/rum
    } else {
        messageElement.textContent = "❌ ERROR: Password does not meet all requirements";
        messageElement.style.color = 'red';

        passwordInput.value = '';

        setTimeout(() => {
        messageElement.textContent = ''; // ← LÄGG TILL DENNA RAD
        displayRequirements();
    }, 3000);
}

        //vänta i 1 sekunder, sen visas kraven igen
        setTimeout(() => {
            displayRequirements();
        }, 3000); //1000ms = 1 sekund
    }
    );


