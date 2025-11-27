import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    // 1. Iniciar a Transação (Tudo ou Nada)
    // O prisma.$transaction garante que todas as operações dentro dele sejam atómicas.
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      // Vamos montar a lista de itens para salvar depois
      const orderItemsData: any[] = [];

      for (const item of items) {
        // 2. Buscar o produto e verificar Stock
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto ID ${item.productId} não encontrado`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para o produto ${product.name}. Disponível: ${product.stock}`,
          );
        }

        // 3. Decrementar o Stock (Aqui está a mágica!)
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        // 4. Calcular preço (Backend é quem manda no preço, nunca o Frontend!)
        // Converter Decimal para Number para somar, depois o Prisma converte de volta
        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // Salva o preço ATUAL
        });
      }

      // 5. Criar o Pedido Final com os Itens aninhados
      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return order;
    });
  }

  // ... implementar findAll depois se quiser
  findAll() {
    return `This action returns all orders`;
  }
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
  update(id: number, updateOrderDto: any) {
    return `Update`;
  }
  remove(id: number) {
    return `Remove`;
  }
}
