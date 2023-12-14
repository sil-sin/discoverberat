import * as admin from 'firebase-admin'

export const initializeAdmin = () => {
  const cleanObject = (obj: Record<string, string | undefined>) => {
    const cleanedObject: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleanedObject[key] = key.includes('private_key')
          ? value.replace(/\\n/g, '\n')
          : value
      }
    }
    return cleanedObject
  }

  const serviceAccount = cleanObject({
    type: 'service_account',
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com',
  })

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://discover-berat.firebaseio.com',
    })
  }
}
initializeAdmin()

export const adminSDK = admin
