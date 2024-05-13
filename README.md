## Getting Started

First, Install packages and install sequelize-cli globally:
```bash
npm install
#or
yarn install

npm install -g sequelize-cli
```

Second, create database at postgres with name `palmcode` and create .env file and add the following:
```bash
PORT=8080
NODE_ENV=development
JWTUSERSECRETTOKEN=palmcodeuser
JWTUSERROLE=USER
JWTADMINROLE=ADMIN
JWTADMINSECRETTOKEN=palmcodeadmin
```

Third Your Database Configuration in /config/config.json file:

Fourth Run migration:
```bash
npx sequelize-cli db:migrate
#or
sequelize db:migrate
```

Fifth, run the seed:
```bash
npx sequelize-cli db:seed:all
#or
sequelize db:seed:all
```

Sixth, create the folder /uploads:
```bash
mkdir uploads
```

Seven, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:8080](http://localhost:3000) with your browser to see the result.
