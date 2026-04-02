// Navigator Locks shim — avoids NavigatorLockAcquireTimeoutError from Supabase JS
// when locks cannot be acquired (e.g., multiple tabs, cross-origin iframes).
(function () {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.locks &&
      typeof navigator.locks.request === 'function'
    ) {
      try {
        const origRequest = navigator.locks.request.bind(navigator.locks);
        navigator.locks.request = function (name, options, callback) {
          try {
            const maybeCallback = typeof options === 'function' ? options : callback;
            return origRequest(name, options, callback).catch(function () {
              try {
                return Promise.resolve(maybeCallback());
              } catch (e) {
                return Promise.reject(e);
              }
            });
          } catch (e) {
            try {
              const cb = typeof options === 'function' ? options : callback;
              return Promise.resolve(cb());
            } catch (err) {
              return Promise.reject(err);
            }
          }
        };
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    // ignore shim errors
  }
})();
