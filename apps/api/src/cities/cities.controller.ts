import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cities')
@ApiBearerAuth()
@Controller('cities')
export class CitiesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.city.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
