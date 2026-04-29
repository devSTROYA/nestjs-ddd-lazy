export class ValidationError {
  constructor(
    readonly code: string,
    readonly details?: Record<string, unknown>,
  ) {}
}
