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
1. Make sure you have a supported version of nodejs installed (minimum 16.16.0 LTS, 18.15.0 LTS or newer recommended)
1. Run `npm install`
1. Rename `.env.example` to `.env` and adjust accordingly
1. Create the database with `sqlite3 data/db.sqlite3 < schema.sql`
1. Run the dev server and open a new browser tab with `npm run dev -- --open`
1. Have fun editing and creating questions

### Exploring the database

[Beekeeper studio](https://github.com/beekeeper-studio/beekeeper-studio/releases) is an excellent app for exploring the database.

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Deploy to fly.io

This app is currently deployed to https://pcqa.fly.dev/

WORK IN PROGRESS: This is currently a proof of concept and needs refining!

To deploy your own version:

1. Make sure you have `flyctl` installed and you're signed in (see the [Fly docs](https://fly.io/docs/hands-on/install-flyctl/))
1. Run `fly launch` and choose the Organization you'd like to deploy to. Accept all the defaults.
1. Change the value of `ORIGIN` in fly.toml to be the name of the app you're deploying to on Fly
1. Run `fly deploy` and it should 'just work'!
1. TODO: make scripts/migrate.sh actually migrate the db safely
