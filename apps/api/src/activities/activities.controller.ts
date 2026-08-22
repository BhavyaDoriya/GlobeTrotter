import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { AssignActivityDto } from './dto/assign-activity.dto';
import { UpdateStopActivityDto } from './dto/update-stop-activity.dto';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('stops/:stopId/activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Assign an activity from the catalog to a stop' })
  @ApiResponse({ status: 201, description: 'Activity assigned to stop' })
  @ApiResponse({ status: 404, description: 'Stop or activity not found' })
  assign(@Param('stopId') stopId: string, @Body() dto: AssignActivityDto) {
    return this.activitiesService.assign(stopId, dto);
  }

  @Patch(':stopActivityId')
  @ApiOperation({ summary: 'Update schedule time or record actual cost paid' })
  @ApiResponse({ status: 200, description: 'StopActivity updated' })
  @ApiResponse({ status: 404, description: 'StopActivity not found' })
  update(@Param('stopId') stopId: string, @Param('stopActivityId') stopActivityId: string, @Body() dto: UpdateStopActivityDto) {
    return this.activitiesService.update(stopId, stopActivityId, dto);
  }

  @Delete(':stopActivityId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove an activity assignment from a stop' })
  @ApiResponse({ status: 204, description: 'Activity removed from stop' })
  remove(@Param('stopId') stopId: string, @Param('stopActivityId') stopActivityId: string) {
    return this.activitiesService.remove(stopId, stopActivityId);
  }
}
