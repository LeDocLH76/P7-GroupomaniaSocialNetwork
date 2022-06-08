# P7-GroupomaniaSocialNetwork
Instructions pour le test du projet
Cloner le dépot dans le repertoire de votre choix
Avoir postgresql installé et en marche sur le port:5432
Avec pgsql user postgre: CREATE DATABASE gmsn
Pour le serveur:
Depuis le répertoire d'installation > cd P7*/serveur
npm install
npx prisma migrate dev --name migration-init
npx prisma db seed
