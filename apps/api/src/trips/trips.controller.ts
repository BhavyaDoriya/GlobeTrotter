import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('trips')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips for the current user (with computed status)' })
  @ApiResponse({ status: 200, description: 'Array of trips with status: upcoming | ongoing | completed' })
  findAll(@CurrentUser() user: any) {
    return this.tripsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created' })
  create(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full trip detail — stops, activities, budget lines' })
  @ApiResponse({ status: 200, description: 'Full trip object with nested stops and activities' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  @ApiResponse({ status: 403, description: 'Trip belongs to another user' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip fields' })
  @ApiResponse({ status: 200, description: 'Updated trip' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete trip (cascades stops, activities, budget)' })
  @ApiResponse({ status: 204, description: 'Trip deleted' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.delete(id, user.id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get trip summary — stop count, total days, estimated cost' })
  @ApiResponse({ status: 200, description: 'Trip summary object' })
  summary(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.getSummary(id, user.id);
  }
}
