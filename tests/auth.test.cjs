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
test('reserved demo email cannot be registered', async () => {
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

test('restricted demo login creates a tenant session without exposing the password', async () => {
  const original=prisma.user.upsert;
  prisma.user.upsert=async()=>({id:'demo-user',name:'RentNest Demo',email:'demo@rentnest.example',role:'TENANT',status:'ACTIVE',password:'hash'});
  try {
    const session=await AuthService.login({email:'demo@rentnest.example',password:'RentNestDemo2026!'});
    assert.equal(session.user.password,undefined);
    const claims=jwt.verify(session.token,process.env.JWT_ACCESS_SECRET);
    assert.equal(claims.demo,true); assert.equal(claims.role,'TENANT');
  } finally { prisma.user.upsert=original; }
});
test('restricted demo can read but cannot mutate protected resources', async () => {
  const token=jwt.sign({id:'demo-user',role:'TENANT',email:'demo@rentnest.example',demo:true},process.env.JWT_ACCESS_SECRET);
  for(const method of ['GET','POST','PATCH','DELETE']) {
    let continued=false;let status;
    const res={status(code){status=code;return this;},json(){return this;}};
    await auth('TENANT')({method,headers:{authorization:'Bearer '+token}},res,()=>{continued=true;});
    assert.equal(continued,method==='GET');
    if(method!=='GET') assert.equal(status,403);
  }
});
test('retired privileged demo logins cannot issue sessions',async()=>{
 for(const email of ['admin.demo@rentnest.example','landlord.demo@rentnest.example']) await assert.rejects(AuthService.login({email,password:'anything'}),/retired/);
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
