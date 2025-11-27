import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  CacheInterceptor,
  CACHE_MANAGER,
  CacheTTL,
} from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Cache } from 'cache-manager';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // <--- Injetando o Redis
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) // <--- Só quem tem token cria produto
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (this.cacheManager as any).reset();

    return product;
  }

  @UseInterceptors(CacheInterceptor) // <--- (Mágica) O Nest verifica o Redis antes de rodar a função
  @CacheTTL(60 * 1000) // <--- Opcional: Cache dura 60 segundos (1 minuto) para essa rota
  @Get()
  @Get() // <--- SEM Guard! Público para todos verem a vitrine
  findAll(
    @Query('page') page: string = '1', // Padrão: Página 1
    @Query('limit') limit: string = '10', // Padrão: 10 por vez
  ) {
    return this.productsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
