const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });
const { faker } = require('@faker-js/faker');

const load = async () => {
   try {
      //Reset db
      await prisma.users.deleteMany();
      await prisma.profils.deleteMany();
      await prisma.posts.deleteMany();
      await prisma.session.deleteMany();
      await prisma.$queryRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE profils_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE posts_id_seq RESTART WITH 1`;

      //Insert n x (user, profil, post)
      for (let index = 0; index < 10; index++) {
         let name = faker.name.firstName();
         let lastname = faker.name.lastName();

         await prisma.users.create({
            data: {
               pseudo: faker.internet.userName(name, lastname),
               email: faker.internet.email(lastname, name),
               password: '$aB123',
               profils: {
                  create: {
                     firstName: name,
                     lastName: lastname,
                  },
               },
               posts: {
                  create: {
                     body: faker.lorem.paragraphs(2),
                  },
               },
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
