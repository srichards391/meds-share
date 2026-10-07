# Meds

A small, installable web app for one job: knowing what to take with breakfast and dinner, and whether you already took it.

- **Today**: two cards, Morning and Evening. Tap a med to mark it taken (it stamps the time). Tap again to undo. "Take all" logs the whole slot. Use ‹ to fix a day you forgot to log.
- **Meds**: add, edit, reorder, pause, delete. Scheduled with breakfast, dinner, or both. Most meds have one dose; a med can instead have a different dose at each meal, a different dose each weekday, or both. Or as needed (PRN).
- **Doses by meal, day and over time**: a med can be 200 mg at breakfast and 600 mg at dinner, or 8 mg on Thursday and Sunday and 6 mg the rest of the week, as one entry. Changing a dose starts on a day you pick; earlier days keep what applied then, and every logged dose keeps the dose it was logged at.
- **As needed**: log a PRN med whenever you take it, as often as needed, at the time you took it. It's never "due" and never counts as missed.
- **History**: last 30 days, adherence percent, day streak. Tap a day to open it.
- **Settings**: breakfast and dinner times, optional sync between devices, calendar reminders, optional push reminders, JSON backup and restore.

No accounts, no server, no build step. Plain HTML, CSS and JavaScript.

> **Not medical advice.** Meds is a personal log. It doesn't check doses, interactions, or refills, and it can't tell you whether to take something. Follow your prescriber's and pharmacist's instructions. Treat reminders as a help, not your only safeguard.

## Your data stays on your device

Everything you enter is saved in your browser's storage on that device. Nothing is sent anywhere unless you turn on sync, and sync uses **your own** GitHub account, encrypted with **your own** passphrase. Whoever hosts the web address can't see your meds: they only serve the app's files.

The flip side: if you delete the app, clear Safari's website data, or lose the phone, the data goes with it. Use Settings → Backup → **Export** now and then, or turn on sync.

## Two ways to use it

### 1. Open a shared link (easiest)

Someone who already hosts Meds sends you the link. Open it and install it (below). That's all.

You get: Today, Meds, History, calendar reminders, backup, and (optional) sync between your own devices. You don't get push reminders: those need your own copy (option 2). Settings says so, and points you to calendar reminders.

Updates arrive when the host updates their copy.

### 2. Make your own copy (needs a free GitHub account)

1. On GitHub, open this repo and click **Use this template → Create a new repository** (or Fork). Name it anything, e.g. `meds`. It must be public for free GitHub Pages.
2. In your new repo: **Settings → Pages → Source: GitHub Actions**.
3. **Actions** tab → "Deploy to GitHub Pages" → **Run workflow** (or push any commit to `main`).
4. Your app is at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

You control updates, and you can add push reminders (below).

## Install it

**iPhone (Safari):** open the link, Share → **Add to Home Screen**. It opens full screen like a native app and works offline.

**Mac (Safari):** open the link, File → **Add to Dock**. Chrome also works: the install icon in the address bar.

**Android (Chrome):** open the link, menu ⋮ → **Install app** (or Add to Home screen).

On iPhone, the Home Screen app has its own storage, separate from Safari. Add your meds in the installed app, not in a Safari tab.

## Sync between your devices (optional)

Each device keeps a full copy. Sync keeps them the same through a private GitHub Gist in **your** GitHub account.

- Your data is **encrypted on the device** with your passphrase (AES-GCM, key from PBKDF2 with 200,000 rounds) before it's uploaded. The gist only holds scrambled text. A secret gist is unlisted, not truly private, which is why the encryption matters.
- The **token and passphrase stay on each device**, in the browser's storage. They are never put in the gist, the repo, or a link.
- It syncs when the app opens, when you come back to it, every 2 minutes while it's on screen, and 2 seconds after any change. Logging a dose saves on the device first, instantly, whether or not there's a connection.
- **Today** shows "Synced 8:14 AM" under the date. If the last sync failed or is more than 10 minutes old, that line turns orange. When you see orange, check your other device before taking anything twice.

**Set up** (once): on github.com → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token. Tick **only** the `gist` scope. Then in Meds → Settings → Sync, paste the token and choose a passphrase, on each device. Use the same passphrase everywhere. The first device creates a gist named `meds-share-sync`; the others find it.

**How conflicts are settled.** Every med, every dose, and the settings carry a "last changed" time. When two copies differ, the newer change wins, record by record. Nothing only one side has is ever dropped. Un-taking a dose is saved as "not taken at 8:05", not deleted, so the undo reaches the other device. A dose is stored once per day, slot, and med, so tapping it on both devices still counts as one dose.

