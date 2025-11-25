import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Onde buscar o token? No Header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rejeita se estiver expirado
      // 2. Qual a chave para descriptografar? (Tem que ser a mesma do .env)
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // 3. Se o token for válido, o Nest roda essa função automaticamente
  async validate(payload: any) {
    // O retorno daqui é injetado no objeto `request.user`
    return { userId: payload.sub, email: payload.email };
  }
}
