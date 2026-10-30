const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_ACCESS_SECRET = 'unit-test-only-key-not-for-deployment';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../dist/src/lib/prisma');
const { AuthService } = require('../dist/src/modules/auth/auth.service');
const { AuthValidation } = require('../dist/src/modules/auth/auth.validation');
const { auth } = require('../dist/src/middlewares/auth');

test('public registration rejects administrator roles', () => {
  assert.equal(AuthValidation.signupValidationSchema.safeParse({body:{name:'Test',email:'test@example.com',password:'testing123',role:'ADMIN'}}).success,false);
});
test('retired demo email cannot be registered', async () => {
  await assert.rejects(AuthService.signup({email:'demo@rentnest.example',role:'TENANT',password:'testing123'}), /reserved/);
});
test('Google login fails closed when the OAuth client is missing',async()=>{
  const original=process.env.GOOGLE_CLIENT_ID;delete process.env.GOOGLE_CLIENT_ID;
  try {await assert.rejects(AuthService.googleLogin('invalid','TENANT'),/not configured/);}
  finally {if(original)process.env.GOOGLE_CLIENT_ID=original;}
});
test('banned accounts cannot obtain a session',async()=>{
  const original=prisma.user.findUnique;
  try{prisma.user.findUnique=async()=>({id:'blocked-user',email:'blocked@example.org',role:'TENANT',status:'BANNED',password:await bcrypt.hash('blocked-password',4)});await assert.rejects(AuthService.login({email:'blocked@example.org',password:'blocked-password'}),/not active/);}
  finally{prisma.user.findUnique=original;}
});

test('retired demo logins cannot issue sessions',async()=>{
 for(const email of ['demo@rentnest.example','admin.demo@rentnest.example','landlord.demo@rentnest.example']) await assert.rejects(AuthService.login({email,password:'anything'}),/retired/);
});
test('real role accounts receive normal sessions and pass matching write authorization',async()=>{
 const original=prisma.user.findUnique;const hash=await bcrypt.hash('local-test-password',4);
 try {for(const role of ['TENANT','LANDLORD','ADMIN']) {
 prisma.user.findUnique=async()=>({id:'real-db-account',email:'member@example.org',role,status:'ACTIVE',password:hash});
 const result=await AuthService.login({email:'member@example.org',password:'local-test-password'});
 const claims=jwt.verify(result.token,process.env.JWT_ACCESS_SECRET);assert.equal(claims.demo,false);assert.equal(result.user.password,undefined);
 let next=false;await auth(role)({method:'PATCH',headers:{authorization:'Bearer '+result.token}},{status(){return this},json(){return this}},()=>next=true);assert.equal(next,true);
 let denied;await auth(role==='ADMIN'?'TENANT':'ADMIN')({method:'PATCH',headers:{authorization:'Bearer '+result.token}},{status(n){denied=n;return this},json(){return this}},()=>assert.fail('Wrong role allowed'));assert.equal(denied,403);
 }}finally{prisma.user.findUnique=original;}
});
