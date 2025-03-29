export interface APIResponse<T> {
  code: number;
  message: string;
  status: string;
  response: T;
}
