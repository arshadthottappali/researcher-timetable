package com.researchertimetable.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class TimetableWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        WidgetViews.render(context, appWidgetManager, appWidgetIds, WidgetStore.load(context))
        enqueueImmediateUpdate(context)
        ensurePeriodicSync(context)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_REFRESH) {
            enqueueImmediateUpdate(context)
        }
    }

    companion object {
        const val ACTION_REFRESH = "com.researchertimetable.widget.ACTION_REFRESH"
        private const val PERIODIC_WORK_NAME = "widget_periodic_sync"
        private const val IMMEDIATE_WORK_NAME = "widget_immediate_sync"

        fun enqueueImmediateUpdate(context: Context) {
            val oneTime = OneTimeWorkRequestBuilder<WidgetUpdateWorker>().build()
            WorkManager.getInstance(context).enqueueUniqueWork(
                IMMEDIATE_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                oneTime
            )
        }

        fun ensurePeriodicSync(context: Context) {
            val periodic = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(30, TimeUnit.MINUTES).build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                PERIODIC_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                periodic
            )
        }
    }
}
