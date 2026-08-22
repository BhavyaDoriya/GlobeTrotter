import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BudgetCategory {
  TRANSPORT = 'TRANSPORT',
  STAY = 'STAY',
  ACTIVITIES = 'ACTIVITIES',
  MEALS = 'MEALS',
  OTHER = 'OTHER',
}

export class CreateBudgetLineDto {
  @ApiProperty({ enum: BudgetCategory, example: BudgetCategory.TRANSPORT })
  @IsEnum(BudgetCategory)
  category: BudgetCategory;

  @ApiProperty({ example: 'Flight BOM → CDG' })
  @IsString()
  label: string;

  @ApiProperty({ example: 450.00 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'stop-cuid-here', description: 'Link to a specific stop (optional)' })
  @IsOptional()
  @IsString()
  stopId?: string;
}
