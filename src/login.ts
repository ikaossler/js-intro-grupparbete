/*****************************************************/
/********************* IMPORT ************************/
/*****************************************************/

import "./login.css";

/*****************************************************/
/********************* LOGG IN************************/
/*****************************************************/

const STORAGE_KEY = "game_users";
const SESSION_KEY = "game_current_user";

/*****************************************************/
/********************* TYPES *************************/
/*****************************************************/

interface IUser {
    id: string;
    username: string;
    createdAt: string;
}

interface IResult {
    success: boolean;
    user?: IUser;
    error?: string;
}

/*****************************************************/
/********************* HELPERS ***********************/
/*****************************************************/

// Skapar ett unikt ID genom att kombinera tidsstämpel och en slumpmässig sträng.
function generateId(): string {
    const timePart = Date.now().toString(36);
    const randomPart = Math.random().toString(36).slice(2, 7);
    return timePart + randomPart;
}

// Hämtar användare från localStorage, eller returnerar en tom array om ingen finns.
function getAllUsers(): Record<string, IUser> {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return {};
    }

    return JSON.parse(savedData);
}

// Sparar alla användare i localStorage
function saveAllUsers(users: Record<string, IUser>): void {
    const usersAsText = JSON.stringify(users);
    localStorage.setItem(STORAGE_KEY, usersAsText);
}

/*****************************************************/
/******************** VALIDATOR **********************/
/*****************************************************/

// Kontrollerar att användarnamnet uppfyller kraven
function validateUsername(username: string): string {
    if (username.trim().length < 2) {
        return "Username need's to be at least 2 caracters.";
    }

    if (username.trim().length > 20) {
        return "Username can´t be longer then 20 caracters.";
    }

    const allowedChars = /^[a-zA-Z0-9_-]+$/;
    if (allowedChars.test(username) === false) {
        return "Username can only contain letters, numbers, hyphens and underscore.";
    }

    return "";
}

/*****************************************************/
/****************** WHO IS LOGGED IN *****************/
/*****************************************************/

// Sparar information om vem som är inloggad
function saveSession(user: IUser): void {
    const sessionData = JSON.stringify({ id: user.id});
    localStorage.setItem(SESSION_KEY, sessionData);
}

// Hämtar information om vem som är inloggad
function getLoggedInUser(): IUser | null {
    const savedSession = localStorage.getItem(SESSION_KEY);

    if (savedSession === null) {
        return null;
    }

    const session = JSON.parse(savedSession);
    const allUsers = getAllUsers();

    if (allUsers[session.id] === undefined) {
        return null;
    }

    return allUsers[session.id];
}

// Retunerar true om en användare är inloggad, annars false
function isLoggedIn(): boolean {
    const user = getLoggedInUser();
    return user !== null;
}

/*****************************************************/
/******************** MAIN LOGIC **********************/
/*****************************************************/

// Registrerar en ny användare
function register(username: string): IResult {
    const usernameError = validateUsername(username);
    if (usernameError !== "") {
        return { success: false, error: usernameError };
    }

    // Kontrollerar om användarnamnet redan finns
    const allUsers = getAllUsers();
    const allUserList = Object.values(allUsers);

    for (let i = 0; i < allUserList.length; i++) {
        const currentUser = allUserList[i];
        const takenName = currentUser.username.toLowerCase();
        const inputName = username.toLowerCase();

        if (takenName === inputName) {
            return { success: false, error: "The username is aldredy taken." };
        }
    }

    // Skapar en ny användare
    const newUser: IUser = {
        id: generateId(),
        username: username.trim(),
        createdAt: new Date().toISOString()
    };

    // Sparar den nya användaren
    allUsers[newUser.id] = newUser;
    saveAllUsers(allUsers);
    saveSession(newUser);

    return { success: true, user: newUser };
}

// Loggar in en befintlig användare
function login(username: string): IResult {
    const allUsers = getAllUsers();
    const allUserList = Object.values(allUsers);

    for (let i = 0; i < allUserList.length; i++) {
        const currentUser = allUserList[i];
        const storedName = currentUser.username.toLowerCase();
        const inputName = username.toLowerCase();

        if (storedName === inputName) {
            saveSession(currentUser);
            return { success: true, user: currentUser };
        }
    }

    return { success: false, error: "Username not found. Please register first." };
}

// Loggar ut en befintlig användare
function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}

/*****************************************************/
/*************** ELEMENTS FROM HTML ******************/
/*****************************************************/

