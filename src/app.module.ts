import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
