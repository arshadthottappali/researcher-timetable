package com.researchertimetable.widget

data class WidgetData(
    val activeName: String,
    val timeLeft: String,
    val progressPct: Int,
    val updatedIso: String
) {
    companion object {
        val EMPTY = WidgetData(
            activeName = "Free time",
            timeLeft = "--",
            progressPct = 0,
            updatedIso = ""
        )
    }
}
