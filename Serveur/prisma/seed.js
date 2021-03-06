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

      const passwordHash = await bcrypt.hash(process.env.PASSWORD_FAKE_USER, 10); // Le même mot de passe pour tous

      const maxCount = 10; // Nombre d'utilisateurs et posts créés
      //Insert n x (user, post, comment)

      for (let index = 0; index < maxCount; index++) {
         let name = faker.name.firstName();
         let lastname = faker.name.lastName();

         await prisma.users.create({
            data: {
               pseudo: faker.internet.userName(name, lastname),
               email: faker.internet.email(lastname, name),
               password: passwordHash,
               avatar: faker.image.avatar(),
               posts: {
                  create: {
                     body: faker.lorem.paragraphs(1),
                     picture: [
                        faker.image.imageUrl(640, 480, 'cat', true),
                        faker.image.imageUrl(640, 480, 'dog', true),
                        faker.image.imageUrl(640, 480, 'fish', true),
                     ],
                  },
               },
            },
         });
      }

      // Création des commentaires.
      // Le user 1 est proprietaire du post 1.
      // Il est commenté par le user 2.
      // A la fin le user n est proprietaire du post n.
      // Celui-ci est commenté par le user 1
      for (let index = 0; index < maxCount; index++) {
         let user = index + 2;
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

      // Création ADMIN
      const email = process.env.EMAIL_ADMIN;
      const password = process.env.PASSWORD_ADMIN;
      const adminPasswordHash = await bcrypt.hash(password, 10);
      await prisma.users.create({
         data: {
            pseudo: 'Admin',
            email: email,
            password: adminPasswordHash,
            role: 'admin',
            avatar: 'http://localhost:3001/fakeImages/boite_a_outils.jpg',
         },
      });
   } catch (error) {
      console.error(error);
      process.exit();
   } finally {
      await prisma.$disconnect();
   }
};

load();
