# GlobeTrotter — Person C: Task Checklist

Work top to bottom. Every task has a clear goal, exact commands, and a "done when" check.
Current status: **Source files, config, and auth module all created. Need Supabase DATABASE_URL to proceed.**

---

## TASK 1 — Environment Setup
**Goal:** Supabase project created, DATABASE_URL in .env, NestJS app booting.

> ✅ pnpm installed, all packages installed, all source files already created.
> You only need to connect to Supabase and boot the app.

### 1.1 — Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) → sign in → **New Project**
2. Fill in:
   - **Name:** `globetrotter`
   - **Database Password:** set a strong password — **save it somewhere**
   - **Region:** pick closest to you
3. Wait ~2 minutes for the project to finish provisioning

### 1.2 — Get your DATABASE_URL
1. Supabase Dashboard → your project → **Settings** → **Database**
2. Scroll to **Connection string** → click the **URI** tab
3. Copy the string — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### 1.3 — Update .env
Open `apps/api/.env` and replace the DATABASE_URL with your real Supabase URI:
```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```
Everything else in `.env` stays as-is.

### 1.4 — Boot the API
```bash
cd e:\github_Manthan\GlobeTrotter\apps\api
pnpm run dev
```
Expected output:
```
🌍 API running    → http://localhost:4000
📄 Swagger docs  → http://localhost:4000/api/docs
```
> A Prisma connection error here is fine — the DB exists but has no tables yet. That's Task 2.

### ✅ Task 1 Done When
- Supabase project is live and you have the real DATABASE_URL in `.env`
- `pnpm run dev` starts the server at port 4000

---

## TASK 2 — Prisma Schema + First Migration
**Goal:** All database tables created and confirmed in Postgres.

### 2.1 — Initialize Prisma
```bash
cd apps/api
npx prisma init
```
This creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env` (already there).

### 2.2 — Write the schema
Replace `prisma/schema.prisma` contents entirely with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum BudgetCategory {
  TRANSPORT
  STAY
  ACTIVITIES
  MEALS
  OTHER
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  passwordHash  String
  firstName     String
  lastName      String
  city          String?
  country       String?
  avatarUrl     String?
  role          Role           @default(USER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  trips         Trip[]
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Trip {
  id            String       @id @default(cuid())
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  description   String?
  startDate     DateTime
  endDate       DateTime
  coverPhotoUrl String?
  isPublic      Boolean      @default(false)
  shareSlug     String?      @unique
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  stops         Stop[]
  budgetLines   BudgetLine[]
}

model Stop {
  id             String         @id @default(cuid())
  tripId         String
  trip           Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  cityId         String
  city           City           @relation(fields: [cityId], references: [id])
  orderIndex     Int
  arrivalDate    DateTime
  departureDate  DateTime
  createdAt      DateTime       @default(now())
  stopActivities StopActivity[]
  budgetLines    BudgetLine[]

  @@index([tripId, orderIndex])
}

model City {
  id              String     @id @default(cuid())
  name            String
  country         String
  region          String
  lat             Float
  lng             Float
  costIndex       Float      @default(1.0)
  popularityScore Float      @default(0.0)
  imageUrl        String?
  createdAt       DateTime   @default(now())
  stops           Stop[]
  activities      Activity[]
}

model Activity {
  id              String         @id @default(cuid())
  cityId          String
  city            City           @relation(fields: [cityId], references: [id])
  name            String
  category        String
  description     String?
  costEstimate    Float          @default(0)
  durationMinutes Int            @default(60)
  imageUrl        String?
  createdAt       DateTime       @default(now())
  stopActivities  StopActivity[]
}

model StopActivity {
  id            String    @id @default(cuid())
  stopId        String
  stop          Stop      @relation(fields: [stopId], references: [id], onDelete: Cascade)
  activityId    String
  activity      Activity  @relation(fields: [activityId], references: [id])
  scheduledDate DateTime?
  scheduledTime String?
  actualCost    Float?
  createdAt     DateTime  @default(now())
}

model BudgetLine {
  id        String         @id @default(cuid())
  tripId    String
  trip      Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  stopId    String?
  stop      Stop?          @relation(fields: [stopId], references: [id])
  category  BudgetCategory
  label     String
  amount    Float
  createdAt DateTime       @default(now())
}
```

