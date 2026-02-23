package com.researchertimetable.widget

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

class WidgetUpdateWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        return try {
            val data = WidgetRepository.fetchRemoteData()
            WidgetStore.save(applicationContext, data)
            WidgetViews.updateAll(applicationContext, data)
            Result.success()
        } catch (_: Exception) {
            val cached = WidgetStore.load(applicationContext)
            WidgetViews.updateAll(applicationContext, cached)
            Result.retry()
        }
    }
}
