package com.researchertimetable.widget

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<TextView>(R.id.tvInfo).text =
            "Native widget starter. Set your endpoint URL in WidgetRepository.kt"

        findViewById<Button>(R.id.btnRefreshNow).setOnClickListener {
            TimetableWidgetProvider.enqueueImmediateUpdate(this)
        }

        findViewById<Button>(R.id.btnOpenWeb).setOnClickListener {
            startActivity(
                Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("https://YOUR-DOMAIN.com")
                )
            )
        }
    }
}
