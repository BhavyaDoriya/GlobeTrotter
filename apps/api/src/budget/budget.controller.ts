import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('budget')
@ApiBearerAuth()
@Controller('trips/:tripId/budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get()
  @ApiOperation({ summary: 'Get full budget breakdown — feeds Recharts pie/bar charts' })
  @ApiResponse({ status: 200, description: 'Returns totalEstimatedCost, totalActualCost, byCategory, byStop, isOverBudget, overBudgetDays' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  getSummary(@Param('tripId') tripId: string, @CurrentUser() user: any) {
    return this.budgetService.getSummary(tripId, user.id);
  }

  @Post('lines')
  @ApiOperation({ summary: 'Add a manual budget line item (e.g. flight, hotel booking)' })
  @ApiResponse({ status: 201, description: 'Budget line created' })
  addLine(@Param('tripId') tripId: string, @CurrentUser() user: any, @Body() dto: CreateBudgetLineDto) {
    return this.budgetService.addLine(tripId, user.id, dto);
  }

  @Delete('lines/:lineId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a manual budget line item' })
  @ApiResponse({ status: 204, description: 'Budget line deleted' })
  removeLine(@Param('tripId') tripId: string, @Param('lineId') lineId: string, @CurrentUser() user: any) {
    return this.budgetService.removeLine(tripId, lineId, user.id);
  }
}
