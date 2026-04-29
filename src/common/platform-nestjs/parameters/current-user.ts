import { USER_CONTEXT_KEY, UserContext } from '@common/types';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';

export const CurrentUser = createParamDecorator<never, UserContext>((_data, _ctx) => {
  const clsService = ClsServiceManager.getClsService();
  const user = clsService.get(USER_CONTEXT_KEY);
  if (!user) {
    throw new UnauthorizedException('UNAUTHORIZED');
  }

  return user;
});
