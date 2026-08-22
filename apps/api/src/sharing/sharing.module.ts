import { Module } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingController } from './sharing.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SharingController],
  providers: [SharingService, PrismaService],
  exports: [SharingService],
})
export class SharingModule {}
