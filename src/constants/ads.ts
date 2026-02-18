import { Platform } from 'react-native';

// Test Ad Unit IDs from Google AdMob
// https://developers.google.com/admob/android/test-ads
// https://developers.google.com/admob/ios/test-ads

export const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
    default: 'ca-app-pub-3940256099942544/6300978111',
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
    default: 'ca-app-pub-3940256099942544/1033173712',
  }),
};

// Production App IDs (replace when ready)
// Steps to swap to production:
// 1. Create AdMob account
// 2. Register app in AdMob console
// 3. Create Banner and Interstitial ad units
// 4. Update app.json with real app ID
// 5. Update AD_UNIT_IDS above with real unit IDs
// 6. Run: npx expo prebuild --clean
