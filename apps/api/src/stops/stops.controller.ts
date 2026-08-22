import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { ReorderStopsDto } from './dto/reorder-stops.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('stops')
@ApiBearerAuth()
@Controller('trips/:tripId/stops')
export class StopsController {
  constructor(private stopsService: StopsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a city stop to a trip' })
  @ApiResponse({ status: 201, description: 'Stop created and appended to end of trip' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  create(@Param('tripId') tripId: string, @CurrentUser() user: any, @Body() dto: CreateStopDto) {
    return this.stopsService.create(tripId, user.id, dto);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder all stops atomically (Prisma transaction)' })
  @ApiResponse({ status: 200, description: 'All stops updated with new orderIndex values' })
  reorder(@Param('tripId') tripId: string, @CurrentUser() user: any, @Body() dto: ReorderStopsDto) {
    return this.stopsService.reorder(tripId, user.id, dto);
  }

  @Patch(':stopId')
  @ApiOperation({ summary: 'Update stop arrival/departure dates' })
  @ApiResponse({ status: 200, description: 'Stop updated' })
  @ApiResponse({ status: 404, description: 'Stop not found' })
  update(@Param('tripId') tripId: string, @Param('stopId') stopId: string, @CurrentUser() user: any, @Body() dto: UpdateStopDto) {
    return this.stopsService.update(tripId, stopId, user.id, dto);
  }

  @Delete(':stopId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a stop from a trip' })
  @ApiResponse({ status: 204, description: 'Stop deleted' })
  delete(@Param('tripId') tripId: string, @Param('stopId') stopId: string, @CurrentUser() user: any) {
    return this.stopsService.delete(tripId, stopId, user.id);
  }
}
