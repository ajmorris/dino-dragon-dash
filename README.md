# Dino Dragon Dash

A timed multiplication game for kids. Pick a dinosaur or a dragon, choose how high the facts go (up to 5, 10, 12, or 20) and how long the round lasts (30, 60, or 90 seconds), then answer as many as you can. Answer by typing on a number pad, or by tapping one of five choices. The score is the number of correct answers in that time. The game keeps a separate best for each theme, range, time, and answer style on this device and asks the player to beat it.

There is no account and no database. Scores stay in the browser’s local storage.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Both the number pad and the five choices are built for touch: large targets, no system keyboard.

```bash
npm test
npm run lint
```

## Host on Vercel

This is a Next.js app with no environment variables.

1. Push the repository to GitHub.
2. In Vercel, import the repository.
3. Leave the framework preset on Next.js and do not add environment variables.
4. Deploy.

Vercel builds with `npm run build` and serves the app. Best scores are still stored on each player’s device, not on the server.
