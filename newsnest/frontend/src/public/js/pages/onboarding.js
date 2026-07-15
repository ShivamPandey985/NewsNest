document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();

  let step = 1;
  const totalSteps = 3;
  const steps = document.querySelectorAll('.onboard-step');
  const progressFill = document.getElementById('progressFill');
  const stepLabel = document.getElementById('stepLabel');

  const nameInput = document.getElementById('userNameInput');
  const themeButtons = document.querySelectorAll('[data-theme-choice]');
  let chosenTheme = Storage.getTheme();

  function updateThemeButtons() {
    themeButtons.forEach((btn) => {
      btn.classList.toggle('selected', btn.getAttribute('data-theme-choice') === chosenTheme);
    });
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chosenTheme = btn.getAttribute('data-theme-choice');
      ThemeManager.apply(chosenTheme);
      updateThemeButtons();
    });
  });
  updateThemeButtons();

  InterestPicker.render('interestPickerContainer');

  function showStep(n) {
    steps.forEach((el) => el.classList.toggle('active', Number(el.dataset.step) === n));
    progressFill.style.width = `${(n / totalSteps) * 100}%`;
    stepLabel.textContent = `Step ${n} of ${totalSteps}`;
  }

  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (step === 1) {
        const name = nameInput.value.trim();
        if (!name) {
          Toast.error('Please enter your name to continue');
          return;
        }
        Storage.setUserName(name);
      }
      if (step === 2) {
        const selected = InterestPicker.getSelected('interestPickerContainer');
        if (selected.length === 0) {
          Toast.error('Please select at least one interest');
          return;
        }
        Storage.setInterests(selected);
      }
      step = Math.min(step + 1, totalSteps);
      showStep(step);
    });
  });

  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      step = Math.max(step - 1, 1);
      showStep(step);
    });
  });

  const finishBtn = document.getElementById('finishOnboarding');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      Storage.setTheme(chosenTheme);
      Storage.setOnboarded(true);
      Toast.success(`Welcome to NewsNest, ${Storage.getUserName()}!`);
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 600);
    });
  }

  showStep(step);
});