/******** Open Modal ********/
const loginBtn = document.querySelector("#login-btn") as HTMLButtonElement;
const modal = document.querySelector("#auth-modal") as HTMLDivElement;

loginBtn.addEventListener("click", openModal);

export function openModal(): void {
    modal.classList.add("open");
}

/******** Close Modal ********/
const modalCloseBtn = document.querySelector("#modal-close-btn") as HTMLButtonElement;

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", function (event: MouseEvent): void {
    if (event.target === modal) {
        closeModal();
    }
});

function closeModal(): void {
    modal.classList.remove("open");
}

/******** Login / Register ********/
const modalTabs = document.querySelectorAll<HTMLButtonElement>(".modal-tab");
const modalForms = document.querySelectorAll<HTMLDivElement>(".modal-form");

modalTabs.forEach(function (tab: HTMLButtonElement): void {
    tab.addEventListener("click", function (): void {
        switchTab(tab);
    });
});

function switchTab(tab: HTMLButtonElement): void {
    modalTabs.forEach(function (t: HTMLButtonElement): void {
        t.classList.remove("active");
    });

    modalForms.forEach(function (f: HTMLDivElement): void {
        f.classList.remove("active");
    });

    tab.classList.add("active");
    const formId : string = "#modal-" + tab.dataset.tab;
    const activeForm = document.querySelector(formId) as HTMLDivElement;
    activeForm.classList.add("active");
}

/******** Function for wrong or confirm ********/
function showMessage(element: HTMLParagraphElement, text: string, type: string): void {
    element.textContent = text;
    element.className = "modal-message " + type;
}

/******** Register ********/
const registerUsernameInput = document.querySelector("#register-username") as HTMLInputElement;
const modalRegisterBtn = document.querySelector("#modal-register-btn") as HTMLButtonElement;
const registerMessage = document.querySelector("#register-message") as HTMLParagraphElement;

modalRegisterBtn.addEventListener("click", handleRegister);

function handleRegister(): void {
    const username = registerUsernameInput.value;
    const result = register(username);

    if (result.success && result.user) {
        showMessage(registerMessage, "Registration was successful! You are now logged in.", "success");
        setTimeout(() => {
            closeModal();
            updateUserDisplay(); //Ika
        }, 2000);
    } else {
        showMessage(registerMessage, result.error || "An error occurred during registration.", "error");
    }
}

/******** Log in ********/
const loginUsernameInput = document.querySelector("#login-username") as HTMLInputElement;
const modalLoginBtn = document.querySelector("#modal-login-btn") as HTMLButtonElement;
const loginMessage = document.querySelector("#login-message") as HTMLParagraphElement;

modalLoginBtn.addEventListener("click", handleLogin);

function handleLogin(): void {
    const username: string = loginUsernameInput.value;
    const result = login(username);

    if (result.success && result.user) {
        showMessage(loginMessage, "Login successful! Welcome back, " + result.user.username + ".", "success");
        setTimeout(() => {
            closeModal();
              updateUserDisplay()
        }, 2000);
    } else {
        showMessage(loginMessage, result.error || "An error occurred during login.", "error");
    }
}

/******** Enter key ********/
document.addEventListener("keydown", handleEnterKey);
function handleEnterKey(e: KeyboardEvent): void {
    if (e.key !== "Enter") return;

    const activeForm = document.querySelector<HTMLDivElement>(".modal-form.active");
    if (activeForm !== null && activeForm.id === "modal-register") modalRegisterBtn.click();
    if (activeForm !== null && activeForm.id === "modal-login") modalLoginBtn.click();
}


/*****************************************************/
/******* FÖR ATT NAMNET SKA SYNAS EFTER LOG IN *******/
/*****************************************************/

//Uppdaterar headern med inloggat användarnamn.
//Används på tre ställen: vid login, registrering och när sidan laddas.
export function updateUserDisplay(): void {
  const display = document.querySelector("#logged-in-user") as HTMLSpanElement;
  if (!display) return;
  
  const user = getLoggedInUser(); // Hämtar inloggad användare från localStorage
  display.textContent = user ? `👤 ${user.username}` : ""; // Visar namn eller ingenting
}


/*****************************************************/
/********************* EXPORTS ***********************/
/*****************************************************/

export {
    register,
    login,
    logout,
    getLoggedInUser,
    isLoggedIn
};

export type { IUser, IResult };