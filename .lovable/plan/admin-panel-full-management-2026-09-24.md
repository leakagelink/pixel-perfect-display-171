# Admin Panel — Full Management

Goal: admin panel se app ka har hissa manage ho sake, bina kisi missing feature ke.

## Kya add hoga

1. **Articles: Timeline & Coverage editing**
   - Article form mein "Timeline" (date + event) aur "Coverage" (source + label + angle) ke list editors — add/remove rows, Bengali versions bhi.
   - Ye fields abhi database mein hain par admin se edit nahi ho sakte.

2. **Users: Role management**
   - Users tab mein har user ke saamne role change karne ka option (User ↔ Admin), dropdown se.
   - Database migration: `user_roles` par admin ke liye INSERT/UPDATE/DELETE policies (abhi sirf read hai).
   - Safety: admin apna khud ka admin role remove nahi kar sakta (accidental lockout rokne ke liye).

3. **Validation**
   - Required fields (headline, slug, title) save se pehle check — empty save par saaf error message.
   - Slug duplicate hone par friendly error ("ye slug pehle se use ho raha hai").

4. **Pagination / Load more**
   - Lambi lists mein "Load more" button (50 rows per batch) taaki panel fast rahe.

5. **Quick toggles**
   - List mein hi Published/Active aur Featured ka one-tap toggle — form khole bina.

## Technical details

- `lov_database--migration`: `user_roles` par admin write policies (`has_role` check ke saath), GRANT INSERT/UPDATE/DELETE to authenticated.
- `src/routes/_authenticated/admin.tsx`: naye field types `timeline` aur `coverage` (structured list editors), role dropdown Users tab mein, client-side validation, range-based fetching (`.range(0, 49)` + Load more), inline toggle buttons.
- Sign-out pehle se kaam kar raha hai — use waise hi rakha jayega.
- Koi existing feature toda nahi jayega; sab additive changes hain.
