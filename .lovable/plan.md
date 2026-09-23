# Bengali-first bilingual news app

## Experience
- Make বাংলা the default language across the public app, including navigation, buttons, labels, empty states, accessibility text, and page metadata.
- Add a compact বাংলা / EN switch in the top header; remember the reader’s selection on that device.
- Keep the brand name “7AWAKE NEWS NETWORK DIGITAL” unchanged.
- Load Bengali-friendly typography while preserving the existing red editorial design.

## News content
- Add Bengali fields alongside the existing English fields for articles, shorts, videos, breaking news, trending topics, and notifications.
- Populate Bengali versions of the current published demo content, while retaining the original English content.
- Return the selected language from news loaders so headlines, summaries, categories, timelines, source coverage, and relative times switch together.
- Update fallback/static news content to Bengali-first with complete English alternatives.

## Screens
- Localize Home, Article, Shorts, Video, Search, Briefing, Ask, Notifications, Profile, sign-in, error, and not-found screens.
- Keep Bengali as the first option in article explanation/language controls.
- Update the admin forms so editors can maintain both Bengali and English content; keep the admin workspace itself in clear English for efficient management.

## Technical details
- Use a small shared language provider and translation dictionary; initialize safely during server rendering to avoid hydration errors.
- Persist the language as `bn` or `en` in browser storage and set the document language accordingly.
- Add only nullable/defaulted bilingual database columns, preserving all existing English data and permissions.
- Keep public reads limited to published/active content and existing admin protections unchanged.

## Verification
- Confirm Bengali is shown on a fresh visit and English appears immediately after switching.
- Test home, article, search, shorts, video, profile, notifications, sign-in, and admin on mobile and desktop.
- Check for overflow, browser errors, hydration errors, and a successful build.
