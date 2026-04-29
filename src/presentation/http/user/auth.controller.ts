import { RegisterUser } from '@application/user/commands';
import { GetCurrentUser } from '@application/user/queries';
import { AuthGuard, CurrentUser } from '@common/platform-nestjs';
import { type UserContext } from '@common/types';
import { DomainError, NotFoundError, ValidationError } from '@core/errors';
import { match } from '@core/functional-programming';
import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCurrentUserResponse } from './get-current-user.dto';
import { RegisterUserRequest, RegisterUserResponse } from './register-user.dto';
import { UserMap } from './user.map';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async registerUser(@Body() body: RegisterUserRequest): Promise<RegisterUserResponse> {
    const command = new RegisterUser.Command(body.name, body.email, body.password);
    const result = await this.commandBus.execute(command);
    return match.fromResult(result, {
      Ok: (user) => user,
      Err: (error) => {
        if (error instanceof ValidationError) {
          throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
        }

        if (error instanceof DomainError) {
          throw new HttpException(error.code, HttpStatus.CONFLICT);
        }

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('info')
  async getCurrentUser(@CurrentUser() user: UserContext): Promise<GetCurrentUserResponse> {
    const query = new GetCurrentUser.Query(user.id);
    const result = await this.queryBus.execute(query);
    return match.fromResult(result, {
      Ok: (user) => ({ data: UserMap.toDto(user) }),
      Err: (error) => {
        if (error instanceof ValidationError) {
          throw new HttpException(error.code, HttpStatus.BAD_REQUEST);
        }

        if (error instanceof NotFoundError) {
          throw new HttpException(error.code, HttpStatus.NOT_FOUND);
        }

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      },
    });
  }
}
