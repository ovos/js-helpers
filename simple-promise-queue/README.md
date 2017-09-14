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
@queuable({ concurrency: 1 }) async function() {
  return request(...);
}
```

## Maintainers

[@flipace](https://github.com/flipace), [@mh-ovos](https://github.com/mh-ovos)

ovos media gmbh, [@ovos](https://github.com/ovos), [Visit us!](https://ovos.at)

## License

MIT