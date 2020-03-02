export const toggleActiveClick = () => {
  const triggers = document.querySelectorAll('.js-active-click');
  if (triggers.length < 1) return;
  [...triggers].forEach(trigger => {
    trigger.addEventListener('click', e => {
      trigger.classList.toggle('active');
    });
  });
};
