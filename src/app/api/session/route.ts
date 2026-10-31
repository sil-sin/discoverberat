import { cookies } from 'next/headers';

// A route handler, not a server action: a server action that changes cookies re-renders the current page, which flashes the sign-in page on protected routes.
export async function DELETE() {
  (await cookies()).delete('token');
  return new Response(null, { status: 204 });
}
