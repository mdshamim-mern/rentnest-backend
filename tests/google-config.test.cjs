const test = require('node:test');
const assert = require('node:assert/strict');
const { getGoogleClientId } = require('../dist/src/modules/auth/google.config');
test('Google configuration trims whitespace and rejects malformed identifiers', () => {
 const previous = process.env.GOOGLE_CLIENT_ID;
 try {
  const id = '123456-abcdef.apps.googleusercontent.com';
  process.env.GOOGLE_CLIENT_ID = '  ' + id + '   \n';
  assert.equal(getGoogleClientId(), id);
  for (const value of ['', '   ', 'project-name', '123456-bad id.apps.googleusercontent.com']) {
   process.env.GOOGLE_CLIENT_ID = value;
   assert.equal(getGoogleClientId(), null);
  }
 } finally {
  if (previous === undefined) delete process.env.GOOGLE_CLIENT_ID;
  else process.env.GOOGLE_CLIENT_ID = previous;
 }
});
