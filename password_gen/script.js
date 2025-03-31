// Selectarea elementelor DOM
const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const refreshBtn = document.getElementById('refresh-btn');
const generateBtn = document.getElementById('generate-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const decreaseBtn = document.getElementById('decrease-btn');
const increaseBtn = document.getElementById('increase-btn');
const strengthBars = document.querySelectorAll('.bar');
const strengthText = document.querySelector('.strength-text');

// Opțiunile pentru generarea parolei
const options = {
  lowercase: {
    checkbox: document.getElementById('lowercase'),
    chars: 'abcdefghijklmnopqrstuvwxyz',
  },
  uppercase: {
    checkbox: document.getElementById('uppercase'),
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  numbers: {
    checkbox: document.getElementById('numbers'),
    chars: '0123456789',
  },
  symbols: {
    checkbox: document.getElementById('symbols'),
    chars: '!@#$%^&*()_+[]{}|;:,.<>?',
  },
};

// Actualizarea valorii afișate pentru lungimea parolei și a progress bar-ului
const updateLengthAndSlider = () => {
  lengthValue.textContent = lengthSlider.value;
  const progress = ((lengthSlider.value - lengthSlider.min) / (lengthSlider.max - lengthSlider.min)) * 100;
  lengthSlider.style.setProperty('--progress', `${progress}%`);
};

// Generarea unei parole aleatorii
const generatePassword = () => {
  let charset = '';
  let password = '';
  let checkedCount = 0;
  
  // Verifică dacă cel puțin o opțiune este selectată
  for (const key in options) {
    if (options[key].checkbox.checked) {
      charset += options[key].chars;
      checkedCount++;
    }
  }
  
  // Dacă nicio opțiune nu este selectată, selectează automat lowercase
  if (checkedCount === 0) {
    options.lowercase.checkbox.checked = true;
    charset = options.lowercase.chars;
  }
  
  // Generează parola
  const length = parseInt(lengthSlider.value);
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Asigură-te că parola conține cel puțin un caracter din fiecare categorie selectată
  if (checkedCount > 1) {
    let tempPassword = '';
    for (const key in options) {
      if (options[key].checkbox.checked) {
        const randomIndex = Math.floor(Math.random() * options[key].chars.length);
        tempPassword += options[key].chars[randomIndex];
      }
    }
    
    // Adaugă restul caracterelor aleatorii
    for (let i = tempPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      tempPassword += charset[randomIndex];
    }
    
    // Amestecă parola
    password = shuffleString(tempPassword);
  }
  
  return password;
};

// Funcție pentru amestecarea caracterelor dintr-un string
const shuffleString = (str) => {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
};

// Evaluarea puterii parolei
const evaluatePasswordStrength = (password) => {
  // Resetează toate barele
  strengthBars.forEach(bar => {
    bar.className = 'bar';
  });
  
  if (!password) {
    strengthText.textContent = 'N/A';
    return;
  }
  
  // Criterii pentru evaluarea puterii
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
  const criteriaCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  // Calculează scorul
  let strength = 0;
  
  // Lungimea contribuie la scor
  if (length >= 8) strength++;
  if (length >= 12) strength++;
  if (length >= 16) strength++;
  
  // Diversitatea caracterelor contribuie la scor
  strength += criteriaCount - 1;
  
  // Limitează scorul la 4
  strength = Math.min(strength, 4);
  
  // Actualizează barele și textul
  for (let i = 0; i < strength; i++) {
    if (strength === 1) {
      strengthBars[i].classList.add('weak');
    } else if (strength === 2 || strength === 3) {
      strengthBars[i].classList.add('medium');
    } else {
      strengthBars[i].classList.add('strong');
    }
  }
  
  // Actualizează textul
  if (strength === 0 || strength === 1) {
    strengthText.textContent = 'Slabă';
  } else if (strength === 2) {
    strengthText.textContent = 'Medie';
  } else if (strength === 3) {
    strengthText.textContent = 'Bună';
  } else {
    strengthText.textContent = 'Puternică';
  }
};

// Funcție pentru copierea parolei în clipboard
const copyToClipboard = () => {
  passwordField.select();
  document.execCommand('copy');
  
  // Feedback vizual pentru utilizator
  const originalText = copyBtn.innerHTML;
  copyBtn.innerHTML = '<i class="fas fa-check"></i>';
  
  setTimeout(() => {
    copyBtn.innerHTML = originalText;
  }, 1500);
};

// Funcție pentru generarea și afișarea unei noi parole
const updatePassword = () => {
  const password = generatePassword();
  passwordField.value = password;
  evaluatePasswordStrength(password);
};

// Event Listeners
window.addEventListener('load', () => {
  updateLengthAndSlider();
  updatePassword();
});

lengthSlider.addEventListener('input', () => {
  updateLengthAndSlider();
  updatePassword();
});

decreaseBtn.addEventListener('click', () => {
  const currentValue = parseInt(lengthSlider.value);
  if (currentValue > parseInt(lengthSlider.min)) {
    lengthSlider.value = currentValue - 1;
    updateLengthAndSlider();
    updatePassword();
  }
});

increaseBtn.addEventListener('click', () => {
  const currentValue = parseInt(lengthSlider.value);
  if (currentValue < parseInt(lengthSlider.max)) {
    lengthSlider.value = currentValue + 1;
    updateLengthAndSlider();
    updatePassword();
  }
});

copyBtn.addEventListener('click', copyToClipboard);
refreshBtn.addEventListener('click', updatePassword);
generateBtn.addEventListener('click', updatePassword);

// Adaugă event listeners pentru checkbox-uri
for (const key in options) {
  options[key].checkbox.addEventListener('change', () => {
    // Verifică dacă cel puțin o opțiune este selectată
    let checkedCount = 0;
    for (const k in options) {
      if (options[k].checkbox.checked) {
        checkedCount++;
      }
    }
    
    // Dacă utilizatorul încearcă să deselecteze toate opțiunile, păstrează cea curentă selectată
    if (checkedCount === 0) {
      options[key].checkbox.checked = true;
    } else {
      updatePassword();
    }
  });
}