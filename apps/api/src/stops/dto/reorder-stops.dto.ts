import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class StopOrderItem {
  @ApiProperty({ example: 'stop-cuid-here' })
  @IsString()
  id: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  orderIndex: number;
}

export class ReorderStopsDto {
  @ApiProperty({ type: [StopOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StopOrderItem)
  stops: StopOrderItem[];
}
