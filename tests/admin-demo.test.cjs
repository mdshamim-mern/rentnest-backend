const test = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_ACCESS_SECRET = 'local-test-secret-only';
const jwt = require('jsonwebtoken');
const {adminDemo, adminDemoUser} = require('../dist/src/middlewares/adminDemo');
function request(method, path, identity=adminDemoUser) {
 let result={status:200,next:false};
 const res={status(code){result.status=code;return this},json(body){result.body=body;return this}};
 adminDemo({method,path,headers:{authorization:'Bearer '+jwt.sign(identity,process.env.JWT_ACCESS_SECRET)}},res,()=>{result.next=true});
 return result;
}
test('admin demo returns only sample users',()=>{const r=request('GET','/admin/users');assert.equal(r.next,false);assert.equal(r.body.data.length,3);assert.ok(r.body.data.every(u=>u.email.endsWith('.example')||u.email.endsWith('@example.com')))});
test('admin demo denies every write verb before controllers',()=>{for(const method of ['POST','PUT','PATCH','DELETE']){const r=request(method,'/users/real-id');assert.equal(r.status,403);assert.equal(r.next,false)}});
test('admin demo denies unknown and private paths',()=>{for(const path of ['/users/real-id','/payments','/upload','/admin/new-endpoint']){const r=request('GET',path);assert.equal(r.status,403);assert.equal(r.next,false)}});
test('normal authenticated users continue normally',()=>assert.equal(request('GET','/admin/users',{id:'normal',email:'normal@example.com',role:'ADMIN'}).next,true));
test('profile and overview endpoints use sample fixtures',()=>{for(const path of ['/users/demo-admin','/properties','/rentals/all','/contact','/saved-searches','/reviews/sample-home']){const r=request('GET',path);assert.equal(r.status,200);assert.equal(r.next,false);assert.equal(r.body.success,true)}});
