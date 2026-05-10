import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.tagOnResource.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@edushare.com',
      password: hashedPassword,
      role: 'ADMIN',
      tier: 'PRO',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const contributor = await prisma.user.create({
    data: {
      name: 'Top Contributor',
      email: 'contributor@edushare.com',
      password: hashedPassword,
      role: 'CONTRIBUTOR',
      tier: 'FREE',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Contributor',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Regular Learner',
      email: 'user@edushare.com',
      password: hashedPassword,
      role: 'USER',
      tier: 'FREE',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    },
  });

  // Create Tags
  const tags = await Promise.all([
    'react', 'nextjs', 'typescript', 'python', 'machine-learning', 'ui-ux', 'database'
  ].map(name => prisma.tag.create({ data: { name } })));

  // Create Resources
  const resourcesData = [
    {
      title: 'React Server Components in Next.js 14',
      description: 'A comprehensive guide to understanding and using React Server Components.',
      url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
      type: 'LINK' as const,
      status: 'APPROVED' as const,
      summary: 'Learn how to leverage React Server Components for better performance and SEO in Next.js 14 applications.',
      qualityScore: 95,
      viewCount: 1250,
      authorId: contributor.id,
      tagIndexes: [0, 1]
    },
    {
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced type manipulation in TypeScript.',
      url: 'https://www.typescriptlang.org/docs/handbook/advanced-types.html',
      type: 'LINK' as const,
      status: 'APPROVED' as const,
      summary: 'Explore conditional types, mapped types, and utility types to write safer and more expressive TypeScript code.',
      qualityScore: 88,
      viewCount: 850,
      authorId: contributor.id,
      tagIndexes: [2]
    },
    {
      title: 'Machine Learning Basics - Video Course',
      description: 'Great introductory course for ML concepts.',
      url: 'https://www.youtube.com/watch?v=GwIoAwNZlzM',
      type: 'VIDEO' as const,
      status: 'APPROVED' as const,
      summary: 'A beginner-friendly video tutorial covering fundamental machine learning algorithms and concepts using Python.',
      qualityScore: 92,
      viewCount: 2100,
      authorId: admin.id,
      tagIndexes: [3, 4]
    },
    {
      title: 'PostgreSQL Performance Tuning',
      description: 'How to optimize your DB queries.',
      url: 'https://www.postgresql.org/docs/current/performance-tips.html',
      type: 'ARTICLE' as const,
      status: 'PENDING' as const,
      summary: 'Tips and tricks for indexing, query optimization, and configuration tuning in PostgreSQL databases.',
      qualityScore: 75,
      viewCount: 45,
      authorId: user.id,
      tagIndexes: [6]
    }
  ];

  for (const resData of resourcesData) {
    const { tagIndexes, ...resourceProps } = resData;
    
    const resource = await prisma.resource.create({
      data: {
        ...resourceProps,
        tags: {
          create: tagIndexes.map(idx => ({ tagId: tags[idx].id }))
        }
      }
    });

    // Add some votes and comments to APPROVED resources
    if (resource.status === 'APPROVED') {
      await prisma.vote.create({
        data: { type: 'UP', userId: user.id, resourceId: resource.id }
      });

      await prisma.comment.create({
        data: {
          content: 'This is an incredible resource! Really helped me understand the concepts better.',
          userId: user.id,
          resourceId: resource.id
        }
      });
    }
  }

  console.log('Database seeded successfully!');
  console.log('-------------------------------------------');
  console.log('Admin login: admin@edushare.com / password123');
  console.log('Contributor: contributor@edushare.com / password123');
  console.log('User login: user@edushare.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