### 2.3 — Run migration
```bash
cd apps/api
npx prisma migrate dev --name init
```

### 2.4 — Generate Prisma client
```bash
npx prisma generate
```

### 2.5 — Verify in Prisma Studio
```bash
npx prisma studio
```
Opens browser at `http://localhost:5555`. Confirm all 8 tables are listed:
User, RefreshToken, Trip, Stop, City, Activity, StopActivity, BudgetLine

### 2.6 — Commit
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: prisma schema v1 - init migration"
```
Post to team: *"Schema v1 live — pull and run `npx prisma migrate dev`"*

### ✅ Task 2 Done When
- Migration ran without errors
- Prisma Studio shows all 8 tables
- Committed to repo

---

## TASK 3 — Stub Seed Script
**Goal:** `npx prisma db seed` runs without crashing. Real data added in Task 11.

### 3.1 — Create seed file
Create `apps/api/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed stub — real data coming in Task 11');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

### 3.2 — Add seed script to package.json
In `apps/api/package.json`, add:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 3.3 — Run it
```bash
cd apps/api
npx prisma db seed
```
Should print: `🌱 Seed stub — real data coming in Task 11`

### ✅ Task 3 Done When
`npx prisma db seed` exits with no errors.

---

## TASK 4 — Common Module
**Goal:** Shared decorators, guards, and exception filter that every other module uses.

### Files to create inside `apps/api/src/common/`:

**`decorators/public.decorator.ts`**
```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**`decorators/current-user.decorator.ts`**
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
```

**`filters/http-exception.filter.ts`**
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    response.status(status).json({
      statusCode: status,
      message,
      // NO stack trace — never expose internals
    });
  }
}
```

**`guards/roles.guard.ts`**
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) =>
  require('@nestjs/common').SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
```

**`prisma.service.ts`** (put in `src/` root, not inside common/)
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### Update `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

### Update `src/main.ts`
```typescript
import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('GlobeTrotter API')
    .setDescription('Backend API for GlobeTrotter travel planning app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🌍 API running at http://localhost:${port}`);
  console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
```

Restart dev server and confirm it still boots.

### ✅ Task 4 Done When
App boots, no TypeScript errors in common files.

---

## TASK 5 — Auth Module ⚡ HIGHEST PRIORITY
**Goal:** Register, login, JWT issued. Person A is blocked until this works.

### File structure to create: `src/auth/`
```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── local.strategy.ts
│   └── jwt.strategy.ts
├── guards/
│   ├── local-auth.guard.ts
│   └── jwt-auth.guard.ts
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

**`dto/register.dto.ts`**
```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
}
```

**`dto/login.dto.ts`**
```typescript
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() password: string;
}
```

**`strategies/local.strategy.ts`**
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
```

**`strategies/jwt.strategy.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
```

**`guards/local-auth.guard.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

**`guards/jwt-auth.guard.ts`**
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

**`auth.service.ts`**
```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, firstName: dto.firstName, lastName: dto.lastName },
    });

    return this.issueTokens(user);
  }

  async login(user: any) {
    return this.issueTokens(user);
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      { secret: this.config.get('JWT_SECRET'), expiresIn: this.config.get('JWT_EXPIRES_IN') },
    );
    return { accessToken };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }

  private async issueTokens(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    const { passwordHash, ...safeUser } = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    return { accessToken, refreshToken, user: safeUser };
  }
}
```

**`auth.controller.ts`**
```typescript
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email + password' })
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  logout(@Body('refreshToken') token: string) {
    return this.authService.logout(token);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  me(@CurrentUser() user: any) {
    return user;
  }
}
```

**`auth.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
```

**Add JwtAuthGuard globally and register AuthModule in `app.module.ts`:**
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [PrismaService],
})
export class AppModule {}
```

### Test it
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","firstName":"Test","lastName":"User"}'

# Should return: { accessToken, refreshToken, user }
```

### 🚨 Sync Point
Post to team: *"Auth live — POST /api/auth/register and /api/auth/login working. Swagger: http://localhost:4000/api/docs"*
Wait for Person A to confirm the login → dashboard round trip works before you move on.

