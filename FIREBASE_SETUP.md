# Firebase Firestore setup (portfolio contact form)

Follow these steps to store contact form submissions in **Firebase Firestore**.

---

## Step 1: Create a Firebase project

1. Open [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name it (e.g. `shashi-portfolio`)
4. Disable Google Analytics if you do not need it → **Create project**

---

## Step 2: Enable Firestore Database

1. In the left menu, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) → **Next**
4. Pick a region close to you (e.g. `asia-south1` for India) → **Enable**

> **Before production:** update Firestore rules so only your backend can write (see Step 7).

---

## Step 3: Create the service account key (backend access)

1. Click the **gear icon** next to “Project Overview” → **Project settings**
2. Open the **Service accounts** tab
3. Click **Generate new private key** → **Generate key**
4. A JSON file downloads (e.g. `shashi-portfolio-firebase-adminsdk-xxxxx.json`)

---

## Step 4: Add the key to this project

1. Rename/move the downloaded file to:

   ```
   server/firebase-service-account.json
   ```

2. **Never commit this file to Git** (it is already in `.gitignore`).

---

## Step 5: Configure environment variables

1. Copy the example env file:

   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and set Firebase + EmailJS (see **Email setup** below):

   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./server/firebase-service-account.json
   OWNER_EMAIL=vardhans367@gmail.com
   EMAILJS_SERVICE_ID=...
   EMAILJS_PUBLIC_KEY=...
   EMAILJS_PRIVATE_KEY=...
   EMAILJS_TEMPLATE_OWNER=...
   EMAILJS_TEMPLATE_USER=...
   ```

---

## Email setup (EmailJS — no Gmail app password in code)

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. **Email Services** → add **Gmail** → connect your Google account once in their UI
3. **Email Templates** → create two templates:

   **Owner template** (`EMAILJS_TEMPLATE_OWNER`) — sent to you:
   - To: `{{to_email}}`
   - Body: New message from `{{from_name}}` (`{{from_email}}`): `{{message}}`

   **Visitor template** (`EMAILJS_TEMPLATE_USER`) — sent to user:
   - To: `{{to_email}}`
   - Body: Hi `{{customer_name}}`, thanks for your message...

4. **Account** → copy **Public Key** and **Private Key**
5. **Account** → **Security** → enable **Allow API requests from non-browser applications**  
   (Without this, the Node server gets `403` and no email is sent.)
6. If **Strict mode** is enabled, keep `EMAILJS_PRIVATE_KEY` in `.env.local`
7. **Email Services** → copy **Service ID**
8. Add all IDs to `.env.local` (see `.env.example`)

---

## Step 6: Install dependencies and run

```bash
npm install
```

**Terminal 1 — API server:**

```bash
npm run server
```

**Terminal 2 — frontend:**

```bash
npm run dev
```

Submit the contact form on your site. You should see a new document in Firestore under the collection **`contact_submissions`**.

---

## Step 7: View saved messages in Firebase Console

1. **Firestore Database** → **Data**
2. Open collection **`contact_submissions`**
3. Each document has: `name`, `email`, `message`, `createdAt`, `emailsSent`

---

## Step 8: Retry failed emails (optional)

If EmailJS was not configured when someone submitted the form:

```bash
npm run email:pending
```

This finds documents with `emailsSent: false` and sends owner + user emails.

---

## Step 9: Firestore index (if `email:pending` errors)

If you see an index error when running `email:pending`, Firebase will show a link in the terminal to create a composite index for:

- `emailsSent` (Ascending)
- `createdAt` (Ascending)

Click the link and confirm in the Firebase Console.

---

## Step 10: Production security rules (recommended)

Replace test-mode rules with something like this (Firestore → **Rules**):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{document=**} {
      allow read, write: if false;
    }
  }
}
```

Your **Node server** uses the Admin SDK and bypasses these rules. The website never talks to Firestore directly—only your API does—so clients cannot read or write messages.

---

## Deploying without a JSON file (optional)

On Render/Railway/Vercel, set these env vars instead of uploading the JSON file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nLINE1\nLINE2\n-----END PRIVATE KEY-----\n"
```

Copy values from `firebase-service-account.json` (`project_id`, `client_email`, `private_key`).

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `Firebase not configured` | Check JSON path in `.env` and that the file exists |
| `Permission denied` | Regenerate service account key; ensure Firestore is enabled |
| Form works but no email | Set `EMAILJS_*` keys in `.env` and connect Gmail in EmailJS dashboard |
| CORS error | Add your site URL to `CLIENT_URL` in `.env` |
