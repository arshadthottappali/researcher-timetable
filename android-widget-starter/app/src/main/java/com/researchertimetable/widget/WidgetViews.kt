package com.researchertimetable.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

object WidgetViews {
    fun render(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray, data: WidgetData) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_timetable).apply {
                setTextViewText(R.id.tvActive, data.activeName)
                setTextViewText(R.id.tvTimeLeft, "Time left: ${data.timeLeft}")
                setTextViewText(R.id.tvProgress, "Progress: ${data.progressPct}%")

                val launchIntent = Intent(context, MainActivity::class.java)
                val pending = PendingIntent.getActivity(
                    context,
                    0,
                    launchIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                setOnClickPendingIntent(R.id.widgetRoot, pending)
            }
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    fun updateAll(context: Context, data: WidgetData) {
        val manager = AppWidgetManager.getInstance(context)
        val component = ComponentName(context, TimetableWidgetProvider::class.java)
        val ids = manager.getAppWidgetIds(component)
        render(context, manager, ids, data)
    }
}
