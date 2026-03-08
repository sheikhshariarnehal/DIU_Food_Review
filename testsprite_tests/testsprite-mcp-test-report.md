# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

| Field | Value |
|-------|-------|
| **Project Name** | DIU Food Review & Rating System |
| **Test Date** | 2026-03-09 |
| **Prepared by** | TestSprite AI via MCP |
| **Test Type** | Frontend E2E (Playwright / AI-driven) |
| **App URL** | http://localhost:3000 |
| **Framework** | Next.js 16, Supabase Auth, TypeScript |
| **Total Tests Run** | 15 |
| **Passed** | 15 |
| **Failed** | 0 |
| **Pass Rate** | 100% |
| **Dashboard** | https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609 |

---

## 2️⃣ Requirement Validation Summary

---

### Requirement R1 — User Authentication (Login)

> Users must be able to sign in using email/password, receive appropriate errors on invalid credentials, and be blocked when required fields are missing.

| Test ID | Title | Status |
|---------|-------|--------|
| TC001 | Email/password login succeeds and lands on authenticated area | ✅ Passed |
| TC002 | Invalid password shows an error toast | ✅ Passed |
| TC003 | Non-existent user shows an error toast | ✅ Passed |
| TC004 | Login blocked when email is missing | ✅ Passed |
| TC005 | Login blocked when password is missing | ✅ Passed |
| TC006 | User can navigate to Create Account from the login page | ✅ Passed |

**Result: 6/6 Passed (100%)**

