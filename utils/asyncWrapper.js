const asyncWrapper = (promise) =>
  promise.then((data) => [undefined, data]).catch((error) => [error]);

export default asyncWrapper;
