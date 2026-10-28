import { getGoogleClientId } from './google.config';
import { adminDemoUser, adminDemoPassword, landlordDemoUser, landlordDemoPassword } from '../../middlewares/adminDemo';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../config'; 
import { OAuth2Client } from 'google-auth-library';
import { createHash, randomBytes } from 'crypto';

const DEMO_EMAIL = 'demo@rentnest.example';
const DEMO_PASSWORD = 'RentNestDemo2026!';
const googleClient = new OAuth2Client();

const sessionFor = (user: any, demo = false) => {
  if (user.status !== 'ACTIVE') throw new Error('This account is not active. Please contact support.');
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, demo }, config.jwt.access_secret as Secret, { expiresIn: '1d' });
  const { password, ...safeUser } = user;
  return { user: safeUser, token };
};

const googleLogin = async (credential: string, role: 'TENANT' | 'LANDLORD') => {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error('Google sign-in is not configured. Please use email.');
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
  const identity = ticket.getPayload();
  if (!identity?.sub || !identity.email || !identity.email_verified) throw new Error('A verified Google email is required.');
  // Stable provider-scoped identity without a database schema migration.
  const hash = createHash('sha256').update('google:' + identity.sub).digest('hex');
  const id = `${hash.slice(0,8)}-${hash.slice(8,12)}-5${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
  let user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
  if (!user) {
    const existing = await prisma.user.findUnique({ where: { email: identity.email.toLowerCase() } });
    // Never silently link an existing password account based on an email claim.
    if (existing) throw new Error('An account already uses this email. Please sign in with your password.');
    user = await prisma.user.upsert({
      where: { id }, update: {},
      create: { id, name: identity.name || 'RentNest member', email: identity.email.toLowerCase(), password: await bcrypt.hash(randomBytes(32).toString('hex'), 12), role },
      include: { profile: true },
    });
  }
  return sessionFor(user);
};

const signup = async (payload: any) => {
  if (!['TENANT', 'LANDLORD'].includes(payload.role)) throw new Error('Please select Tenant or Landlord.');
  if ([DEMO_EMAIL, adminDemoUser.email, landlordDemoUser.email].includes(payload.email.toLowerCase())) throw new Error('This email is reserved for the demo account.');
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
  });

  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const login = async (payload: any) => {
  if(payload.email.toLowerCase() === landlordDemoUser.email) {
    if(payload.password !== landlordDemoPassword) throw new Error('Invalid demo credentials.');
    return sessionFor(landlordDemoUser, true);
  }
  if(payload.email.toLowerCase() === adminDemoUser.email) {
    if(payload.password !== adminDemoPassword) throw new Error('Invalid demo credentials.');
    return sessionFor(adminDemoUser, true);
  }
  if (payload.email.toLowerCase() === DEMO_EMAIL) {
    if (payload.password !== DEMO_PASSWORD) throw new Error('Invalid demo credentials.');
    const demoUser = await prisma.user.upsert({
      where: { email: DEMO_EMAIL }, update: {},
      create: { name: 'Demo Explorer', email: DEMO_EMAIL, password: await bcrypt.hash(DEMO_PASSWORD, 12), role: 'TENANT' },
      include: { profile: true },
    });
    return sessionFor(demoUser, true);
  }
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      profile: true
    }
  });

  if (!user) {
    throw new Error('User not found!');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  
  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  return sessionFor(user);
};

export const AuthService = { signup, login, googleLogin };

