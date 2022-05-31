const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

let users = [
   {
      pseudo: 'Basile',
      email: 'Basile',
      motDePasse: '123',
   },
   {
      pseudo: 'Geneviève',
      email: 'Geneviève',
      motDePasse: '123',
   },
   {
      pseudo: 'Odilon',
      email: 'Odilon',
      motDePasse: '123',
   },
   {
      pseudo: 'Edouard',
      email: 'Edouard',
      motDePasse: '123',
   },
   {
      pseudo: 'Epiphanie',
      email: 'Epiphanie',
      motDePasse: '123',
   },
   {
      pseudo: 'Raymond',
      email: 'Raymond',
      motDePasse: '123',
   },
   {
      pseudo: 'Lucien',
      email: 'Lucien',
      motDePasse: '123',
   },
   {
      pseudo: 'Alix',
      email: 'Alix',
      motDePasse: '123',
   },
   {
      pseudo: 'Guillaume',
      email: 'Guillaume',
      motDePasse: '123',
   },
   {
      pseudo: 'Paulin',
      email: 'Paulin',
      motDePasse: '123',
   },
];
let profils = [
   {
      name: 'Nom de Basile',
      surname: 'Prénom de Basile',
      userId: 1,
   },
   {
      name: 'Nom de Geneviève',
      surname: 'Prénom de Geneviève',
      userId: 2,
   },
   {
      name: 'Nom de Odilon',
      surname: 'Prénom de Odilon',
      userId: 3,
   },
   {
      name: 'Nom de Edouard',
      surname: 'Prénom de Edouard',
      userId: 4,
   },
   {
      name: 'Nom de Epiphanie',
      surname: 'Prénom de Epiphanie',
      userId: 5,
   },
   {
      name: 'Nom de Raymond',
      surname: 'Prénom de Raymond',
      userId: 6,
   },
   {
      name: 'Nom de Lucien',
      surname: 'Prénom de Lucien',
      userId: 7,
   },
   {
      name: 'Nom de Alix',
      surname: 'Prénom de Alix',
      userId: 8,
   },
   {
      name: 'Nom de Guillaume',
      surname: 'Prénom de Guillaume',
      userId: 9,
   },
   {
      name: 'Nom de Paulin',
      surname: 'Prénom de Paulin',
      userId: 10,
   },
];
let posts = [
   {
      text: 'Le premier post de Basile',
      userId: 1,
   },
   {
      text: 'Le premier post de Geneviève',
      userId: 2,
   },
   {
      text: 'Le premier post de Odilon',
      userId: 3,
   },
   {
      text: 'Le premier post de Edouard',
      userId: 4,
   },
   {
      text: 'Le premier post de Epiphanie',
      userId: 5,
   },
   {
      text: 'Le premier post de Raymond',
      userId: 6,
   },
   {
      text: 'Le premier post de Lucien',
      userId: 7,
   },
   {
      text: 'Le premier post de Alix',
      userId: 8,
   },
   {
      text: 'Le premier post de Guillaume',
      userId: 9,
   },
   {
      text: 'Le premier post de Paulin',
      userId: 10,
   },
];

const load = async () => {
   try {
      await prisma.users.deleteMany();
      console.log('users éffacé');
      await prisma.profils.deleteMany();
      console.log('profils éffacé');
      await prisma.posts.deleteMany();
      console.log('posts éffacé');
      await prisma.$queryRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE profils_id_seq RESTART WITH 1`;
      await prisma.$queryRaw`ALTER SEQUENCE posts_id_seq RESTART WITH 1`;

      await prisma.users.createMany({
         data: users,
      });
      console.log('10 users créés');

      await prisma.profils.createMany({
         data: profils,
      });
      console.log('10 profils créés');

      await prisma.posts.createMany({
         data: posts,
      });
      console.log('10 posts créés');
   } catch (error) {
      console.error(error);
   } finally {
      await prisma.$disconnect();
   }
};

load();
