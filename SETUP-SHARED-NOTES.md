# Making the gaathayein notes shared (for everyone)

The site now stores notes on the server, not in each person's browser.

- **On your laptop (`npm run dev`)** it saves to a file (`.data/notes.json`), so it already works, but only on your machine.
- **When the site is online**, a file won't survive, so notes need a small free database. We use Supabase.

## One-time setup (about 5 minutes, you do this part)

1. Go to https://supabase.com and make a free account, then **New project** (any name, any password, pick a nearby region).
2. In the project, open **SQL Editor** and run this once:

   ```sql
   create table notes (
     id text primary key,
     text text not null default '',
     updated_at bigint not null
   );
   alter table notes enable row level security;
   ```

3. Open **Project Settings → API**. Copy two things:
   - **Project URL**
   - **service_role key** (keep this secret, never share or post it)
4. Where the site is hosted (e.g. Vercel → Project → Settings → Environment Variables), add:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | the Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role key |

   To test it on your laptop first, put the same two lines in a file called `.env.local` in this folder:

   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

   then restart `npm run dev`.

## Good to know

- Anyone with the link can read, add, edit and delete any note. There is no login, so share the link only with people you trust.
- Limits: 6000 characters per note, 500 notes total.
- The page checks for new notes every 5 seconds.
