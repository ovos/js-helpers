function createQueue(fn, options = { concurrency: 1 }) {
  let active = 0;
  let queue = [];

  const { concurrency } = options;

  async function exec(...params) {
    active++;
    const res = await fn.apply(this, params);
    active--;

    if (queue.length && active < concurrency) {
      const next = queue.shift();
      exec.apply(this, next.params)
        .then(next.resolve)
        .catch(next.reject);
    }

    return res;
  }

  function handleCall(...params) {
    if (active < concurrency) {
      return exec.apply(this, params);
    }
    return new Promise((resolve, reject) => {
      queue.push({
        resolve,
        reject,
        params
      });
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

function handleDescriptor(target, name, descriptor, ...options) {
  if (typeof descriptor === 'undefined') {
    throw new SyntaxError('queueable decorator can\'t be used with parameters. Wrap your function instead.');
  }

  const fn = descriptor.value;
  if (typeof fn !== 'function') {
    throw new SyntaxError('Only functions can be made queueable');
  }

  const queue = createQueue(fn, ...options);

  return {
    ...descriptor,
    value: queue
  };
}

export default function queueable(...args) {
  if (typeof args[0] === 'function') {
    return createQueue.apply(this, args);
  }
  return handleDescriptor(...args);
}

export {
  queueable
}