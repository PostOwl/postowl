# postowl

A minimalistic software for sharing the story of your life.

- 🧡 Personal journal - just for you
- 💛 Shared letters - with friends and family
- 💚 Public blog - for the world

## Step 0 - Requirements

- Node.js 16+ or other Javascript runtime
- Postgres 14+
- MinIO or other S3-compatible storage solution

## Step 1 - Development setup

This is a full-fledged webapp you want adjust to your own needs. So please **create a copy** or fork of the source code and rename the project accordingly. Then check out your own copy.

```bash
git clone https://github.com/your-user/your-website.git
cd your-website
```

Create a `.env` file and set the folllowing environment variables pointing to your development database and MinIO instance.

```bash
VITE_DB_URL=postgresql://$USER@localhost:5432/editable-website
VITE_S3_ACCESS_KEY=000000000000000000
VITE_S3_SECRET_ACCESS_KEY=00000000000000000000000000000000000000
VITE_S3_ENDPOINT=https://minio.ew-dev-assets--000000000000.addon.code.run
VITE_S3_BUCKET=editable-website
VITE_ASSET_PATH=https://minio.ew-dev-assets--000000000000.addon.code.run/editable-website
VITE_ADMIN_PASSWORD=00000000000000000000000000000000000000
```

Seed the database:

```bash
psql -h localhost -U $USER -d editable-website -a -f sql/schema.sql
```

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

To create and test a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Step 3 - Deployment

I will describe the steps to deploy to [Northflank](https://northflank.com/) (which I am using). I recommend to assign 0.2 vCPU and 512MB RAM to each resource (~ $17/month) but you can go lower to save some costs or higher if you expect your site to have significant traffic.

1. Create instances for Postgres 14 and MinIO through the Northflank user interface.

2. Create a combined service, select the Heroku buildpack and assign the environment variables as they are exposed by the Postgres and MinIO addons. Use the same environment variables during the build step and runtime (yes you have to type them twice).

You can deploy your editable website anywhere else as well. For instance if you'd like to go the "Serverless" path, you can deploy on Vercel, and use NeonDB (or DigitalOcean with Connection Pooling activated). You may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.