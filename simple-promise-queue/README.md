[![npm (scoped)](https://img.shields.io/npm/v/@ovos-media/simple-promise-queue.svg)](https://www.npmjs.com/package/@ovos-media/simple-promise-queue)
[![Travis branch](https://img.shields.io/travis/ovos/js-helpers/master.svg)](https://travis-ci.org/ovos/js-helpers)
# simple-promise-queue

easily make your async functions queueable!

```js
import queueable from '@ovos-media/simple-promise-queue';

// just wrap your function to control execution sequence!
const queueableAsyncFunction = queueable(
  asyncFunction, 
  { concurrency: 1 }
);

// or as a decorator!
@queueable async function() {
  return request(...);
}
```

## Maintainers

[@flipace](https://github.com/flipace), [@mh-ovos](https://github.com/mh-ovos)

ovos media gmbh, [@ovos](https://github.com/ovos), [Visit us!](https://ovos.at)

## License

MIT