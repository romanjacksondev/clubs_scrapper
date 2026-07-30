import { auth } from '@/auth';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';

type AuthzSuccess = { session: Session };
type AuthzFailure = { response: NextResponse };

export async function requireSession(): Promise<AuthzSuccess | AuthzFailure> {
  const session = await auth();
  if (!session) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin(): Promise<AuthzSuccess | AuthzFailure> {
  const authz = await requireSession();
  if ('response' in authz) {
    return authz;
  }
  if (authz.session.user?.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return authz;
}
