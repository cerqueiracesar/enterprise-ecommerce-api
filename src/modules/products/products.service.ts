import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // 1. Verificar se slug já existe
    const productExists = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (productExists) {
      throw new ConflictException('Product with this slug already exists');
    }

    // 2. Criar
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return this.prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // Bônus: Os mais novos aparecem primeiro
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}
