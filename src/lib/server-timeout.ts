const DEFAULT_TIMEOUT_MESSAGE = "Request timed out";

export async function withServerTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number,
  timeoutMessage = DEFAULT_TIMEOUT_MESSAGE
) {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error(timeoutMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}
