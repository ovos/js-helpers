// there will possibly be `awaited` keyword in Typescript 4.0
// https://github.com/microsoft/TypeScript/pull/35998
type Awaited<T> = T extends Promise<infer U> ? U : T;

interface QueueOptions {
  /**
   * Defines how many "threads" (queued function calls) can be executed in parallel
   *
   * @default 1
   */
  concurrency: number;

  /**
   * Defines queue behavior
   *
   * false - FIFO sequence: new function calls will be added at the end of the queue
   * true - LIFO sequence: new function calls will be prepended at the beginning of the queue
   *
   * @default false
   */
  unshift?: boolean;
}

// @todo typescript method decorators are not supported by this lib yet
// https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md#method-decorators
declare function queueable<Func extends (...args: any[]) => any>(
  func: Func,
  options?: QueueOptions
): (...args: Parameters<Func>) => Promise<Awaited<ReturnType<Func>>>;

export {
  queueable as default,
  queueable,
};
