import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Para buscar o usuário
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Pega do .env
      signOptions: { expiresIn: '1h' }, // O token expira em 1 hora (Segurança)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