### ✅ Task 5 Done When
- Register returns `{ accessToken, refreshToken, user }`
- Login returns the same
- `GET /api/auth/me` with the Bearer token returns the user
- No `passwordHash` in any response

---

## TASK 6 — Users Module
**Goal:** Profile read, update, delete endpoints for the logged-in user.

### File structure: `src/users/`
```
users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
└── dto/
    └── update-user.dto.ts
```

**`dto/update-user.dto.ts`**
```typescript
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() avatarUrl?: string;
}
```

**`users.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
```

**`users.controller.ts`**
```typescript
import { Controller, Get, Patch, Delete, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete account' })
  deleteMe(@CurrentUser() user: any) {
    return this.usersService.delete(user.id);
  }
}
```

**`users.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
```

Register in `app.module.ts` imports array: `UsersModule`

### ✅ Task 6 Done When
GET/PATCH/DELETE `/api/users/me` all work with a valid Bearer token.

---

## TASK 7 — Trips Module
**Goal:** Full CRUD for trips with computed status. Lock response shapes and post to team.

### File structure: `src/trips/`
```
trips/
├── trips.module.ts
├── trips.controller.ts
├── trips.service.ts
└── dto/
    ├── create-trip.dto.ts
    └── update-trip.dto.ts
```

**`dto/create-trip.dto.ts`**
```typescript
import { IsString, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() coverPhotoUrl?: string;
}
```

**`dto/update-trip.dto.ts`** — same fields, all optional (use `PartialType` from `@nestjs/swagger`)
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
export class UpdateTripDto extends PartialType(CreateTripDto) {}
```

**`trips.service.ts`**
```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

function computeStatus(start: Date, end: Date): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date();
  if (end < now) return 'completed';
  if (start <= now && end >= now) return 'ongoing';
  return 'upcoming';
}

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      include: {
        _count: { select: { stops: true } },
        budgetLines: true,
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

  async findOne(id: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: true,
            stopActivities: { include: { activity: true } },
          },
        },
        budgetLines: true,
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.userId !== userId) throw new ForbiddenException();

    const totalEstimatedCost = trip.stops.flatMap((s) => s.stopActivities)
      .reduce((sum, sa) => sum + (sa.activity.costEstimate || 0), 0)
      + trip.budgetLines.reduce((sum, l) => sum + l.amount, 0);

    return { ...trip, status: computeStatus(trip.startDate, trip.endDate), totalEstimatedCost };
  }

  async create(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: { ...dto, userId, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) },
    });
  }

  async update(id: string, userId: string, dto: UpdateTripDto) {
    await this.findOne(id, userId);
    return this.prisma.trip.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.trip.delete({ where: { id } });
  }

  async getSummary(id: string, userId: string) {
    const trip = await this.findOne(id, userId);
    const days = Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      stopsCount: trip.stops.length,
      totalDays: days,
      estimatedCost: trip.totalEstimatedCost,
      status: trip.status,
    };
  }
}
```

**`trips.controller.ts`**
```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('trips')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips for current user' })
  findAll(@CurrentUser() user: any) {
    return this.tripsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  create(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full trip detail with stops and activities' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateTripDto) {
    return this.tripsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete trip' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.delete(id, user.id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get trip summary (stops count, days, cost)' })
  summary(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.getSummary(id, user.id);
  }
}
```

### 🚨 Sync Point
Post to team: *"GET /trips and GET /trips/:id shapes locked — check Swagger http://localhost:4000/api/docs"*

### ✅ Task 7 Done When
All 6 endpoints work, status field shows correctly, no mock data.

---

## TASK 8 — Stops Module
**Goal:** Add, update, remove, and reorder city stops within a trip.

### File structure: `src/stops/`

**`dto/create-stop.dto.ts`**
```typescript
import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStopDto {
  @ApiProperty() @IsString() cityId: string;
  @ApiProperty() @IsDateString() arrivalDate: string;
  @ApiProperty() @IsDateString() departureDate: string;
}
```

**`dto/reorder-stops.dto.ts`**
```typescript
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class StopOrderItem {
  @ApiProperty() id: string;
  @ApiProperty() orderIndex: number;
}

