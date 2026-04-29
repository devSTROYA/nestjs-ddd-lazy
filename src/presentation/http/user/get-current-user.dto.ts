export class UserDto {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
}

export class GetCurrentUserRequest {}

export class GetCurrentUserResponse {
  data!: UserDto;
}
