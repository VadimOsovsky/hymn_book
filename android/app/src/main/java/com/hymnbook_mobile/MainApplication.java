package com.hymnbook_mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import ui.bottomactionsheet.RNBottomActionSheetPackage;
import io.sichacvah.react.radio_button.RadioButtonPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.imagepicker.ImagePickerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNBottomActionSheetPackage(),
            new RadioButtonPackage(),
            new ReanimatedPackage(),
            new RNI18nPackage(),
            new ImagePickerPackage(),
            new SplashScreenReactPackage(),
            new AsyncStoragePackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
