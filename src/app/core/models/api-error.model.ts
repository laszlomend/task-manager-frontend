export interface ApiErrorResponse {
  error: string;
}

export interface ApiValidationErrorResponse {
  error: string;
  details: Array<{ field: string; message: string }>;
}
