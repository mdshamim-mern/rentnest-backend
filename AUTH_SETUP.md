# Authentication setup

## Google sign-in

Create a Web application OAuth client in Google Cloud. Add `https://rentnest-frontend-delta.vercel.app` to Authorized JavaScript origins (and `http://localhost:3000` for local testing). Configure the consent screen and test users when the app is in testing mode.

Set `GOOGLE_CLIENT_ID` on the **backend Vercel project**, then redeploy. The public `/api/auth/providers` endpoint supplies the client ID to the frontend. No client secret or frontend environment variable is required for this ID-token flow.

The backend uses Google's official library to verify signature, audience, issuer and expiry. A stable provider-scoped user ID is derived from the verified Google subject. Existing email/password accounts are not silently linked; those users should use password sign-in. New social accounts can only be Tenant or Landlord. Google sign-in is explicitly shown as unavailable until configured.

## Demo account

The login page's Demo Login button fills `demo@rentnest.example` / `RentNestDemo2026!`. These are intentionally public demo credentials, not a secret. The account is provisioned on first successful demo login and receives a read-only tenant token. Protected POST/PATCH/PUT/DELETE operations are rejected by the auth middleware. It cannot change its password, submit rental requests, or make payments. Browser-local saved homes still work.

## Verification

Run `npm run build` then `node --test tests/auth.test.cjs`. These tests mock database operations; no production data is changed. Real Google authentication still requires the configured OAuth client and an interactive Google account.

## Real-account evaluation

Admin and Landlord virtual sample previews are retired. Their reserved emails cannot sign in or register, and previously issued tokens are rejected before controllers. Real database accounts continue through normal authentication and role checks. The project owner supplies real evaluation credentials privately; never publish an administrator password. The public tenant demo remains read-only. No separate evaluation environment is required or enabled.
