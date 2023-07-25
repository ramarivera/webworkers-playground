export function isDefined<T>(
  value: T | undefined | null,
  errorMessage: string,
): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(errorMessage);
  }
}
