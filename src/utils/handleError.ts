export function handleError<T>(promise: Promise<T>) {
  return promise
    .then<[T, null]>((data) => [data, null])
    .catch<[null, unknown]>((err) => [null, err]);
}