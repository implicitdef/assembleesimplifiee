# Le Front

## Stack

- Next.js
- Typescript
- Kysely pour les requêtes SQL
- Tailwind pour le CSS

## Installation / faire tourner en local

Il faut Yarn et NodeJS.

### DB Postgres

Il faut une DB postgres.
Il faut utiliser le projet `db_cli` pour créer les tables dans cette DB et l'alimenter.

### Lancer le frontend

Enfin il faut créér un fichier .env.local en se basant sur le .env.local.sample

Quand tout est prêt :

    # installer les dépendances
    yarn
    # lancer
    yarn dev
    # puis aller sur http://localhost:3000
