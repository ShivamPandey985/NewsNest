document.addEventListener('DOMContentLoaded', () => {
  if (!Router.requireOnboarding()) return;

  Navbar.render('');
  Footer.render();

  const nameInput = document.getElementById('settingsNameInput');
  const themeSwitch = document.getElementById('settingsThemeSwitch');
  const saveBtn = document.getElementById('settingsSaveBtn');
  const resetBtn = document.getElementById('settingsResetBtn');

  nameInput.value = Storage.getUserName();
  let currentTheme = Storage.getTheme();
  themeSwitch.classList.toggle('on', currentTheme === 'dark');

  themeSwitch.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeSwitch.classList.toggle('on', currentTheme === 'dark');
    ThemeManager.apply(currentTheme);
  });

  InterestPicker.render('settingsInterestPicker', { selected: Storage.getInterests() });

  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      Toast.error('Name cannot be empty');
      return;
    }
    Storage.setUserName(name);
    Storage.setTheme(currentTheme);

    const selected = InterestPicker.getSelected('settingsInterestPicker');
    if (selected.length === 0) {
      Toast.error('Please select at least one interest');
      return;
    }
    Storage.setInterests(selected);

    Toast.success('Settings saved');
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('This will clear your name, interests, theme and bookmarks. Continue?')) return;
    Storage.clearAll();
    Toast.info('All data cleared. Redirecting...');
    setTimeout(() => {
      window.location.href = 'onboarding.html';
    }, 900);
  });
});
