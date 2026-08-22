import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  private async verifyTripOwnership(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException('Access denied');
    return trip;
  }

  async getSummary(tripId: string, userId: string) {
    const trip = await this.verifyTripOwnership(tripId, userId);

    // Fetch everything needed in parallel
    const [stops, budgetLines] = await Promise.all([
      this.prisma.stop.findMany({
        where: { tripId },
        include: {
          city: { select: { name: true } },
          stopActivities: {
            include: {
              activity: { select: { costEstimate: true } },
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.budgetLine.findMany({ where: { tripId } }),
    ]);

    // --- Estimated cost ---
    // From activities: sum of activity.costEstimate for every StopActivity
    const activityEstimated = stops
      .flatMap((s) => s.stopActivities)
      .reduce((sum, sa) => sum + (sa.activity.costEstimate ?? 0), 0);

    // From manual budget lines
    const budgetLineTotal = budgetLines.reduce((sum, l) => sum + l.amount, 0);

    const totalEstimatedCost = activityEstimated + budgetLineTotal;

    // --- Actual cost ---
    // Use actualCost if recorded, otherwise fall back to the activity estimate
    const totalActualCost =
      stops
        .flatMap((s) => s.stopActivities)
        .reduce(
          (sum, sa) =>
            sum + (sa.actualCost !== null && sa.actualCost !== undefined
              ? sa.actualCost
              : sa.activity.costEstimate ?? 0),
          0,
        ) + budgetLineTotal;

    // --- Per day average ---
    const tripDays = Math.max(
      1,
      Math.ceil(
        (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    const averageCostPerDay = totalEstimatedCost / tripDays;

    // --- By category ---
    const categories = ['TRANSPORT', 'STAY', 'ACTIVITIES', 'MEALS', 'OTHER'] as const;
    const byCategory = categories.map((category) => {
      const lines = budgetLines.filter((l) => l.category === category);
      const estimated = lines.reduce((sum, l) => sum + l.amount, 0);
      // Actual = same as estimated for manual lines (no actual tracking on budget lines)
      return { category, estimated, actual: estimated };
    });

    // Add activity costs into ACTIVITIES category
    const activitiesEntry = byCategory.find((c) => c.category === 'ACTIVITIES');
    if (activitiesEntry) {
      activitiesEntry.estimated += activityEstimated;
      activitiesEntry.actual += stops
        .flatMap((s) => s.stopActivities)
        .reduce(
          (sum, sa) =>
            sum + (sa.actualCost !== null && sa.actualCost !== undefined
              ? sa.actualCost
              : sa.activity.costEstimate ?? 0),
          0,
        );
    }

    // --- By stop ---
    const byStop = stops.map((stop) => {
      const stopDays = Math.max(
        1,
        Math.ceil(
          (stop.departureDate.getTime() - stop.arrivalDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      const estimated = stop.stopActivities.reduce(
        (sum, sa) => sum + (sa.activity.costEstimate ?? 0),
        0,
      );
      const actual = stop.stopActivities.reduce(
        (sum, sa) =>
          sum + (sa.actualCost !== null && sa.actualCost !== undefined
            ? sa.actualCost
            : sa.activity.costEstimate ?? 0),
        0,
      );
      return {
        stopId: stop.id,
        cityName: stop.city.name,
        estimated,
        actual,
        days: stopDays,
      };
    });

    // --- Over-budget detection ---
    const isOverBudget = totalActualCost > totalEstimatedCost;

    // Find days where cumulative cost exceeds the daily average
    // Build a flat list of all scheduled activity dates and flag the over-budget ones
    const overBudgetDays: string[] = [];
    const dailyCosts: Record<string, number> = {};

    stops.flatMap((s) => s.stopActivities).forEach((sa) => {
      if (!sa['scheduledDate']) return;
      const dateKey = new Date(sa['scheduledDate']).toISOString().split('T')[0];
      const cost =
        sa.actualCost !== null && sa.actualCost !== undefined
          ? sa.actualCost
          : sa.activity.costEstimate ?? 0;
      dailyCosts[dateKey] = (dailyCosts[dateKey] || 0) + cost;
    });

    Object.entries(dailyCosts).forEach(([date, cost]) => {
      if (cost > averageCostPerDay) {
        overBudgetDays.push(date);
      }
    });

    return {
      totalEstimatedCost,
      totalActualCost,
      averageCostPerDay,
      byCategory,
      byStop,
      isOverBudget,
      overBudgetDays,
    };
  }

  async addLine(tripId: string, userId: string, dto: CreateBudgetLineDto) {
    await this.verifyTripOwnership(tripId, userId);

    return this.prisma.budgetLine.create({
      data: {
        tripId,
        category: dto.category,
        label: dto.label,
        amount: dto.amount,
        ...(dto.stopId && { stopId: dto.stopId }),
      },
    });
  }

  async removeLine(tripId: string, lineId: string, userId: string) {
    await this.verifyTripOwnership(tripId, userId);

    const line = await this.prisma.budgetLine.findUnique({ where: { id: lineId } });
    if (!line || line.tripId !== tripId) {
      throw new NotFoundException('Budget line not found');
    }

    await this.prisma.budgetLine.delete({ where: { id: lineId } });
  }
}
