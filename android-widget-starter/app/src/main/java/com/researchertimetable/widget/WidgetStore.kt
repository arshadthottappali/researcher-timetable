package com.researchertimetable.widget

import android.content.Context

object WidgetStore {
    private const val PREF_NAME = "widget_store"
    private const val KEY_ACTIVE = "active_name"
    private const val KEY_TIME = "time_left"
    private const val KEY_PROGRESS = "progress_pct"
    private const val KEY_UPDATED = "updated_iso"

    fun save(context: Context, data: WidgetData) {
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_ACTIVE, data.activeName)
            .putString(KEY_TIME, data.timeLeft)
            .putInt(KEY_PROGRESS, data.progressPct)
            .putString(KEY_UPDATED, data.updatedIso)
            .apply()
    }

    fun load(context: Context): WidgetData {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return WidgetData(
            activeName = prefs.getString(KEY_ACTIVE, WidgetData.EMPTY.activeName) ?: WidgetData.EMPTY.activeName,
            timeLeft = prefs.getString(KEY_TIME, WidgetData.EMPTY.timeLeft) ?: WidgetData.EMPTY.timeLeft,
            progressPct = prefs.getInt(KEY_PROGRESS, WidgetData.EMPTY.progressPct),
            updatedIso = prefs.getString(KEY_UPDATED, WidgetData.EMPTY.updatedIso) ?: WidgetData.EMPTY.updatedIso
        )
    }
}
