import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- Importante: Torna ele visível no app todo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- Permite que outros módulos usem
})
export class PrismaModule {}
