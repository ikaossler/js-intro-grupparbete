import "./room4.css";
import { stopTotalTimer, showResults, addScore, getTotalTime } from '../main';

const passwordInput = document.getElementById("password-input") as HTMLInputElement;
const submitButton = document.getElementById("room4-submit") as HTMLButtonElement;
const showRequirementsBtn = document.querySelector(".room4 .show-requirements-btn") as HTMLButtonElement;
const requirementsList = document.getElementById("requirements-list") as HTMLUListElement;
const messageElement = document.getElementById("room4-message") as HTMLParagraphElement;
const timerElement = document.getElementById("room4-timer") as HTMLDivElement;
const errorSound = new Audio('src/sounds/error.mp3');

// Dagens datum
const todaysDate = new Date().getDate();

// Lösenordskrav
const requirements = [
  { id: 1, text: "Must be exactly 12 characters", check: (pw: string) => pw.length === 12 },
  { id: 2, text: "Must start with a capital letter", check: (pw: string) => /^[A-Z]/.test(pw) },
  { id: 3, text: "Must contain at least one number", check: (pw: string) => /[0-9]/.test(pw) },
  {
    id: 4,
    text: "Must contain today's date",
    check: (pw: string) => pw.includes(String(todaysDate)),
  },
  {
    id: 5,
    text: "Must contain at least one special character (!@#$...)",
    check: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
  {
    id: 6,
    text: "You must ask nicely",
    check: (pw: string) => pw.toLowerCase().includes("please"),
  },
];

//Timer
let startTime = 0;
let timerInterval: number | null = null;

function startRoom4Timer() {
  const TOTAL_SECONDS = 60; 
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = TOTAL_SECONDS - elapsedTime;
  
    if (remainingTime <= 0) {
      timerElement.textContent = 'Time: 0:00';
      stopRoom4Timer();
      
      messageElement.textContent = "⏰ TIME'S UP! Starting over...";
      messageElement.style.color = 'red';
      
      // Ladda om sidan (tillbaka till start) efter 2 sekunder
      setTimeout(() => {
        location.reload();
      }, 2000);
      
      return;
    }
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function stopRoom4Timer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Funktion för att displaya kraven
function displayRequirements() {
  requirementsList.innerHTML = "";
  requirementsList.style.display = "block"; // Visa listan

  requirements.forEach((req) => {
    const li = document.createElement("li");
    li.textContent = req.text;
    li.id = `req-${req.id}`;
    requirementsList.appendChild(li);
  });

  // göm kraven efter 5 sec
  setTimeout(() => {
    requirementsList.style.display = "none";
  }, 5000);
}

showRequirementsBtn.addEventListener("click", () => {
  displayRequirements();
  startRoom4Timer();

  //Visa input-rutan och Submit-knappen efter att man klickat på show requrements-knappen
  passwordInput.style.display = "block";
  submitButton.style.display = "block";

  //Dölj show requirements-knappen
  showRequirementsBtn.style.display = "none";
});

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
});
submitButton.addEventListener("click", () => {
  const password = passwordInput.value;

  //checka alla krav
  const allPassed = requirements.every((req) => req.check(password));

  if (allPassed) {
    stopRoom4Timer();
    stopTotalTimer();
    messageElement.textContent = "✅ SUCCESS! Password accepted!";
    messageElement.style.color = "green";
    //TODO: Gå vidare till nästa del/rum

    //visa results efter 2 sekunder
    setTimeout(() => {
    addScore("TestPlayer", getTotalTime()); // TEMPORÄRT: Hårdkodat namn för test - koppla till login senare
      showResults();
    }, 2000);
  } else {
    errorSound.play()
    messageElement.textContent = "❌ ERROR: Password does not meet all requirements";
    messageElement.style.color = "red";

    passwordInput.value = "";

    setTimeout(() => {
      messageElement.textContent = "";
      displayRequirements();
    }, 3000);
  }
});
