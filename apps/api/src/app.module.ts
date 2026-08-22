import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { StopsModule } from './stops/stops.module';
import { ActivitiesModule } from './activities/activities.module';
import { BudgetModule } from './budget/budget.module';
import { CitiesModule } from './cities/cities.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TripsModule,
    StopsModule,
    ActivitiesModule,
    BudgetModule,
    CitiesModule,
  ],
  providers: [
    PrismaService,
    // Apply JwtAuthGuard globally — use @Public() decorator to opt out on specific routes
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
