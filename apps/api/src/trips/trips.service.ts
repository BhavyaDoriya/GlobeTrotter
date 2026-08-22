import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

// Computed in JS — no extra DB column needed
function computeStatus(start: Date, end: Date): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date();
  if (end < now) return 'completed';
  if (start <= now && end >= now) return 'ongoing';
  return 'upcoming';
}

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  // GET /trips — list view for My Trips screen (Person A)
  async findAll(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      include: {
        _count: { select: { stops: true } },
        budgetLines: { select: { amount: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    return trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      description: trip.description,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      coverPhotoUrl: trip.coverPhotoUrl,
      isPublic: trip.isPublic,
      status: computeStatus(trip.startDate, trip.endDate),
      stopsCount: trip._count.stops,
      estimatedCost: trip.budgetLines.reduce((sum, l) => sum + l.amount, 0),
      createdAt: trip.createdAt.toISOString(),
    }));
  }

  // GET /trips/:id — full detail for itinerary builder/view (Person B)
  async findOne(id: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: true,
            stopActivities: {
              include: { activity: true },
            },
          },
        },
        budgetLines: true,
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException('Access denied');

    const activityCost = trip.stops
      .flatMap((s) => s.stopActivities)
      .reduce((sum, sa) => sum + (sa.activity.costEstimate || 0), 0);

    const budgetLineCost = trip.budgetLines.reduce((sum, l) => sum + l.amount, 0);

    return {
      ...trip,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      status: computeStatus(trip.startDate, trip.endDate),
      totalEstimatedCost: activityCost + budgetLineCost,
    };
  }

  async create(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        ...dto,
        userId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTripDto) {
    await this.findOne(id, userId); // confirms ownership
    return this.prisma.trip.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId); // confirms ownership
    await this.prisma.trip.delete({ where: { id } });
  }

  async getSummary(id: string, userId: string) {
    const trip = await this.findOne(id, userId);
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const totalDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      stopsCount: trip.stops.length,
      totalDays,
      estimatedCost: trip.totalEstimatedCost,
      status: trip.status,
    };
  }
}
