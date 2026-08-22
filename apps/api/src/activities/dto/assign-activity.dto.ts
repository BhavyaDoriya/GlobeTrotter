import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignActivityDto {
  @ApiProperty({ example: 'activity-cuid-here' })
  @IsString()
  activityId: string;

  @ApiPropertyOptional({ example: '2025-06-02T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  scheduledTime?: string;
}
