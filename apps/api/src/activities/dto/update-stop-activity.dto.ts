import { IsOptional, IsDateString, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStopActivityDto {
  @ApiPropertyOptional({ example: '2025-06-02T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '10:30' })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiPropertyOptional({ example: 25.5, description: 'Actual cost paid — overrides estimate' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualCost?: number;
}
