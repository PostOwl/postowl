# PostOwl 🦉

Share the story of your life.

- 🧡 Personal journal - just for you
- 💛 Shared letters - with friends and family
- 💚 Public blog - for the world

## Developing

PostOwl is a [SvelteKit](https://kit.svelte.dev/) application inspired by [editable.website](https://editable.website) using [SQLite](https://www.sqlite.org/) for the database. It's currently optimised for SvelteKit's [adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) to enable [deployment to Fly.io](#deployment-to-flyio).

### Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org) (minimum 16.20.0 LTS or 18.16.0 LTS recommended) or other JavaScript runtime (not tested).
- [SQLite](https://www.sqlite.org)

### How to run PostOwl in development mode on your computer

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
1. Make sure mailpit is running (if installed with Homebrew on macOS run `mailpit`)
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

PostOwl uses [nodemailer](https://nodemailer.com/about/) to send email notifications when you send letters to friends.

The application will run without a real SMTP server configured so **you can enter dummy data for the SMTP settings when deploying if you don't need to send emails**.

If you'd like to send emails but don't have an SMTP server to use, we recommend [mailgun](https://www.mailgun.com/). Their free tier will cover usage for a personal PostOwl site. You'll need to own a domain name to get set up with mailgun. Follow their documentation to activate your domain for email sending. Then generate an SMTP password from their admin interface (click 'Reset password' under Sending > Domain Settings > SMTP credentials to get a password for a new domain).

### Deployment to fly.io

This repo contains the files you need to deploy your PostOwl site to [fly.io](https://fly.io/).

1. Create an account with [fly.io](https://fly.io/).
    1. Add your credit card to Fly. PostOwl runs well on Fly's free tier but they [require an active, valid credit / bank card](https://fly.io/docs/about/credit-cards/) to prevent abuse. Unless you have a very busy site, hosting will be free.
1. [Install `flyctl`](https://fly.io/docs/hands-on/install-flyctl/) and sign in with `fly auth login`
1. Clone this repo to a directory on your computer: `git clone https://github.com/PostOwl/postowl.git`
1. Enter the directory you cloned the repo to: `cd postowl`
1. Run `fly apps create` and respond to the prompts:
   1. Choose a name for your app (e.g. `yourapp`- app names need to be unique across all of fly.io) or hit enter to let Fly auto generate a name
   1. Choose a Fly organization to deploy to if prompted
1. Rename `fly.toml.example` to `fly.toml` and edit the lines between 'BEGIN EDITS' and 'END EDITS' - make sure to set the app name to the name you chose in the previous step
1. Edit the values in the 'fly deploy' command below and then run it in your terminal
    1. Don't change the value of `DB_PATH`
    1. Make sure to replace `yourapp` with the name you chose when creating the application above
    1. Edit all remaining values with `your` in them
    1. For the SMTP details, see the section above [Sending email in production](#sending-email-in-production). You don't need to use real values to try the app

```
fly deploy \
    --build-secret DB_PATH="./data/db.sqlite3" \
    --build-secret ORIGIN="https://yourapp.fly.dev" \
    --build-secret ADMIN_NAME="Your Name" \
    --build-secret ADMIN_EMAIL="you@your.domain" \
    --build-secret ADMIN_PASSWORD="your-super-secret-admin-password" \
    --build-secret SMTP_SERVER="your.smtp.server" \
    --build-secret SMTP_PORT="465" \
    --build-secret SMTP_USERNAME="postmaster@your.smtp.server" \
    --build-secret SMTP_PASSWORD="your-super-secret-smtp-password"

########################################################################################
# ATTENTION: On each subsequent deploy you need to apply the previous command again,   #
# including all the --build-secret entries. We are looking for ways to improve this.   #
# We had situations where the deploy got stuck, but re-running the command fixed it.   #
########################################################################################
```

Fly will let you know when the app is deployed. Visit the URL shown in your terminal and sign in with the `ADMIN_PASSWORD` you set above.

Have fun creating letters! 🦉

## Connect a domain to your Fly.io app

- Run `fly ips list -a myapp` to get the IPv4 and IPv6 addresses.
- Head over to your DNS provider and add A and AAAA records for myapp.com with the IPv4 and IPv6 values.
- Run `fly certs create -a myapp myapp.com`
- Run `fly certs show -a myapp myapp.com` to watch your certificates being issued.

## Fly.io Backups

You can pull a backup locally and run it to check if it is valid. That's also quite useful for developing/testing against the latest production data. For the best experience, keep your database small. ;)

1. Make a snapshot remotely
   - `fly ssh console`
   - `sqlite3 data/db.sqlite3 ".backup data/backup-db.sqlite3"`
   - `sqlite3 data/backup-db.sqlite3 "PRAGMA integrity_check;"` (optional integrity check)
   - Exit the remote console (CTRL+D)
1. Download the database and test it with your local instance
   - `rm -rf data/db.*` (careful, this wipe the database files locally)
   - `fly sftp get data/db.sqlite3 data/db.sqlite3` (and puts the downloaded backup in place)

To restore a backup in production, you need to be a bit careful and follow these steps (your site could be down for a few minutes during the restore).

1. Make sure nobody writes to the app
1. Make a backup remotely (in case something goes wrong)
   - `fly ssh console`
   - `sqlite3 data/db.sqlite3 ".backup data/backup-db.sqlite3"`
   - `sqlite3 data/backup-db.sqlite3 "PRAGMA integrity_check;"` (optional integrity check)
   - `rm -rf data/db.*` (this removes the current database files, not the backup)
   - Exit the remote console (CTRL+D)
1. Copy your local db.sqlite3 file to production using SFTP
   - `sqlite3 data/db.sqlite3 ".backup data/backup-db.sqlite3"`
   - `rm -rf data/db*`
   - `mv data/backup-db.sqlite3 data/db.sqlite3` (the first 3 commands make sure db.sqlite3 has the very latest state)
   - `fly sftp shell`
   - `cd app/data`
   - `put data/db.sqlite3`
   - Exit SFTP client (CTRL+D)
1. Restart the app (so that the new DB gets picked up)
   - `fly apps restart`
