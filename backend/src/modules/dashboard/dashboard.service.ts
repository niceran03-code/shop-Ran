import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [totalProducts, totalCategories, activeAdmins] = await Promise.all([
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.category.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    const categoryDistribution = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          where: { deletedAt: null },
          select: { id: true },
        },
      },
    });
    const categoryStats = categoryDistribution.map((c) => ({
      name: c.name,
      value: c.products.length,
    }));

    const trend7d = await this.prisma.$queryRaw<
      Array<{ day: string; count: bigint }>
    >`
      SELECT
        to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day,
        COUNT(*)::bigint as count
      FROM "Product"
      WHERE "deletedAt" IS NULL
        AND "createdAt" >= NOW() - interval '6 days'
      GROUP BY date_trunc('day', "createdAt")
      ORDER BY date_trunc('day', "createdAt") ASC
    `;

    const map = new Map(trend7d.map((r) => [r.day, Number(r.count)]));
    const days: { day: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      days.push({ day: key, count: map.get(key) ?? 0 });
    }

    return {
      totalProducts,
      totalCategories,
      activeAdmins,
      trend7d: days,
      categoryStats,
    };
  }
}
