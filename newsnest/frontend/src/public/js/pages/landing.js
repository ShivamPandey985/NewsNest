document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();

  const goToApp = () => {
    window.location.href = Storage.isOnboarded() ? 'home.html' : 'onboarding.html';
  };
  document.querySelectorAll('#landingCta, #landingCtaNav').forEach((btn) => {
    btn.addEventListener('click', goToApp);
  });

  const secondaryCta = document.getElementById('landingSecondaryCta');
  if (secondaryCta) {
    secondaryCta.addEventListener('click', () => {
      window.location.href = 'about.html';
    });
  }
});
