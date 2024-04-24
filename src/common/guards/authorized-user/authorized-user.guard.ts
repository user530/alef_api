import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizedUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const requestUserIdParam = request.params?.userId;

      // Authenticated user data
      const { user } = request;

      // Skeleton key, ONLY FOR TESTING PURPOSES, delete in production
      if (user.id === 'Master') return true;

      // Check user data
      if (!user || !user.id)
        throw new UnauthorizedException('Пожалуйста, залогиньтесь!');

      // Prevent user from accessing other users data
      if (requestUserIdParam && parseInt(requestUserIdParam) !== user.id)
        throw 'err';

      return true;
    } catch (error) {
      throw new UnauthorizedException('Отказано в доступе!');
    }


  }
}
