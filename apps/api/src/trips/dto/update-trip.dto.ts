import { PartialType } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';

// All fields from CreateTripDto become optional
export class UpdateTripDto extends PartialType(CreateTripDto) {}
