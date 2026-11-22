package com.howhouse.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MessageComposer")
public class MessageComposerPlugin extends Plugin {
    @PluginMethod
    public void open(PluginCall call) {
        String body = call.getString("body", "");
        if (body.trim().isEmpty()) {
            call.reject("Empty message", "EMPTY_MESSAGE");
            return;
        }
        getActivity().runOnUiThread(() -> {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:"));
            intent.putExtra("sms_body", body);
            try {
                getActivity().startActivity(intent);
                // This confirms opening, never delivery or sending.
                call.resolve();
            } catch (ActivityNotFoundException | SecurityException exception) {
                call.reject("Message app unavailable", "UNAVAILABLE");
            }
        });
    }
}
