import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLLECTION = process.env.FIREBASE_COLLECTION || "contact_submissions";

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, "firebase-service-account.json");

  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, "utf8")
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    throw new Error(
      "Firebase not configured. Add server/firebase-service-account.json or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env"
    );
  }

  db = admin.firestore();
  return db;
}

function getDb() {
  if (!db) {
    return initFirebase();
  }
  return db;
}

export async function saveContactSubmission({ name, email, message }) {
  const firestore = getDb();
  const docRef = await firestore.collection(COLLECTION).add({
    name,
    email,
    message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    emailsSent: false,
  });

  const snap = await docRef.get();
  const data = snap.data();

  return {
    id: docRef.id,
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    emailsSent: data.emailsSent ?? false,
  };
}

export async function markEmailsSent(id) {
  const firestore = getDb();
  await firestore.collection(COLLECTION).doc(id).update({
    emailsSent: true,
    emailedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
