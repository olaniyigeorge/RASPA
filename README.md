# Rent A Space, [Akure]

## Mission
My goal for this is to build a solution to address four major problems, namely;
- the lengthy time clients spend house hunting.
- the significant stress associated with house hunting.
- the extortionate charges imposed by agents, and
- the lack of a comprehensive database of real estate properties.


## Target Users
Generally speaking, we expect most of our clients to be people who are looking to either rent, buy, sell or invest in properties. From the mission of this project its evident that of all our clients we'll be focusing more on connecting home renters and buyers with home owners.

## Approach 
To profer solutions to these problems, RASP is an app that lets users explore all available properties in their region. Armed with this, and a host of other requirements they deem fit, they can make a choice to rent, buy or invest in a property through a very seamless click-through procedure on our platform. This process might include booking an appointment to see the property, paying for the property online [long shot: take an immersive VR tour of the property], putting up a flag for requirements.

See [docs/project_doc.md](docs/project_doc.md) for the full product documentation.

https://raspa-api-splu.onrender.com/


## Development

A [Next.js](https://nextjs.org) (App Router) app written in TypeScript, organised as domain modules under `src/modules` (identity, listings, discovery, rentals, payments, management, media, verification). Data lives in Postgres via Prisma; auth uses Firebase ID tokens verified server-side, followed by a session cookie signed with `AUTH_SECRET`.

Requires a recent Node.js (see `engines`/Next.js docs for the minimum) and npm.

```bash
npm install                 # install dependencies
cp .env.example .env        # then fill in the values (DATABASE_URL, AUTH_SECRET, Firebase, Cloudinary, Paystack)
npm run prisma:generate     # generate the Prisma client
npm run prisma:migrate      # apply migrations to your dev database
npm run dev                 # start the dev server
```

Other scripts:

- `npm run build` / `npm start` — production build and server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm test` — run unit tests
- `npm run prisma:studio` — browse the database
