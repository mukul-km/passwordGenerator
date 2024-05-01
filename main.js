// Selecting DOM elements
const passwordInput = document.querySelector(".input-box input");
const copyBtn = document.querySelector(".copy-icon");
const passwordStrength = document.querySelector(".password-strength");
const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".slider-value");
const options = document.querySelectorAll(".option input");
const generateBtn = document.querySelector(".generate-btn");

// Characters available for generating passwords
const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: `!@#$%^&*()_+:?,.-`,
};

let length; // Variable to store password length

// Function to set password length and update slider display
function setValue() {
  sliderValue.innerHTML = length = slider.value;

  generatePassword();
}

setValue(); // Run setvalue to set first value

// Function to shuffle characters in a string
function shuffleString(str) {
  let array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

// Function to generate password
function generatePassword() {
  let allowedChars = "";
  let password = "";
  copyBtn.src = "./image/copy.svg";
  let excludeDuplicate = false;

  // Iterating through option checkboxes to determine allowed characters
  options.forEach((option) => {
    if (option.checked) {
      if (option.id === "exclude-duplicate") {
        excludeDuplicate = true;
      } else {
        allowedChars += characters[option.id];
      }
    }
  });

  // Handling cases where no options are selected or not enough characters are selected for password generation
  if (allowedChars.length === 0) {
    return alert(`At least select an option`);
  } else if (allowedChars < length) {
    return alert(
      `At least select one more option to use exclude duplicate or decrease the length of password to ${allowedChars.length} or less`
    );
  } else {
    // Adding at least one character from each selected option
    options.forEach((option) => {
      if (option.checked && !(option.id === "exclude-duplicate")) {
        const randomChar = characters[option.id].charAt(
          Math.floor(Math.random() * characters[option.id].length)
        );
        password += randomChar;
      }
    });

    // Filling remaining length of password with random characters
    for (let i = password.length; i < length; i++) {
      const randomChar =
        allowedChars[Math.floor(Math.random() * allowedChars.length)];
      if (excludeDuplicate) {
        !password.includes(randomChar) ? (password += randomChar) : i--;
      } else {
        password += randomChar;
      }
    }
  }

  // Setting output field value with shuffled password
  passwordInput.value = shuffleString(password);
  checkPasswordStrength();
}

function checkPasswordStrength() {
  let selectedOption = 0;
  let strengthType = "";
  options.forEach((option) => {
    if (option.checked && !(option.id === "exclude-duplicate")) {
      selectedOption++;
    }
  });

  if (selectedOption <= 2) {
    strengthType = length < 8 ? "weak" : length > 16 ? "medium" : "weak";
  } else if (selectedOption == 3) {
    strengthType = length < 8 ? "weak" : length > 16 ? "strong" : "medium";
  } else if (selectedOption == 4) {
    strengthType = length < 6 ? "weak" : length > 10 ? "strong" : "medium";
  }

  if (strengthType === "weak") {
    passwordStrength.innerHTML = `
          <span class="${strengthType}"></span>
          <span></span>
          <span></span>`;
  } else if (strengthType === "medium") {
    passwordStrength.innerHTML = `
          <span class="${strengthType}"></span>
          <span class="${strengthType}"></span>
          <span></span>`;
  } else if (strengthType === "strong") {
    passwordStrength.innerHTML = `
          <span class="${strengthType}"></span>
          <span class="${strengthType}"></span>
          <span class="${strengthType}"></span>`;
  }
}

function copyPassword() {
  navigator.clipboard.writeText(passwordInput.value);
  copyBtn.src = "./image/check.svg";
}

copyBtn.addEventListener("click", copyPassword);
slider.addEventListener("input", setValue);
generateBtn.addEventListener("click", generatePassword);
