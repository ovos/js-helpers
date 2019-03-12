import regeneratorRuntime from "regenerator-runtime/runtime";

import queueable from './index';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep(fn, ms = 100) {
  return timeout(ms).then(fn).catch(console.error);
}

async function add(n = 0, target = [], latency = 250) {
  await timeout(latency);
  return [...target, n];
}

jest.setTimeout(5000);

let target = [];
let executions = 0;
let counter = 0;
let promises = [];

const doSth = async () => {
  executions++;
  let x = counter;
  counter++;
  await timeout(100);
  target.push(x);
}

test('returns a function', async () => {  
  const qadd = queueable(add);
  expect(typeof qadd).toBe('function');
});

test('queues execution of promises', async () => {
  counter = 0;
  executions = 0;
  promises = [];
  target = [];

  const qDoSth = queueable(doSth);

  for (let i = 0; i < 10; i++) {
    promises.push(qDoSth());
  }

  await Promise.all(promises);

  const res = target.join(',');

  // if the execution would not be queued, the result would be
  // 0,0,0,0,0,0,0,0,0,0
  expect(res).toBe('0,1,2,3,4,5,6,7,8,9');
})

test('handles concurrency of promises', async () => {
  counter = 0;
  executions = 0;
  promises = [];
  target = [];

  const qDoSth = queueable(doSth, {  concurrency: 5 });

  for (let i = 0; i < 10; i++) {
    promises.push(qDoSth());
  }

  const t = Date.now();
  await Promise.all(promises);
  const duration = Date.now() - t;

  const res = target.join(',');

  // when running 5 qDoSth in parallel, they resolve within ~100m
  // therefor when we fire 10 calls, they should be done within
  // ~200ms
  expect(duration >= 200).toBe(true);
  expect(duration <= 330).toBe(true);
})

test('can be used as decorator', async () => {
  counter = 0;
  executions = 0;
  promises = [];
  target = [];

  class Demo {
    @queueable
    async d(...params) {
      return doSth(...params);
    }
  }

  const d = new Demo();

  for (let i = 0; i < 10; i++) {
    promises.push(d.d());
  }

  const t = Date.now();
  await Promise.all(promises);
  const duration = Date.now() - t;

  const res = target.join(',');

  expect(res).toBe('0,1,2,3,4,5,6,7,8,9');
})

test('throws when decorator is used with options', async () => {
  expect(() => {
    class Demo {
      @queueable(5)
      async d(...params) {
        return doSth(...params);
      }
    }

    const d = new Demo();
  }).toThrow();
})

test('continues queue even when errors are thrown', async () => {
  let counter = 0;

  function illThrow() {
    counter += 1;
    throw new Error(1);
  }

  const queuedThrower = queuable(illThrow, { concurrency: 1 });

  const amount = 3;

  for (let i = 0; i < amount; i++) {
    try {
      await queuedThrower();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  }

  expect(counter).toBe(amount);
})