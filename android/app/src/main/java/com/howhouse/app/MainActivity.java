package com.howhouse.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.content.Intent;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MessageComposerPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // Reopening the existing task from the launcher is not a fresh WebView mount.
        // Returning from SMS, YouTube, or the browser must keep the current flow.
        if (Intent.ACTION_MAIN.equals(intent.getAction())
                && intent.hasCategory(Intent.CATEGORY_LAUNCHER)
                && getBridge() != null) {
            getBridge().triggerWindowJSEvent("howhouse:launcher-open");
        }
    }
}
