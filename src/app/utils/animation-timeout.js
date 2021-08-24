 export function animationTimeout(callback, delay, start = Date.now()) {
   const delta = (Date.now() - start) / 1000;
   if (delta >= delay) {
     callback();
     return;
   }

   window.requestAnimationFrame(() =>
     animationTimeout(callback, delay, start)
   );
 }