export class ReorderStopsDto {
  @ApiProperty({ type: [StopOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StopOrderItem)
  stops: StopOrderItem[];
}
```

**`stops.service.ts`** — key method is `reorder` using a Prisma transaction:
```typescript
async reorder(tripId: string, dto: ReorderStopsDto) {
  return this.prisma.$transaction(
    dto.stops.map(({ id, orderIndex }) =>
      this.prisma.stop.update({
        where: { id, tripId },
        data: { orderIndex },
      })
    )
  );
}
```

**Endpoints:**
```
POST   /trips/:tripId/stops              → add stop
PATCH  /trips/:tripId/stops/:stopId      → update dates
DELETE /trips/:tripId/stops/:stopId      → 204
POST   /trips/:tripId/stops/reorder      → reorder all stops atomically
```

### ✅ Task 8 Done When
All 4 endpoints work. Reorder runs in a single transaction.

---

## TASK 9 — Activities Module (StopActivity)
**Goal:** Assign activities from the catalog to stops. Schedule them and track actual cost.

**Endpoints:**
```
POST   /stops/:stopId/activities                     → assign activity to stop
PATCH  /stops/:stopId/activities/:stopActivityId     → update schedule/cost
DELETE /stops/:stopId/activities/:stopActivityId     → remove
```

**Key DTO fields:**
- Assign: `activityId` (required), `scheduledDate` (optional), `scheduledTime` (optional)
- Update: `scheduledDate`, `scheduledTime`, `actualCost` — all optional

### ✅ Task 9 Done When
Activities can be assigned to stops and appear in `GET /trips/:id` response.

---

## TASK 10 — Budget Module
**Goal:** Aggregate costs by category, by stop, and per day. Feeds the charts on Person B's screens.

**Endpoints:**
```
GET    /trips/:tripId/budget         → full BudgetSummary
POST   /trips/:tripId/budget/lines   → add manual line item
DELETE /trips/:tripId/budget/lines/:id
```

**`GET /trips/:tripId/budget` must return:**
```typescript
{
  totalEstimatedCost: number;
  totalActualCost: number;
  averageCostPerDay: number;
  byCategory: { category: string; estimated: number; actual: number; }[];
  byStop: { stopId: string; cityName: string; estimated: number; actual: number; days: number; }[];
  isOverBudget: boolean;
  overBudgetDays: string[];   // ISO date strings
}
```

**Calculation rules:**
- Estimated = sum of `activity.costEstimate` for all StopActivities + manual BudgetLine amounts
- Actual = sum of `stopActivity.actualCost` (fallback to estimate if null)
- Average per day = totalEstimated / total trip days

### ✅ Task 10 Done When
`GET /trips/:tripId/budget` returns all fields with correct numbers.

---

## TASK 11 — Full Seed Data
**Goal:** Replace the stub with real demo data. Judges will click these trips.

### Seed checklist
- [ ] 12 cities across 4+ regions (Europe, Asia, Americas, Middle East)
  - Each city needs: name, country, region, lat, lng, costIndex, popularityScore
- [ ] 4–5 activities per city with realistic costEstimate and durationMinutes
- [ ] 1 admin user: `admin@globetrotter.dev` / `Admin1234!`
- [ ] 2 regular demo users with realistic names
- [ ] 3 fully built demo trips with varied statuses:
  - **Trip 1** — `completed` (past dates): 3 stops, 3+ activities each, full budget lines
  - **Trip 2** — `upcoming` (future dates): 3 stops, 3+ activities each
  - **Trip 3** — `ongoing` (today is inside start–end range): 2 stops

Run: `npx prisma db seed`

### ✅ Task 11 Done When
Seed runs clean. Demo trips show up in Prisma Studio with all stops and activities.

---

## TASK 12 — Swagger Polish
**Goal:** Every endpoint documented. A and B use this as their contract.

- [ ] All controllers have `@ApiTags('name')`
- [ ] All endpoints have `@ApiOperation({ summary: '...' })`
- [ ] All protected endpoints have `@ApiBearerAuth()`
- [ ] All DTOs have `@ApiProperty()` on every field
- [ ] Open `http://localhost:4000/api/docs` and manually verify every endpoint appears

### ✅ Task 12 Done When
Every endpoint visible in Swagger with accurate docs.

---

## TASK 13 — Pre-Integration Smoke Test
**Goal:** Every endpoint verified with real DB data before pairing with Person A.

Test each manually (use Swagger UI, Thunder Client, or Postman):
- [ ] `POST /api/auth/register` → returns tokens
- [ ] `POST /api/auth/login` → returns tokens
- [ ] `GET /api/auth/me` → returns user (no passwordHash)
- [ ] `GET /api/trips` → returns seeded trips with status
- [ ] `POST /api/trips` → creates trip
- [ ] `GET /api/trips/:id` → returns full trip with stops + activities
- [ ] `POST /api/trips/:id/stops` → adds stop
- [ ] `POST /api/trips/:id/stops/reorder` → reorders
- [ ] `POST /api/stops/:id/activities` → assigns activity
- [ ] `GET /api/trips/:id/budget` → returns full budget breakdown
- [ ] Send a bad request to any endpoint → confirm clean error, no stack trace

### ✅ Task 13 Done When
All 11 checks pass. Zero stack traces in error responses.

---

## TASK 14 — Integration with Person A
**Hour 14–18 | Pair programming**

- [ ] Walk through every screen A owns (Dashboard, Create Trip, My Trips, Profile)
- [ ] Fix any response shape mismatches found during wiring
- [ ] Add any missing fields A needs — update schema if required, run `npx prisma migrate dev --name <desc>`
- [ ] If schema changes → post to team immediately
- [ ] Confirm A has removed all mock/hardcoded data

### ✅ Task 14 Done When
Every screen Person A owns is running against real API, zero mock data.

---

## TASK 15 — Polish & Hardening
**Goal:** API is production-safe for the demo.**

- [ ] Bad requests return `{ statusCode, message }` — no stack traces
- [ ] `passwordHash` never appears in any API response (search your codebase: `grep -r "passwordHash" src/`)
- [ ] All `findOne` methods throw `NotFoundException` when resource missing
- [ ] Ownership enforced — users can't access each other's trips
- [ ] Run `npx prisma db seed` against the deployed database (coordinate with Person D)
- [ ] Verify 3 demo trips visible in production

### ✅ Task 15 Done When
API is clean, secure, seeded in production.

---

## TASK 16 — Pitch Prep
**Know these cold before the demo:**

1. "Auth uses JWT access tokens (15 min) + refresh tokens stored in the DB — real invalidation on logout, not just client-side drop."
2. "Prisma schema is the single source of truth — every migration is versioned and visible in the repo."
3. "Budget aggregates across 3 dimensions: by category, by stop, and per day — the charts are driven by one structured endpoint."
4. "Stop reordering runs in a Prisma transaction — all orderIndex updates are atomic."
5. "The global exception filter ensures stack traces never reach the client."

---

## Overall Status

| # | Task | Target Hour | Status |
|---|---|---|---|
| 1 | Environment Setup | 0–1 | ⬜ |
| 2 | Prisma Schema + Migration | 1–2 | ⬜ |
| 3 | Seed Stub | 2 | ⬜ |
| 4 | Common Module | 2 | ⬜ |
| 5 | Auth Module ⚡ | 2–4 | ⬜ |
| 6 | Users Module | 4–5 | ⬜ |
| 7 | Trips Module | 4–7 | ⬜ |
| 8 | Stops Module | 5–8 | ⬜ |
| 9 | Activities Module | 6–9 | ⬜ |
| 10 | Budget Module | 7–11 | ⬜ |
| 11 | Full Seed Data | 9–11 | ⬜ |
| 12 | Swagger Polish | 11–13 | ⬜ |
| 13 | Smoke Test | 12–14 | ⬜ |
| 14 | Integration with A | 14–18 | ⬜ |
| 15 | Polish & Hardening | 18–21 | ⬜ |
| 16 | Pitch Prep | 21–24 | ⬜ |

---

## Team Sync Points — Never Skip

| Hour | You must post to team |
|---|---|
| 2 | Auth live — Swagger URL shared |
| 4 | `GET /trips` response shape locked |
| 5 | `GET /trips/:id` full shape locked (B waiting) |
| 8 | Stops + activities endpoints working |
| 12 | Budget endpoint live with real numbers |
| 14 | Integration starts with Person A |
| 18 | Full journey works, zero mock data |
