[![npm (scoped)](https://img.shields.io/npm/v/@ovos-media/simple-promise-queue.svg)]()
[![Travis branch](https://img.shields.io/travis/ovos/js-helpers/master.svg)]()
# simple-promise-queue

easily make your async functions queuable!

```js
import queuable from '@ovos-media/simple-promise-queue';

// just wrap your function to control execution sequence!
const queueableAsyncFunction = queuable(
  asyncFunction, 
  { concurrency: 1 }
);

// or as a decorator!
@queuable async function() {
  return request(...);
}
```

## Maintainers

[@flipace](https://github.com/flipace), [@mh-ovos](https://github.com/mh-ovos)

ovos media gmbh, [@ovos](https://github.com/ovos), [Visit us!](https://ovos.at)

## License

MIT