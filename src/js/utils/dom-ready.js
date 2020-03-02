export function domReady(fn) {
  //See if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    //Call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
