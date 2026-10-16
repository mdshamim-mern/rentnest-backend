const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_ACCESS_SECRET = 'unit-test-only-key-not-for-deployment';
const jwt = require('jsonwebtoken');
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
test('incorrect demo credentials are rejected before database access', async () => {
  await assert.rejects(AuthService.login({email:'demo@rentnest.example',password:'wrong'}), /Invalid demo/);
});
test('demo login creates a tenant session without exposing the password', async () => {
  const original=prisma.user.upsert;
  prisma.user.upsert=async()=>({id:'demo-user',name:'Demo Explorer',email:'demo@rentnest.example',role:'TENANT',status:'ACTIVE',password:'hash'});
  try {
    const session=await AuthService.login({email:'demo@rentnest.example',password:'RentNestDemo2026!'});
    assert.equal(session.user.password,undefined);
    const claims=jwt.verify(session.token,process.env.JWT_ACCESS_SECRET);
    assert.equal(claims.demo,true); assert.equal(claims.role,'TENANT');
  } finally { prisma.user.upsert=original; }
});
test('demo can read but cannot mutate protected resources', async () => {
  const token=jwt.sign({id:'demo-user',role:'TENANT',demo:true},process.env.JWT_ACCESS_SECRET);
  for(const method of ['GET','POST','PATCH','DELETE']) {
    let continued=false;let status;
    const res={status(code){status=code;return this;},json(){return this;}};
    await auth('TENANT')({method,headers:{authorization:'Bearer '+token}},res,()=>{continued=true;});
    assert.equal(continued,method==='GET');
    if(method!=='GET') assert.equal(status,403);
  }
});
test('Google login fails closed when the OAuth client is missing',async()=>{
  const original=process.env.GOOGLE_CLIENT_ID;delete process.env.GOOGLE_CLIENT_ID;
  try {await assert.rejects(AuthService.googleLogin('invalid','TENANT'),/not configured/);}
  finally {if(original)process.env.GOOGLE_CLIENT_ID=original;}
});
test('banned accounts cannot obtain a session',async()=>{
  const original=prisma.user.upsert;
  prisma.user.upsert=async()=>({id:'demo-user',email:'demo@rentnest.example',role:'TENANT',status:'BANNED'});
  try{await assert.rejects(AuthService.login({email:'demo@rentnest.example',password:'RentNestDemo2026!'}),/not active/);}
  finally{prisma.user.upsert=original;}
});