**Limits worth knowing:**
- If you change the *same* schedule start day on two devices before either syncs, the later one wins. Name, notes, and paused/active also go to the later edit as a group.
- "Newer" uses each device's clock. Phones and computers set their clocks automatically, so this is fine unless a clock is set by hand.
- Deleted meds and un-taken doses are forgotten after 90 days. A device that has been offline longer than that could bring an old one back when it reconnects.

**Forgot the passphrase?** Your data is still on each device. On gist.github.com, delete the gist named `meds-share-sync`, then Connect again on each device with a new passphrase.

## Reminders

### Calendar reminders (works everywhere, recommended)

1. Settings → Reminders → **Get file** (on iPhone, do this in Safari, not the Home Screen app).
2. Open the downloaded `meds-reminders.ics` and tap **Add All**.

You get two daily events with alerts at your breakfast and dinner times, listing that meal's meds. Each one links back to the app. If you change times or meds later, delete the two events and get a fresh file.

### Push reminders (optional, own copy only)

Push is **off** in this repo: `config.js` has no key, so the app hides push setup and the reminder workflow does nothing on its schedule. To turn it on in **your own copy**:

1. **Make a key pair** (needs Node 22+): in the repo folder run `cd scripts && npm ci && npx web-push generate-vapid-keys`. It prints a public key and a private key.
2. **Public key** → `config.js`: set `vapidPublicKey` to it, and `pushSubject` to your app's address (e.g. `'https://your-name.github.io/meds/'`). Commit and push.
3. **Private key** → repo **Settings → Secrets and variables → Actions → New repository secret**, named `VAPID_PRIVATE_KEY`.
4. **Your times and time zone** → `.github/workflows/push-reminders.yml`: set `TIME_ZONE` (e.g. `America/Chicago`), `MORNING_TIME`, `EVENING_TIME`, and redo the four cron lines (the file shows the math and examples). Match the times in the app's Settings.
5. **Subscribe each device**: open the installed app (on iPhone, from the Home Screen icon; needs iOS 16.4+) → Settings → Push reminders → **Enable** → Allow. Copy what it shows into a repo secret named `PUSH_SUBSCRIPTION`. For two devices, put both in a list: `[ first , second ]`.
6. **Switch it on**: repo Settings → Secrets and variables → Actions → **Variables** tab → new variable `PUSH_ENABLED` = `true`.
7. **Test**: Actions → Push reminders → Run workflow → `morning`.

Good to know:
- GitHub can't see your meds, so it sends a plain "Morning meds" signal. Your device fills in the meds and doses still to take for that slot, from its own copy of your data. This puts med names on the lock screen; to hide them on iPhone: Settings → Notifications → Meds → Show Previews → When Unlocked.
- If a device's subscription expires, the run fails and GitHub emails you. Enable push again in the app and update the secret.
- **GitHub pauses scheduled workflows after 60 days with no commits.** If reminders stop, Actions → Push reminders → **Enable workflow**.
- GitHub sometimes runs scheduled jobs late (the script still sends up to 45 minutes after the target) and rarely skips one. Keep calendar reminders as a backup.

## Updating an installed copy

On every open, Meds checks the server for a newer version. If there is one, an orange **Update now** banner appears. Tap it. You can also check in Settings → App → **Check for updates**.

If Meds ever says "Meds didn't finish updating", close it completely and open it again. It shows no doses in that state on purpose, so a mix of old and new code can never show a wrong one.

**Releasing a new version** (whoever changes the code): bump `APP_VERSION` in `app.js`, `VERSION` in `sync-core.js`, `CACHE_VERSION` and every `?v=` in `sw.js`, every `?v=` in `index.html`, and `version.json`. `node --test` fails if any of them disagree.

## Backup

Settings → Backup → **Export** downloads everything as JSON. **Import** accepts Meds backup files from any version. With sync on, Import merges the file in (newer wins, nothing deleted) instead of replacing.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page shell: header, tab bar, the add/edit dialog. |
| `app.js` | Everything you see and tap, plus sync and push-subscribe code. |
| `sync-core.js` | The data format, which dose applies on which day, the merge rule, and encryption. No page code, so Node can test it. |
| `config.js` | The public push key (empty = push off). Shared by the app and the reminder sender. |
| `sw.js` | Service worker: offline cache, and shows push notifications with today's doses. |
| `version.json` | The current release number. The app checks it on every open to catch updates. |
| `scripts/` | The push reminder sender, run by GitHub Actions. |
| `tests/` | Node tests for doses by meal and day, schedule history, PRN, the merge, encryption, reminder timing, and storage isolation. |

Storage and cache names all start with `meds-share`, so this app never reads or clears another Meds copy hosted on the same web address.

## Local development

Any static server works:

```
python3 -m http.server 8080
```

then open `http://localhost:8080/`. Run the tests (Node 22 or later, nothing to install):

```
node --test
```
