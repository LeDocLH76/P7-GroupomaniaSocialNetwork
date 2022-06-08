# P7-GroupomaniaSocialNetwork
### Instructions pour le test du projet
```
Cloner le dépot dans le repertoire de votre choix.
Avoir postgresql installé et en marche sur le port:5432.
Avec psql user postgres executer la commande SQL: CREATE DATABASE gmsn.
```
### Pour le serveur:
```
Depuis le répertoire d'installation > cd P7*/serveur.
Créer le fichier .env et le remplir avec les données fournies dans le fichier déposé sur le site OC ou envoyées par email.
Dans le fichier .env modifier le mot de passe postgres avec le votre.
Installer les dépendances: npm install.
Migrer les tables sur la base de données gmsn: npx prisma migrate dev --name migration-init.
Remplir les champs des tables pour tester avec de fausses données: npx prisma db seed.
Le user admin est créé lors du seed: email et password dans le .env non présent sur Git.
```
