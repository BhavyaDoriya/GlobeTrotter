import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssignActivityDto } from './dto/assign-activity.dto';
import { UpdateStopActivityDto } from './dto/update-stop-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  // Verify stop exists before mutating
  private async verifyStop(stopId: string) {
    const stop = await this.prisma.stop.findUnique({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Stop not found');
    return stop;
  }

  // Assign an activity from the catalog to a stop
  async assign(stopId: string, dto: AssignActivityDto) {
    await this.verifyStop(stopId);

    // Verify activity exists in the catalog
    const activity = await this.prisma.activity.findUnique({
      where: { id: dto.activityId },
    });
    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.stopActivity.create({
      data: {
        stopId,
        activityId: dto.activityId,
        ...(dto.scheduledDate && { scheduledDate: new Date(dto.scheduledDate) }),
        ...(dto.scheduledTime && { scheduledTime: dto.scheduledTime }),
      },
      include: { activity: true },
    });
  }

  // Update schedule time or record actual cost paid
  async update(stopId: string, stopActivityId: string, dto: UpdateStopActivityDto) {
    await this.verifyStop(stopId);

    const sa = await this.prisma.stopActivity.findUnique({
      where: { id: stopActivityId },
    });
    if (!sa || sa.stopId !== stopId) {
      throw new NotFoundException('Stop activity not found');
    }

    return this.prisma.stopActivity.update({
      where: { id: stopActivityId },
      data: {
        ...(dto.scheduledDate && { scheduledDate: new Date(dto.scheduledDate) }),
        ...(dto.scheduledTime !== undefined && { scheduledTime: dto.scheduledTime }),
        ...(dto.actualCost !== undefined && { actualCost: dto.actualCost }),
      },
      include: { activity: true },
    });
  }

  // Remove an activity assignment from a stop
  async remove(stopId: string, stopActivityId: string) {
    await this.verifyStop(stopId);

    const sa = await this.prisma.stopActivity.findUnique({
      where: { id: stopActivityId },
    });
    if (!sa || sa.stopId !== stopId) {
      throw new NotFoundException('Stop activity not found');
    }

    await this.prisma.stopActivity.delete({ where: { id: stopActivityId } });
  }
}
