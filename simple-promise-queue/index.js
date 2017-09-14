function handleDescriptor(target, name, descriptor, [{ concurrency = 1 } = {}] = []) {
  const fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new SyntaxError('Only functions can be made queueable');
  }

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

  return {
    ...descriptor,
    value(...params) {
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
    }
  };
}

export default function queueable(...args) {
  return handleDescriptor(...args);
}
