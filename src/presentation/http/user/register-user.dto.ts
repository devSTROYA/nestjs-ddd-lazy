export class RegisterUserRequest {
  name!: string;
  email!: string;
  password!: string;
}

export class RegisterUserResponse {
  accessToken!: string;
}
