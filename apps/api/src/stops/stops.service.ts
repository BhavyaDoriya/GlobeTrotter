import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { ReorderStopsDto } from './dto/reorder-stops.dto';

@Injectable()
export class StopsService {
  constructor(private prisma: PrismaService) {}

  // Verify the trip belongs to the user before any mutation
  private async verifyTripOwnership(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException('Access denied');
    return trip;
  }

  async create(tripId: string, userId: string, dto: CreateStopDto) {
    await this.verifyTripOwnership(tripId, userId);

    // Set orderIndex to current stop count (appends to end)
    const count = await this.prisma.stop.count({ where: { tripId } });

    return this.prisma.stop.create({
      data: {
        tripId,
        cityId: dto.cityId,
        arrivalDate: new Date(dto.arrivalDate),
        departureDate: new Date(dto.departureDate),
        orderIndex: count,
      },
      include: {
        city: true,
        stopActivities: { include: { activity: true } },
      },
    });
  }

  async update(
    tripId: string,
    stopId: string,
    userId: string,
    dto: UpdateStopDto,
  ) {
    await this.verifyTripOwnership(tripId, userId);

    const stop = await this.prisma.stop.findUnique({ where: { id: stopId } });
    if (!stop || stop.tripId !== tripId) throw new NotFoundException('Stop not found');

    return this.prisma.stop.update({
      where: { id: stopId },
      data: {
        ...(dto.arrivalDate && { arrivalDate: new Date(dto.arrivalDate) }),
        ...(dto.departureDate && { departureDate: new Date(dto.departureDate) }),
      },
      include: { city: true },
    });
  }

  async delete(tripId: string, stopId: string, userId: string) {
    await this.verifyTripOwnership(tripId, userId);

    const stop = await this.prisma.stop.findUnique({ where: { id: stopId } });
    if (!stop || stop.tripId !== tripId) throw new NotFoundException('Stop not found');

    await this.prisma.stop.delete({ where: { id: stopId } });
  }

  // Atomically update all orderIndex values in one transaction — no race conditions
  async reorder(tripId: string, userId: string, dto: ReorderStopsDto) {
    await this.verifyTripOwnership(tripId, userId);

    return this.prisma.$transaction(
      dto.stops.map(({ id, orderIndex }) =>
        this.prisma.stop.update({
          where: { id, tripId },
          data: { orderIndex },
        }),
      ),
    );
  }
}
