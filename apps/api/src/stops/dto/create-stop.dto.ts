import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStopDto {
  @ApiProperty({ example: 'city-cuid-here' })
  @IsString()
  cityId: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  @IsDateString()
  arrivalDate: string;

  @ApiProperty({ example: '2025-06-04T00:00:00.000Z' })
  @IsDateString()
  departureDate: string;
}
