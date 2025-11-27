import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager'; // <--- Importe
import { redisStore } from 'cache-manager-redis-yet'; // <--- Importe
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Para ler o .env

    // 👇 Configuração do Redis Global
    CacheModule.registerAsync({
      isGlobal: true, // Funciona no app todo
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT!) || 6379,
          },
          ttl: 10 * 1000, // Tempo de vida do cache (Time To Live): 10 segundos (padrão)
        }),
      }),
    }),

    PrismaModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
})
export class AppModule {}
