export function isPromise<T>(
  maybePromise: Promise<T> | unknown,
): maybePromise is Promise<T> {
  return (
    typeof maybePromise === 'object' &&
    maybePromise !== null &&
    typeof (maybePromise as { then: unknown }).then === 'function'
  );
}
