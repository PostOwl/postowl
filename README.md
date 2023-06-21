# PostOwl 🦉

Share the story of your life.

- 🧡 Personal journal - just for you
- 💛 Shared letters - with friends and family
- 💚 Public blog - for the world

## Developing

PostOwl is a [sveltekit](https://kit.svelte.dev/) application that uses [SQLite](https://www.sqlite.org/) for the database. It's currently optimised for sveltekit's [adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) to enable [deployment to fly.io](#deployment-to-flyio).

### Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org) (minimum 16.20.0 LTS or 18.16.0 LTS recommended) or other JavaScript runtime (not tested).
- [SQLite](https://www.sqlite.org)

### How to run PostOwl in development mode on your computer

1. Make sure you have a supported version of Node.js installed (minimum 16.20.0 LTS, 18.16.0 LTS or newer recommended)
1. Clone this repo to a directory on your computer: `git clone https://github.com/PostOwl/postowl.git`
1. Enter the directory you cloned the repo to: `cd postowl`
1. Run `npm install`
1. Rename `.env.example` to `.env` and edit for your environment
1. Create the database with `sqlite3 data/db.sqlite3 < scripts/schema.sql`
1. Run the dev server and open a new browser tab with `npm run dev -- --open`
1. Sign in with the ADMIN_PASSWORD you set in `.env`

### Exploring the database

PostOwl uses SQLite. [Beekeeper studio](https://github.com/beekeeper-studio/beekeeper-studio/releases) is an excellent app for exploring the database during development.

### Sending emails in development

PostOwl sends emails when you share a letter with friends.

In development we recommend using [mailpit](https://github.com/axllent/mailpit) to test email without sending real emails.

1. Install [mailpit](https://github.com/axllent/mailpit)
1. Make sure mailpit is running (if installed with Homebrew on macOS run `brew services start axllent/apps/mailpit`)
1. Configure `.env` with the examples shown for mailpit in `.env.example`
1. Start the local development server with `npm run dev` - the app is now running in `dev` mode and emails can be sent without encryption
1. Use PostOwl to add a friend at http://localhost:5173/friends
1. Create and send them a letter
1. View the email they would have received in the mailpit web interface at http://localhost:8025

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

We currently recommend deploying to [fly.io](https://fly.io/) as PostOwl runs well on their free tier.

If you have success **deploying to other platforms**, please [let us know](https://github.com/PostOwl/postowl/discussions/categories/show-and-tell) or submit a PR documenting how you did it.

### Sending email in production

PostOwl uses [nodemailer](https://nodemailer.com/about/) to send email notifications when you send letters to friends. The application will run without a real SMTP server configured so you can enter dummy data for the SMTP settings when deploying if you don't need to send emails.

If you'd like to send emails but don't have an SMTP server to use, we recommend [mailgun](https://www.mailgun.com/). Their free tier will cover usage for a personal PostOwl site. You'll need to own a domain name to get set up with mailgun. Follow their documentation to activate your domain for email sending. Then generate an SMTP password from their admin interface (click 'Reset password' under Sending > Domain Settings > SMTP credentials to get a password for a new domain).

### Deployment to fly.io

This repo contains the files you need to deploy your PostOwl site to [fly.io](https://fly.io/).

1. Create an account with [fly.io](https://fly.io/). (Fly [require an active, valid credit / bank card](https://fly.io/docs/about/credit-cards/) to prevent abuse, but PostOwl runs well on their free tier. Unless you have a very busy site, hosting will be free.)
1. [Install `flyctl`](https://fly.io/docs/hands-on/install-flyctl/) and sign in with `fly auth login`
1. Clone this repo to a directory on your computer: `git clone https://github.com/PostOwl/postowl.git`
1. Enter the directory you cloned the repo to: `cd postowl`
1. Run `fly apps create`
   1. Enter a name for your application at the prompt (e.g. `myapp`)
   1. Choose a Fly organization to deploy to
1. Run `fly deploy` as shown below. **Substitute your own values for the secrets** and make sure to replace all instances of `myapp` with the name you chose when creating the application above:

```
fly deploy -a myapp \
    --build-secret DB_PATH="./data/db.sqlite3" \
    --build-secret ORIGIN="https://myapp.fly.dev" \
    --build-secret PUBLIC_ORIGIN="myapp.fly.dev" \
    --build-secret ADMIN_NAME="Your Name" \
    --build-secret ADMIN_EMAIL="you@your.domain" \
    --build-secret ADMIN_PASSWORD="your-super-secret-admin-password" \
    --build-secret SMTP_SERVER="your.smtp.server" \
    --build-secret SMTP_PORT="465" \
    --build-secret SMTP_USERNAME="postmaster@your.smtp.server" \
    --build-secret SMTP_PASSWORD="your-super-secret-smtp-password"
```

The `-a` option in `fly deploy` lets you override the app name specified in `fly.toml`.

Fly will let you know when the app is deployed. Visit the URL shown in your terminal and sign in with the `ADMIN_PASSWORD` you set above.

Have fun creating letters! 🦉

#### Using your own domain name

TODO: document using your own domain name with fly.io

#### Backups

TODO: document how to backup your site on fly.io

#### Upgrading

TODO: document how to upgrade your site on fly.io
