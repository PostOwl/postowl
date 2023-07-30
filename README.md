# PostOwl 🦉

PostOwl is an open-source web application that let's you create your own website for:

- blogging (public posts)
- sharing letters (share secret links with friends and notify them by email)
- keeping a journal or diary (private posts)

All your writing in one place!

A key feature of PostOwl is 'in-place' editing that makes it super easy and fast to update your site.

Learn more about PostOwl on the website: https://www.postowl.com

## Get your own PostOwl website

PostOwl is open-source software so you can deploy it to any web host you wish.

We'll be releasing a hosted version soon. [Join the email newsletter](https://www.postowl.com/newsletter/) to hear when it's ready.

### Deploy to fly.io

**PostOwl runs for free on [fly.io](https://fly.io/)** which is one of the reasons we're recommending their platform for the first release. If you [follow the steps on the documentation website](https://www.postowl.com/docs/administration-guide/deploy/) you should have a live site in about 15 minutes.

## Get updates by email

Hear about new releases and what's going on in the PostOwl community by [joining the email newsletter](https://www.postowl.com/newsletter/).

## Developing

### Technology

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

### Why aren't there any tests?!

We can't promise we won't add tests in the future 😉

More seriously: PostOwl is currently an early technical preview, so we've been moving fast and breaking things.

### Why is this in JavaScript not TypeScript - don't you know it's 2023?!

We like JavaScript. That doesn't mean that PostOwl might not be converted to TypeScript sometime in the future.

## Contributing

New contributors welcome! Join the [Discussions](https://github.com/PostOwl/postowl/discussions/) or submit a PR. (We have opinions about what should be included in PostOwl, so it's best to discuss with first to see if a new feature will be accepted.)
