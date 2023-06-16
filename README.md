# postowl

Share the story of your life.

- 🧡 Personal journal - just for you
- 💛 Shared letters - with friends and family
- 💚 Public blog - for the world

## Requirements

- Node.js 18+ LTS or other Javascript runtime

## Development

### How to run the app on your computer

1. Clone this repo to a directory on your computer
1. Make sure you have a supported version of nodejs installed (minimum 16.16.0 LTS, 18.16.0 LTS or newer recommended)
1. Run `npm install`
1. Rename `.env.example` to `.env` and adjust accordingly
1. Create the database with `sqlite3 data/db.sqlite3 < schema.sql`
1. Run the dev server and open a new browser tab with `npm run dev -- --open`
1. Sign in with the ADMIN_PASSWORD you set in `.env`
1. Enjoy creating letters!

### Exploring the database

[Beekeeper studio](https://github.com/beekeeper-studio/beekeeper-studio/releases) is an excellent app for exploring the database.

### Sending emails in development

PostOwl sends emails when you share a letter with friends.

In development we recommend using [mailpit](https://github.com/axllent/mailpit) to test email sending without sending real emails.

1. Install [mailpit](https://github.com/axllent/mailpit)
1. Make sure mailpit is running (if installed with Homebrew on macOS run `brew services start axllent/apps/mailpit`)
1. Visit http://localhost:8025 to see the admin interface
1. Configure `.env` with the examples shown for mailpit in `.env.example`
1. Start the local development server with `npm run dev` - the app is now running in `dev` mode and emails can be sent without encryption
1. Create a letter and send to a friend
1. View the email in the mailpit web interface at http://localhost:8025

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Deploy to fly.io

The repo contains the files you need to deploy to fly.io. It will run well on their free plan.

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
