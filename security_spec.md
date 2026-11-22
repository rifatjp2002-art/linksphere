# LinkSphere Security Specification (Phase 0)

## 1. Data Invariants
1. **PII Isolation**: Private Google account records in `/users/{userId}` (containing `email` and `uid`) are strictly readable and writable ONLY by the matching authenticated user (`request.auth.uid == userId` and `email_verified == true`). Blanket `list` on `/users` is forbidden.
2. **Public Bio Visibility vs. Owner Write Control**: `/profiles/{username}` is readable (`get`) by unauthenticated public visitors ONLY when `resource.data.published == true` (or by the authenticated `ownerId`). Creating, updating, or deleting a bio profile requires verified Google authentication and `ownerId == request.auth.uid`.
3. **Immutable Ownership & Handle Binding**: On `/profiles/{username}`, `ownerId`, `username`, and `createdAt` cannot be altered after creation. The `username` field must always equal the document ID `{username}` and match `^[a-z0-9_-]{2,40}$`.
4. **Unauthenticated Append-Only Analytics with Master Gate**: Any public visitor may `create` an analytics event in `/profiles/{username}/events/{eventId}` ONLY when the parent `/profiles/{username}` exists, has `published == true`, and `incoming().ownerId` matches the parent profile's `ownerId`. Only the profile owner (`existing().ownerId == request.auth.uid`) can `get`, `list`, or `delete` events. `update` on events is always denied.
5. **Temporal Integrity & Bounded Payloads**: `createdAt` and `updatedAt` must strictly equal `request.time`. Every string field has explicit `.size()` bounds and arrays (`socials`, `links`) are strictly bounded (`<= 20` and `<= 50`) with type checks.

## 2. The "Dirty Dozen" Adversarial Payloads (All Expected: PERMISSION_DENIED)
1. **PII Snooping on `/users/{otherUid}`**: Authenticated user `uid_A` tries `get` or `create` on `/users/uid_B`.
2. **User Directory Scraping**: Authenticated user executes `list` on `/users`.
3. **Self-Role / Ghost Field Injection (Shadow Update)**: Authenticated user sends `{ ..., isAdmin: true }` in `/users/{uid}` or `/profiles/{username}`.
4. **Profile Hijack (Create)**: Authenticated user `uid_A` tries to create `/profiles/someone` with `ownerId: "uid_B"`.
5. **Profile Hijack (Update)**: Authenticated user `uid_A` tries to update `/profiles/rifat_creator` owned by `uid_B`.
6. **Immutable Owner Swap**: Owner tries to change `ownerId` or `createdAt` during an update on `/profiles/{username}`.
7. **Unpublished Profile Leak**: Unauthenticated visitor tries `get` on `/profiles/draft_user` where `published == false`.
8. **Global Profile Scraping**: Unauthenticated or authenticated user tries `list` on `/profiles` without `where('ownerId', '==', auth.uid)`.
9. **Analytics Event Forgery (Fake Parent / Wrong Owner)**: Visitor creates an event under `/profiles/rifat_creator/events/ev1` with `ownerId: "attacker_uid"` instead of the profile owner's UID.
10. **Analytics Tampering (Update)**: Authenticated or unauthenticated user attempts `update` on an existing `/profiles/{username}/events/{eventId}` document.
11. **Analytics Snooping (`list` / `get`)**: Visitor or another signed-in user `uid_B` tries to read or list `/profiles/rifat_creator/events`.
12. **Resource Poisoning / Fake Timestamp**: Client sends a 5KB `bio` string, an unbounded `links` array (>50), an invalid document ID containing `$` or spaces, or a forged `createdAt` timestamp instead of `serverTimestamp()`.
