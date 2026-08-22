import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SharingService } from './sharing.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('sharing')
@Controller()
export class SharingController {
  constructor(private sharingService: SharingService) {}

  @ApiBearerAuth()
  @Post('trips/:id/share')
  @ApiOperation({ summary: 'Generate public share link for a trip' })
  @ApiResponse({ status: 200, description: 'Generated share slug and public URL' })
  generateShareSlug(@Param('id') id: string, @CurrentUser() user: any) {
    return this.sharingService.generateShareSlug(id, user.id);
  }

  @Public()
  @Get('trips/share/:slug')
  @ApiOperation({ summary: 'Get public shared trip itinerary by slug' })
  @ApiResponse({ status: 200, description: 'Public trip object with stops and activities' })
  getPublicTrip(@Param('slug') slug: string) {
    return this.sharingService.findBySlug(slug);
  }
}
