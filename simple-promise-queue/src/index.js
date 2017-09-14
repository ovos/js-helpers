function createQueue(fn, concurrency = 1) {
  let active = 0;
  const queue = [];

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

  return function handleCall(...params) {
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
}

function handleDescriptor(target, name, descriptor, options = []) {
  const fn = descriptor.value;
  if (typeof fn !== 'function') {
    throw new SyntaxError('Only functions can be made queueable');
  }

  const [{ concurrency = 1 } = {}] = options;
  const queue = createQueue(fn, concurrency);

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