package com.researchertimetable.widget

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

object WidgetRepository {
    // Change this to your deployed endpoint.
    private const val WIDGET_URL = "https://YOUR-DOMAIN.com/widget-data.json"

    fun fetchRemoteData(): WidgetData {
        val conn = (URL(WIDGET_URL).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 8000
            readTimeout = 8000
            setRequestProperty("Accept", "application/json")
        }

        conn.inputStream.use { stream ->
            val body = stream.bufferedReader().readText()
            val json = JSONObject(body)
            return WidgetData(
                activeName = json.optString("active_name", "Free time"),
                timeLeft = json.optString("time_left", "--"),
                progressPct = json.optInt("progress_pct", 0),
                updatedIso = json.optString("updated", "")
            )
        }
    }
}
