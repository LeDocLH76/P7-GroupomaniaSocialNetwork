const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const load = async () => {
   try {
      //Reset db
      await prisma.users.deleteMany();
      await prisma.posts.deleteMany();
      await prisma.comments.deleteMany();
      await prisma.session.deleteMany();
      await prisma.$queryRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE posts_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE comments_id_seq RESTART WITH 1`;

      const passwordHash = await bcrypt.hash('$aB123', 10); // Le meme mot de passe pour tous => $aB123

      const maxCount = 10; // Nombre d'utilisateurs et posts créés
      //Insert n x (user, profil, post)

      for (let index = 0; index < maxCount; index++) {
         let name = faker.name.firstName();
         let lastname = faker.name.lastName();

         await prisma.users.create({
            data: {
               pseudo: faker.internet.userName(name, lastname),
               email: faker.internet.email(lastname, name),
               password: passwordHash,
               posts: {
                  create: {
                     body: faker.lorem.paragraphs(1),
                  },
               },
            },
         });
      }

      for (let index = 0; index < maxCount; index++) {
         let user = maxCount + 2;
         if (user > maxCount) {
            user = user - maxCount;
         }

         await prisma.comments.create({
            data: {
               body: faker.lorem.paragraphs(1),
               postId: index + 1,
               userId: user,
            },
         });
      }
   } catch (error) {
      console.error(error);
      process.exit();
   } finally {
      await prisma.$disconnect();
   }
};

load();
