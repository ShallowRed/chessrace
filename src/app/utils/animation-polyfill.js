/**
 * requestAnimationFrame() polyfill
 * By Erik Möller. Fixes from Paul Irish and Tino Zijdel.
 * @link http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @link http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * @license MIT
 */

(() => {

  const vendors = ['ms', 'moz', 'webkit', 'o'];

  for (const vendor of vendors) {

    window.requestAnimationFrame =
      window[`${vendor}RequestAnimationFrame`];

    window.cancelAnimationFrame =
      window[`${vendor}CancelAnimationFrame`] ||
      window[`${vendor}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {

    let lastTime = 0;

    window.requestAnimationFrame = callback => {

      const currTime = new Date()
        .getTime();

      const timeToCall = Math.max(0, 16 - (currTime - lastTime));

      const id = window.setTimeout(() => {

        callback(currTime + timeToCall);

      }, timeToCall);

      lastTime = currTime + timeToCall;

      return id;
    };
  }

  if (!window.cancelAnimationFrame) {

    window.cancelAnimationFrame = id => {

      clearTimeout(id);
    };
  }

})();
