export const ErrorType = {
  InvalidToken: 1,
  Unauthorized: 2,
  Duplicate: 3,
  InvalidCredentials: 4,
  UnauthorizedGoogle: 5,
  ManagerExist: 6,
  Permission: 7,
  NotFound: 8,
  InvalidData: 9,
};

export class AppError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
    this.name = "AppError"; // Explicit error name for easier identification
  }

  static invalidCredentials() {
    return new AppError(ErrorType.InvalidCredentials, "Invalid email or password.");
  }

  static unauthorized() {
    return new AppError(ErrorType.Unauthorized, "You do not have permission to access this endpoint.");
  }

  static invalid(message) {
    return new AppError(ErrorType.InvalidData, message);
  }

  static permission() {
    return new AppError(ErrorType.Permission, "Permission denied.");
  }

  static notFound(message) {
    return new AppError(ErrorType.NotFound, message);
  }
}
