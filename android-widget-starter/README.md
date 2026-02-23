# Android Widget Starter (No KWGT)

This starter gives you a native Android home-screen widget that reads:

- `active_name`
- `time_left`
- `progress_pct`

from your endpoint:

- `https://YOUR-DOMAIN.com/widget-data.json`

## What this includes

- Native widget via `AppWidgetProvider` (no paid KWGT key)
- Background refresh via `WorkManager`
- Simple repository fetch from JSON endpoint
- `SharedPreferences` cache so widget still shows last data offline

## Project setup

1. Open `android-widget-starter` in Android Studio (latest stable).
2. Let Gradle sync.
3. Update endpoint URL in:
   - `app/src/main/java/com/researchertimetable/widget/WidgetRepository.kt`
4. Run app once on your phone/emulator.
5. Add widget from home screen:
   - "Researcher Timetable"

## Refresh behavior

- Widget refreshes when placed.
- Periodic refresh runs every 30 minutes.
- Tap widget to open app and trigger immediate refresh.

## Notes

- Android enforces limits on exact background timing; 15-30 minute cadence is normal.
- For per-user data, add auth token + user-specific endpoint on your server.
