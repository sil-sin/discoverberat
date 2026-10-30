const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Your email or password is wrong.',
  'auth/invalid-login-credentials': 'Your email or password is wrong.',
  'auth/wrong-password': 'Your email or password is wrong.',
  'auth/user-not-found': 'Your email or password is wrong.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
  'auth/weak-password': 'Choose a stronger password.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes, or reset your password.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
}

export const authErrorMessage = (error: { code?: string }) =>
  MESSAGES[error.code ?? ''] ?? 'Something went wrong. Please try again.'
