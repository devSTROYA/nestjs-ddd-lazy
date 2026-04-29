import { commands } from '@application/user/commands';
import { queries } from '@application/user/queries';
import { UserRepository } from '@domain/user';
import { InMemoryUserRepository } from '@infrastructure/user';
import { Module } from '@nestjs/common';
import { AuthController } from '@presentation/http/user';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
    ...commands,
    ...queries,
  ],
})
export class UserModule {}
