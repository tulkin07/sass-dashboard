type ApiError = {
  message?: string;
  status?: number;
};

export function getApiErrorMessage(
  error: unknown,
  labels: {
    defaultMessage: string;
    networkMessage: string;
  }
): string {
  if (!error || typeof error !== "object") {
    return labels.defaultMessage;
  }

  const apiError = error as ApiError;

  if (apiError.status === 0) {
    return labels.networkMessage;
  }

  return apiError.message || labels.defaultMessage;
}
