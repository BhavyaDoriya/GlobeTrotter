import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('cities')
@Public()
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities or search by query' })
  @ApiResponse({ status: 200, description: 'Array of cities' })
  findAll(@Query('q') q?: string) {
    return this.citiesService.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, description: 'City details' })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
