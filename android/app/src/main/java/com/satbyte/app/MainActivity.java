package com.satbyte.app;

import com.getcapacitor.BridgeActivity;

import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.WindowManager;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Push the refresh rate to the maximum supported by the hardware (90Hz/120Hz)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Display display = getDisplay();
            if (display != null) {
                Display.Mode[] modes = display.getSupportedModes();
                Display.Mode highestMode = null;
                float maxRate = 0;
                
                for (Display.Mode mode : modes) {
                    if (mode.getRefreshRate() > maxRate) {
                        maxRate = mode.getRefreshRate();
                        highestMode = mode;
                    }
                }
                
                if (highestMode != null) {
                    WindowManager.LayoutParams layoutParams = getWindow().getAttributes();
                    layoutParams.preferredDisplayModeId = highestMode.getModeId();
                    getWindow().setAttributes(layoutParams);
                }
            }
        }
    }
}
