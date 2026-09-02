# 05 — Email Signup API

**What to build:** A Next.js API route that accepts email signups and stores them via Resend. Returns success/error JSON responses.

**Blocked by:** 01 (Project Setup)

**Status:** ready-for-agent

- [ ] API route at `/api/signup` (POST)
- [ ] Validates email format (regex)
- [ ] Sanitizes input (trim, lowercase)
- [ ] Calls Resend API to create subscriber
- [ ] Returns 200 with success message on success
- [ ] Returns 400 with error message on invalid email
- [ ] Returns 500 with generic error on API failure
- [ ] Environment variable `RESEND_API_KEY` documented
- [ ] Rate limiting considered (basic: 1 per IP per minute)
- [ ] No sensitive data logged
