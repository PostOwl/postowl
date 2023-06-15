# postowl

Share the story of your life.

- 🧡 Personal journal - just for you
- 💛 Shared letters - with friends and family
- 💚 Public blog - for the world

## Requirements

- Node.js 16+ or other Javascript runtime
- MinIO or other S3-compatible storage solution

## Development

### How to run the app on your computer

1. Clone this repo to a directory on your computer
1. Make sure you have a supported version of nodejs installed (minimum 16.16.0 LTS, 18.16.0 LTS or newer recommended)
1. Run `npm install`
1. Rename `.env.example` to `.env` and adjust accordingly
1. Create the database with `sqlite3 data/db.sqlite3 < schema.sql`
1. Run the dev server and open a new browser tab with `npm run dev -- --open`
1. Sign in with the admin password you set
1. Enjoy creating letters!

### Exploring the database

[Beekeeper studio](https://github.com/beekeeper-studio/beekeeper-studio/releases) is an excellent app for exploring the database.

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Deploy to fly.io

The repo contains the files you need to deploy to fly.io. It will run well on their free plan.

You'll also need to configure an S3 bucket or other compatible object storage for image hosting.

To deploy your own version:

1. Make sure you have `flyctl` installed and you're signed in (see the [Fly docs](https://fly.io/docs/hands-on/install-flyctl/))
1. Run `fly apps create`
    1. Enter a name for your application at the prompt (e.g. `myapp`)
    1. Choose a Fly organization to deploy to
1. Run `fly deploy` as shown below (substitute your own values for the secrets - for `ORIGIN` make sure the subdomain is the name you specified when creating the app above):

```
fly deploy -a myapp \
    --build-secret DB_PATH="./data/db.sqlite3" \
    --build-secret ORIGIN="https://myapp.fly.dev" \
    --build-secret ADMIN_NAME="Your Name" \
    --build-secret ADMIN_EMAIL="you@your.domain" \
    --build-secret ADMIN_PASSWORD="my-super-secret-password" \
    --build-secret S3_ACCESS_KEY="xxxxx" \
    --build-secret S3_SECRET_ACCESS_KEY="xxxxx" \
    --build-secret S3_ENDPOINT="assets.your-domain.com" \
    --build-secret S3_BUCKET="postowl" \
    --build-secret PUBLIC_ASSET_PATH="https://your-asset.com/postowl" \
    --build-secret SMTP_SERVER="smtp.eu.mailgun.org" \
    --build-secret SMTP_PORT="465" \
    --build-secret SMTP_USERNAME="postmaster@mg.your.domain" \
    --build-secret SMTP_PASSWORD="super-secret-smtp-password" \
    --build-secret PUBLIC_ORIGIN="myapp.fly.dev"
```

(The `-a` option in `fly deploy` lets you override the app name specified in `fly.toml`.) 

Fly will let you know when the app is deployed. Visit the URL shown in your terminal and sign in with the ADMIN_PASSWORD you set above. Have fun creating letters!

**TODO**

1. TODO: make start.sh actually migrate the db safely on deployment. (Looking into this approach: https://david.rothlis.net/declarative-schema-migration-for-sqlite/ HN discussion: https://news.ycombinator.com/item?id=31249823)
