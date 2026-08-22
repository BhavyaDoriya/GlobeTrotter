import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SharingService {
  constructor(private prisma: PrismaService) {}

  async generateShareSlug(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException('Not authorized');

    if (trip.shareSlug) {
      return { shareSlug: trip.shareSlug, shareUrl: `/share/${trip.shareSlug}` };
    }

    const slug = `${trip.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        isPublic: true,
        shareSlug: slug,
      },
    });

    return { shareSlug: updated.shareSlug, shareUrl: `/share/${updated.shareSlug}` };
  }

  async findBySlug(slug: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { shareSlug: slug },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        stops: {
          include: {
            city: true,
            stopActivities: { include: { activity: true } },
          },
          orderBy: { orderIndex: 'asc' },
        },
        budgetLines: true,
      },
    });

    if (!trip || !trip.isPublic) {
      throw new NotFoundException('Public trip itinerary not found');
    }

    return trip;
  }
}
