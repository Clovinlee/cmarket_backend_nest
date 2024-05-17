import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthHeaderMiddleware } from 'src/middleware/auth-header.middleware';

@Module({
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  imports: [JwtModule.register({
    secret: `${process.env.JWT_SECRET}`,
    signOptions: { expiresIn: '300s' },
  })],
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthHeaderMiddleware).forRoutes('auth/self');
  }
}
