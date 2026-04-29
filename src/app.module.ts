import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo.module';
import { UserModule } from './user.module';

const currentEnv = process.env.NODE_ENV || 'development';
let envFilePath: string | undefined;
switch (currentEnv) {
  case 'development':
    envFilePath = '.env.development.local';
    break;
  case 'production':
    envFilePath = '.env.production.local';
    break;
  default:
    envFilePath = undefined;
    break;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    CqrsModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),

    TodoModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
