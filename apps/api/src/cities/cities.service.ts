import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const INITIAL_CITIES = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    lat: 48.8566,
    lng: 2.3522,
    costIndex: 140,
    popularityScore: 98,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    lat: 35.6762,
    lng: 139.6503,
    costIndex: 135,
    popularityScore: 97,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop',
  },
  {
    name: 'New York',
    country: 'United States',
    region: 'North America',
    lat: 40.7128,
    lng: -74.006,
    costIndex: 160,
    popularityScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
  },
  {
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    lat: 41.9028,
    lng: 12.4964,
    costIndex: 125,
    popularityScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    lat: -8.4095,
    lng: 115.1889,
    costIndex: 70,
    popularityScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    lat: 41.3851,
    lng: 2.1734,
    costIndex: 115,
    popularityScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    costIndex: 150,
    popularityScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop',
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    lat: 25.2048,
    lng: 55.2708,
    costIndex: 165,
    popularityScore: 93,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    lat: -33.8688,
    lng: 151.2093,
    costIndex: 145,
    popularityScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    lat: 1.3521,
    lng: 103.8198,
    costIndex: 155,
    popularityScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop',
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    lat: 52.3676,
    lng: 4.9041,
    costIndex: 130,
    popularityScore: 90,
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&auto=format&fit=crop',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    lat: 13.7563,
    lng: 100.5018,
    costIndex: 65,
    popularityScore: 89,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop',
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    region: 'Europe',
    lat: 41.0082,
    lng: 28.9784,
    costIndex: 75,
    popularityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop',
  },
  {
    name: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    lat: 47.3769,
    lng: 8.5417,
    costIndex: 180,
    popularityScore: 87,
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop',
  },
  {
    name: 'Ahmedabad',
    country: 'India',
    region: 'Asia',
    lat: 23.0225,
    lng: 72.5714,
    costIndex: 45,
    popularityScore: 85,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop',
  },
  {
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    lat: 19.076,
    lng: 72.8777,
    costIndex: 60,
    popularityScore: 86,
    imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop',
  },
  {
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    lat: 15.2993,
    lng: 74.124,
    costIndex: 50,
    popularityScore: 88,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
  },
];

@Injectable()
export class CitiesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultCities();
  }

  async seedDefaultCities() {
    for (const city of INITIAL_CITIES) {
      const existing = await this.prisma.city.findFirst({
        where: { name: city.name, country: city.country },
      });
      if (!existing) {
        await this.prisma.city.create({ data: city });
      }
    }
  }

  async findAll(query?: string) {
    if (query && query.trim().length > 0) {
      return this.prisma.city.findMany({
        where: {
          OR: [
            { name: { contains: query.trim(), mode: 'insensitive' } },
            { country: { contains: query.trim(), mode: 'insensitive' } },
            { region: { contains: query.trim(), mode: 'insensitive' } },
          ],
        },
        orderBy: { popularityScore: 'desc' },
      });
    }
    return this.prisma.city.findMany({
      orderBy: { popularityScore: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.city.findUnique({ where: { id } });
  }
}
