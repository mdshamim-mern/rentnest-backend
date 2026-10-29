const test = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_ACCESS_SECRET = 'local-test-secret-only';
const jwt = require('jsonwebtoken');
const { adminDemo } = require('../dist/src/middlewares/adminDemo');
function request(identity, method='GET', path='/admin/users') {
  const result={next:false,status:200};
  const res={status(n){result.status=n;return this},json(body){result.body=body;return this}};
  adminDemo({method,path,headers:{authorization:'Bearer '+jwt.sign(identity,process.env.JWT_ACCESS_SECRET)}},res,()=>result.next=true);
  return result;
}
test('retired admin and landlord tokens cannot read or write production',()=>{
 for(const identity of [{id:'demo-admin'},{id:'demo-landlord'},{email:'admin.demo@rentnest.example'},{email:'landlord.demo@rentnest.example'}])
 for(const method of ['GET','POST','PUT','PATCH','DELETE']) {
 const r=request({...identity,role:'ADMIN'},method);assert.equal(r.status,401);assert.equal(r.next,false);assert.equal(r.body.data,undefined);
 }
});
test('real accounts and database-backed tenant demo continue to normal authorization',()=>{
 for(const identity of [{id:'actual-admin',role:'ADMIN',email:'owner@example.org'},{id:'actual-landlord',role:'LANDLORD'},{id:'tenant-id',email:'demo@rentnest.example',demo:true}]) assert.equal(request(identity).next,true);
});
