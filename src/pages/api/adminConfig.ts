// api/adminConfig.ts

import * as admin from 'firebase-admin'

const serviceAccount = require('./discoverBeratAdmin.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://discover-berat.firebaseio.com',
  })
}

export const adminSDK = admin