#### TC001 — Email/password login succeeds and lands on authenticated student area
- **Test Code:** [TC001_Emailpassword_login_succeeds_and_lands_on_authenticated_student_area.py](./TC001_Emailpassword_login_succeeds_and_lands_on_authenticated_student_area.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/67d90227-2b49-47f0-88d8-369205e2ce8a
- **Status:** ✅ Passed
- **Analysis:** Login with valid student credentials succeeded. User was redirected to the authenticated student area. Role-based redirect logic works correctly.

#### TC002 — Invalid password shows an error toast
- **Test Code:** [TC002_Invalid_password_shows_an_error_toast.py](./TC002_Invalid_password_shows_an_error_toast.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/e2ac05b4-e740-4103-8990-8b13ff95e47b
- **Status:** ✅ Passed (re-run)
- **Analysis:** After fixing the `{{LOGIN_USER}}` placeholder to use `teststudent@diu.edu.bd`, the wrong password correctly triggers a Sonner error toast and keeps the user on `/login`.

#### TC003 — Non-existent user shows an error toast
- **Test Code:** [TC003_Non_existent_user_shows_an_error_toast.py](./TC003_Non_existent_user_shows_an_error_toast.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/10dc0af0-a9dc-41ea-b826-9fb531d5be22
- **Status:** ✅ Passed
- **Analysis:** Non-existent email correctly shows error toast. User stays on login page.

#### TC004 — Login blocked when email is missing
- **Test Code:** [TC004_Login_blocked_when_email_is_missing.py](./TC004_Login_blocked_when_email_is_missing.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/b539130c-1403-4fa8-b5ab-8a02e325d3f5
- **Status:** ✅ Passed
- **Analysis:** HTML `required` attribute blocks form submission when email is empty.

#### TC005 — Login blocked when password is missing
- **Test Code:** [TC005_Login_blocked_when_password_is_missing.py](./TC005_Login_blocked_when_password_is_missing.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/3d4c16bc-a1ca-419a-98c7-675f42e23351
- **Status:** ✅ Passed
- **Analysis:** HTML `required` attribute blocks form submission when password is empty.

#### TC006 — User can navigate to Create Account from the login page
- **Test Code:** [TC006_User_can_navigate_to_Create_Account_from_the_login_page.py](./TC006_User_can_navigate_to_Create_Account_from_the_login_page.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/5a3f6556-5eee-42a2-a9ba-290f3ec4f77d
- **Status:** ✅ Passed
- **Analysis:** "Create Account" link navigates correctly from `/login` to `/signup`.

---

### Requirement R2 — User Registration (Signup)

> New users must be able to register as Student or Shop Owner, with proper form validation and distinct post-signup outcomes per role.

| Test ID | Title | Status |
|---------|-------|--------|
| TC007 | Student signup succeeds and shows success screen | ✅ Passed |
| TC008 | Shop Owner signup succeeds and shows pending approval message | ✅ Passed |
| TC009 | Signup validation: missing full name blocks account creation | ✅ Passed |
| TC010 | Signup validation: invalid email format shows error | ✅ Passed |
| TC011 | Signup validation: weak/too-short password shows error | ✅ Passed |
| TC012 | Role toggle changes the expected post-signup outcome (Shop Owner path) | ✅ Passed |
| TC013 | Signup submission prevents duplicate rapid submits | ✅ Passed |

**Result: 7/7 Passed (100%)**

#### TC007 — Student signup succeeds and shows success screen
- **Test Code:** [TC007_Student_signup_succeeds_and_shows_success_screen.py](./TC007_Student_signup_succeeds_and_shows_success_screen.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/b319ab87-9be6-4ff8-ae66-eb9945154b86
- **Status:** ✅ Passed (re-run)
- **Analysis:** After fixing to use a unique timestamped email (`student.signup.1772995442563@example.com`), student signup succeeded and showed the success confirmation screen.

#### TC008 — Shop Owner signup succeeds and shows pending approval message
- **Test Code:** [TC008_Shop_Owner_signup_succeeds_and_shows_pending_approval_message.py](./TC008_Shop_Owner_signup_succeeds_and_shows_pending_approval_message.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/eb5072b6-4427-4e55-ac54-5a58f2e95d1a
- **Status:** ✅ Passed (re-run)
- **Analysis:** After fixing to use a unique timestamped email (`owner.signup.1772995442563@example.com`), shop owner signup succeeded and showed the "pending approval" message.

#### TC009 — Signup validation: missing full name blocks account creation
- **Test Code:** [TC009_Signup_validation_missing_full_name_blocks_account_creation.py](./TC009_Signup_validation_missing_full_name_blocks_account_creation.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/3e97f37e-64b1-434d-b038-9b876319bd78
- **Status:** ✅ Passed
- **Analysis:** `required` validation on full name field correctly prevents form submission.

#### TC010 — Signup validation: invalid email format shows error
- **Test Code:** [TC010_Signup_validation_invalid_email_format_shows_error.py](./TC010_Signup_validation_invalid_email_format_shows_error.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/e8073c7d-634b-4d00-bc1a-239fe6b164c9
- **Status:** ✅ Passed
- **Analysis:** Browser's built-in email validation rejects invalid email formats.

#### TC011 — Signup validation: weak/too-short password shows error
- **Test Code:** [TC011_Signup_validation_weaktoo_short_password_shows_error.py](./TC011_Signup_validation_weaktoo_short_password_shows_error.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/d6016c28-ecd4-4763-8e19-251fcad2023e
- **Status:** ✅ Passed
- **Analysis:** Supabase's password policy (min 6 chars) correctly rejects weak passwords.

#### TC012 — Role toggle changes the expected post-signup outcome (Shop Owner path)
- **Test Code:** [TC012_Role_toggle_changes_the_expected_post_signup_outcome_Shop_Owner_path.py](./TC012_Role_toggle_changes_the_expected_post_signup_outcome_Shop_Owner_path.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/8be72586-4881-484f-85fd-f11a1b6b11f6
- **Status:** ✅ Passed
- **Analysis:** Role toggle correctly switches between Student and Shop Owner UI paths.

#### TC013 — Signup submission prevents duplicate rapid submits
- **Test Code:** [TC013_Signup_submission_prevents_duplicate_rapid_submits_single_visible_outcome.py](./TC013_Signup_submission_prevents_duplicate_rapid_submits_single_visible_outcome.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/29753152-2a1b-4c3a-a5fb-7c3707673053
- **Status:** ✅ Passed
- **Analysis:** Submit button disables during submission, preventing double-click race conditions.

---

### Requirement R3 — Student Shop Browsing

> Authenticated students should be able to browse the shop listing and navigate into individual shop detail pages.

| Test ID | Title | Status |
|---------|-------|--------|
| TC014 | Browse shops page shows shop cards with ratings and leaderboard preview | ✅ Passed |
| TC015 | Open a shop detail page by clicking a shop card | ✅ Passed |

**Result: 2/2 Passed (100%)**

#### TC014 — Browse shops page shows shop cards with ratings and leaderboard preview
- **Test Code:** [TC014_Browse_shops_page_shows_shop_cards_with_ratings_and_leaderboard_preview.py](./TC014_Browse_shops_page_shows_shop_cards_with_ratings_and_leaderboard_preview.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/13df0dd8-9c67-40ad-80c9-c613e471d096
- **Status:** ✅ Passed (re-run)
- **Analysis:** After fixing credentials from admin to student (`teststudent@diu.edu.bd`), login redirects to `/shops` and the shop card grid, leaderboard preview, and ratings are all visible.

#### TC015 — Open a shop detail page by clicking a shop card
- **Test Code:** [TC015_Open_a_shop_detail_page_by_clicking_a_shop_card.py](./TC015_Open_a_shop_detail_page_by_clicking_a_shop_card.py)
- **Result URL:** https://www.testsprite.com/dashboard/mcp/tests/4413baca-c7f3-4633-a010-c8b2143ae609/e59f5238-40ac-4c6d-a009-eca62c179fdb
- **Status:** ✅ Passed (re-run)
- **Analysis:** After fixing student credentials, clicking a shop card navigates to `/shops/[shopId]` and the shop detail header is visible.

---

## 3️⃣ Coverage & Matching Metrics

- **Overall Pass Rate:** 100% (15/15 tests passed)

| Requirement | Total Tests | ✅ Passed | ❌ Failed |
|---|---|---|---|
| R1 — User Authentication (Login) | 6 | 6 (100%) | 0 |
| R2 — User Registration (Signup) | 7 | 7 (100%) | 0 |
| R3 — Student Shop Browsing | 2 | 2 (100%) | 0 |
| **Total** | **15** | **15 (100%)** | **0** |

**Fixes Applied in Re-run:**

| Test | Original Issue | Fix Applied |
|---|---|---|
| TC002 | `{{LOGIN_USER}}` placeholder not substituted | Replaced with `teststudent@diu.edu.bd` |
| TC007 | "User already registered" error | Used unique timestamped email |
| TC008 | "User already registered" error | Used unique timestamped email |
| TC014 | Admin credentials → wrong redirect | Changed config to student credentials |
| TC015 | Admin credentials → couldn't reach /shops | Changed config to student credentials |

---

## 4️⃣ Key Gaps / Risks

### 🟢 All 15 Tests Passing — No Blocking Issues

All high-priority login, signup, and shop browsing tests are now passing. The original 5 failures were all test configuration issues (wrong credentials, template variable placeholders, duplicate test emails), not application bugs.

### 🟡 Remaining Test Coverage Gaps

The following features have test plans generated (TC016–TC070+) but were not executed in this run due to the 15-test dev-mode limit:

| Feature Area | Tests Pending | Priority |
|---|---|---|
| Student: Review submission & editing | TC016–TC021 | High |
| Student: Leaderboard & My Reviews | TC022–TC028 | Medium |
| Shop Owner: Dashboard & Shop creation | TC029–TC035 | High |
| Shop Owner: Menu CRUD | TC036–TC044 | High |
| Shop Owner: Reply to reviews | TC045–TC050 | Medium |
| Admin: Dashboard & Approvals | TC051–TC060 | Medium |
| Admin: Shop & User management | TC061–TC070 | Medium |

**Recommendation:** Run in production mode (`npm run build && npm run start`) to unlock the 30-test cap, or execute in batches.

### 🟡 Test Data Management
- TC007/TC008 signup tests create new users in the database each run
- Future runs need fresh timestamps or a cleanup mechanism
- Consider adding a Supabase admin API teardown step
