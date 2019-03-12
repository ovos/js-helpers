import regeneratorRuntime from "regenerator-runtime/runtime";

function createQueue(fn, options = { concurrency: 1, unshift: false }) {
  let active = 0;
  let queue = [];

  const { concurrency, unshift } = options;

  async function exec(...params) {
    active++;
    let res;
    let isError = false;

    try {
      res = await fn.apply(this, params);
    } catch (err) {
      // we catch and save the error
      // this allows us to throw it after we continued execution of our queue
      isError = err;
    }

    active--;

    if (queue.length && active < concurrency) {
      const next = queue.shift();
      exec.apply(this, next.params)
        .then(next.resolve)
        .catch(next.reject);
    }

    if (isError) {
      throw isError;
    }

    return res;
  }

  function handleCall(...params) {
    if (active < concurrency) {
      return exec.apply(this, params);
    }
    return new Promise((resolve, reject) => {
      if (unshift) {
        queue.unshift({
          resolve,
          reject,
          params
        });
      } else {
        queue.push({
          resolve,
          reject,
          params
        });
      }
    });
  };

  handleCall.stop = function (ids = null) {
    if (ids) {
      queue = queue.filter(item => ids.findIndex(id => id !== item.params[0].id) > -1);  // use the ids param for filtering the queue
    } else {
      active = 0;
      queue = [];  // remove all items in the queue
    }
  }

  return handleCall;
}

function handleDescriptor(decorator, ...options) {
  if (typeof decorator !== 'object') {
    throw new SyntaxError('invalid descriptor received');
  }

  const fn = decorator.descriptor.value;
  if (typeof fn !== 'function') {
    throw new SyntaxError('Only functions can be made queueable');
  }

  const queue = createQueue(fn, ...options);

  return {
    ...decorator,
    value: queue
  };
}

export default function queueable(arg, opts) {
  if (typeof arg === 'function') {
    return createQueue.apply(this, [arg, opts]);
  }

  return handleDescriptor(arg);
}

export {
  queueable
}