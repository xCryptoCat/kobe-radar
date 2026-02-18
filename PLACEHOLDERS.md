# Kobe Radar - Placeholders & TODOs

This document lists all placeholders, test data, and incomplete features that need to be replaced before production release.

---

## 🎯 Critical (Must Replace for Production)

### 1. AdMob Test IDs → Production IDs
**Location:** `src/constants/ads.ts` + `app.json`

**Current (Test IDs):**
```typescript
// src/constants/ads.ts
banner: {
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
}
interstitial: {
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
}
```

```json
// app.json
"plugins": [
  ["react-native-google-mobile-ads", {
    "androidAppId": "ca-app-pub-3940256099942544~3347511713",
    "iosAppId": "ca-app-pub-3940256099942544~1458002511"
  }]
]
```

**Action Required:**
1. Create AdMob account at https://admob.google.com
2. Register app in AdMob console
3. Create Banner and Interstitial ad units for iOS/Android
4. Update `app.json` with real App IDs
5. Update `src/constants/ads.ts` with real Unit IDs
6. Run `npm run prebuild:clean` to regenerate native projects
7. Test ads in development build before production

**Impact:** Medium revenue - Test ads don't generate revenue

---

### 2. App Icon & Splash Screen → Custom Branding
**Location:** `assets/`

**Current (Placeholder):**
- `assets/icon.png` - Generic Expo icon (1985 timestamp)
- `assets/splash-icon.png` - Generic Expo splash
- `assets/adaptive-icon.png` - Generic Android adaptive icon
- `assets/favicon.png` - Generic favicon

**Action Required:**
1. Design custom app icon featuring:
   - Radar theme (concentric circles?)
   - Kobe landmark silhouette?
   - Dark theme compatible (#0D0D0D background)
   - Cyan accent (#00F5D4)

2. Create assets:
   - `icon.png` - 1024×1024px (iOS App Store)
   - `splash-icon.png` - 1024×1024px (launch screen)
   - `adaptive-icon.png` - 1024×1024px (Android)
   - `favicon.png` - 48×48px (web)

3. Update `app.json` if needed (currently points to these files)

4. Run `npm run prebuild:clean` to regenerate native projects

**Design Tips:**
- Use dark background (#0D0D0D or #1A1A2E)
- Feature cyan/teal accent (#00F5D4 or #00BBF9)
- Consider radar circles, compass rose, or Kobe Port Tower silhouette
- Ensure legibility at small sizes (16×16px)
- Follow iOS/Android design guidelines

**Impact:** High - First impression, App Store listing

---

### 3. Bundle Identifier → Unique Domain
**Location:** `app.json`

**Current (Generic):**
```json
"ios": {
  "bundleIdentifier": "com.koberadar.app"
},
"android": {
  "package": "com.koberadar.app"
}
```

**Action Required:**
1. Choose unique bundle ID (e.g., `com.yourcompany.koberadar`)
2. Verify domain ownership or use reverse domain notation
3. Update `app.json` with new bundle ID
4. Run `npm run prebuild:clean`
5. Register bundle ID in Apple Developer and Google Play Console

**Important:** Cannot change after first App Store/Play Store submission!

**Impact:** Critical - Required for app store submission

---

## ⚠️ High Priority (Should Implement)

### 4. Photo Feature → Camera Integration
**Location:** `src/screens/ArrivalCelebrationScreen.tsx:29-31`

**Current (Placeholder):**
```typescript
const handleTakePhoto = () => {
  Alert.alert('Coming Soon', 'Photo feature will be available in a future update!');
};
```

**Action Required:**
Implement camera functionality:

```typescript
// Option 1: expo-camera (full control)
import { Camera } from 'expo-camera';

const handleTakePhoto = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status === 'granted') {
    navigation.navigate('Camera', { spot });
  }
};

// Option 2: expo-image-picker (simpler)
import * as ImagePicker from 'expo-image-picker';

const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Save photo with spot metadata
    // Option: Upload to cloud storage
    // Option: Share to social media
  }
};
```

**Features to Consider:**
- [ ] Camera screen with radar overlay
- [ ] Save photo to device gallery
- [ ] Associate photo with visited spot (metadata)
- [ ] Photo gallery view (all spot photos)
- [ ] Share to social media (Instagram, Twitter)
- [ ] Upload to cloud storage (optional)
- [ ] Photo collage of all 10 spots

**Packages Needed:**
```bash
npm install expo-camera expo-image-picker expo-media-library
```

**Impact:** Medium - Enhances user engagement and sharing

---

## 📝 Optional (Nice to Have)

### 5. App Name Localization
**Location:** `app.json`

**Current:**
```json
"name": "Kobe Radar"
```

**Consider:**
- Japanese name: "神戸レーダー" (Kōbe Rēdā)
- Or bilingual: "Kobe Radar / 神戸レーダー"
- Update app display name in stores

---

### 6. Privacy Policy & Terms of Service
**Location:** Not yet implemented

**Action Required:**
1. Draft privacy policy (required for App Store)
   - Location data usage
   - AdMob data collection
   - Photo storage (if camera feature added)
   - Analytics (if added)

2. Draft terms of service
   - User responsibilities
   - Liability disclaimer (GPS accuracy)
   - Content guidelines (if photo sharing added)

3. Host on web (e.g., GitHub Pages)
4. Add links to app settings screen
5. Add to App Store/Play Store listings

**Impact:** Critical for App Store approval

---

### 7. Analytics Integration
**Location:** Not yet implemented

**Options:**
- Google Analytics for Firebase
- Expo Analytics
- Mixpanel
- Amplitude

**Metrics to Track:**
- Screen views
- Spot visits
- Navigation sessions
- Arrival times
- User retention
- Crash reports

**Consider:**
- Privacy implications (update privacy policy)
- GDPR compliance (EU users)
- User opt-in/opt-out

---

### 8. Social Sharing
**Location:** Not yet implemented

**Features:**
- Share arrival celebration
- Share stamp collection progress
- Share photos (if camera implemented)
- Leaderboard / compete with friends

**Packages:**
```bash
npm install expo-sharing react-native-share
```

---

### 9. Additional Spot Content
**Location:** `src/data/spots.ts`

**Current:** Basic spot data (name, coordinates, color)

**Consider Adding:**
- Spot descriptions (history, interesting facts)
- Photos of each spot
- Recommended visiting hours
- Nearby amenities (restaurants, restrooms)
- Difficulty/distance ratings
- Estimated visit time
- Accessibility info
- Multi-language support

**Example:**
```typescript
{
  id: 'meriken-park',
  nameEn: 'Meriken Park',
  nameJa: 'メリケンパーク',
  latitude: 34.68238159523658,
  longitude: 135.18868981687186,
  color: '#FF6B9D',
  // New fields:
  description: {
    en: 'Historic waterfront park with iconic red port tower...',
    ja: '歴史的な港町の公園で、有名な赤いポートタワー...',
  },
  photos: ['meriken-1.jpg', 'meriken-2.jpg'],
  visitHours: '24/7',
  estimatedTime: '30-45 minutes',
  difficulty: 'easy',
  amenities: ['restrooms', 'cafe', 'parking'],
  accessibility: 'wheelchair-friendly',
}
```

---

### 10. Onboarding Tutorial
**Location:** Not yet implemented

**Features:**
- First-time user tutorial
- Explain radar navigation
- Explain compass calibration
- Permission requests explanation
- Skip button

**Screens:**
1. Welcome + app intro
2. How radar works (animated)
3. How to arrive at spots
4. Collect all 10 stamps!
5. Request permissions (location, camera)

---

### 11. Settings Screen
**Location:** Not yet implemented

**Features:**
- [ ] Clear visited spots (reset progress)
- [ ] Distance units (meters/feet)
- [ ] Language selection (EN/JA)
- [ ] Notifications on/off
- [ ] Privacy policy link
- [ ] Terms of service link
- [ ] About / Credits
- [ ] Version number
- [ ] Contact/Support

**Add to tab bar or header menu.**

---

### 12. Notifications
**Location:** Not yet implemented

**Use Cases:**
- Arrival notification (when near spot)
- Daily reminder to explore
- Achievement unlocks (all 10 spots!)
- New spots added

**Package:**
```bash
npm install expo-notifications
```

---

### 13. Offline Support
**Location:** Not yet implemented

**Features:**
- Cache spot data locally (already done via Zustand)
- Cache map tiles (if adding map view)
- Offline mode indicator
- Queue actions when offline

---

### 14. Gamification
**Location:** Not yet implemented

**Ideas:**
- Achievements/badges
  - "Night Explorer" (visit spot after 8pm)
  - "Early Bird" (visit before 8am)
  - "Speed Runner" (visit all 10 in one day)
  - "Completionist" (visit all spots)
- Leaderboard (fastest completion)
- Streaks (consecutive days exploring)
- Hidden bonus spots
- Limited-time event spots

---

### 15. Accessibility
**Location:** Partially implemented

**Improvements:**
- [ ] VoiceOver/TalkBack support
- [ ] Haptic patterns for directions
- [ ] Audio cues for proximity
- [ ] Color blind mode
- [ ] Font size adjustments
- [ ] High contrast mode

---

## 🔧 Developer Tools (Optional)

### 16. Error Tracking
**Options:**
- Sentry
- Bugsnag
- Firebase Crashlytics

**Benefits:**
- Production crash reports
- Error stack traces
- User impact metrics

---

### 17. Remote Config
**Options:**
- Firebase Remote Config
- Expo Updates

**Use Cases:**
- Feature flags
- A/B testing
- Update spot data without app update
- Emergency disable/maintenance mode

---

### 18. Backend API (Future Expansion)
**Location:** Currently fully client-side

**If Scaling:**
- User accounts
- Cloud-saved progress
- Social features
- Photo uploads
- Leaderboards
- Content management

**Tech Stack Ideas:**
- Firebase (easy start)
- Supabase (open source)
- AWS Amplify
- Custom Node.js/Express API

---

## 📊 Priority Matrix

| Priority | Item | Impact | Effort | Required for Launch |
|----------|------|--------|--------|-------------------|
| 🔴 Critical | AdMob Production IDs | High | Low | ✅ Yes |
| 🔴 Critical | Bundle Identifier | High | Low | ✅ Yes |
| 🔴 Critical | App Icon/Splash | High | Medium | ✅ Yes |
| 🔴 Critical | Privacy Policy | High | Medium | ✅ Yes |
| 🟡 High | Photo Feature | Medium | High | ⚠️ Recommended |
| 🟡 High | Settings Screen | Medium | Medium | ⚠️ Recommended |
| 🟢 Medium | Analytics | Medium | Low | ❌ Optional |
| 🟢 Medium | Onboarding | Medium | Medium | ❌ Optional |
| 🟢 Medium | Social Sharing | Low | Medium | ❌ Optional |
| 🟢 Low | Additional Spot Info | Low | High | ❌ Optional |
| 🟢 Low | Gamification | Low | High | ❌ Optional |
| 🟢 Low | Backend API | High | Very High | ❌ Future |

---

## ✅ MVP Launch Checklist

Before App Store/Play Store submission:

### Required
- [ ] Replace AdMob test IDs with production IDs
- [ ] Update bundle identifier (unique domain)
- [ ] Create custom app icon (1024×1024px)
- [ ] Create splash screen
- [ ] Write privacy policy
- [ ] Write terms of service
- [ ] Test on physical devices (iOS + Android)
- [ ] Test all 10 spot arrivals
- [ ] Verify GPS accuracy
- [ ] Verify compass calibration
- [ ] Test state persistence
- [ ] Handle all permissions gracefully
- [ ] Add version number in UI
- [ ] Create App Store screenshots
- [ ] Create Play Store screenshots
- [ ] Write app descriptions (EN + JA)
- [ ] Set up Apple Developer account ($99/year)
- [ ] Set up Google Play Developer account ($25 one-time)

### Recommended
- [ ] Implement photo feature OR remove button
- [ ] Add settings screen
- [ ] Add about/credits screen
- [ ] Implement crash reporting (Sentry)
- [ ] Add basic analytics
- [ ] Beta test with 10-20 users in Kobe
- [ ] Get legal review of privacy policy

### Optional (Post-Launch)
- [ ] Onboarding tutorial
- [ ] Social sharing
- [ ] Gamification
- [ ] More spot content
- [ ] Backend integration

---

## 🚀 Quick Commands

```bash
# Replace production ads
# 1. Update src/constants/ads.ts
# 2. Update app.json plugins section
npm run prebuild:clean
npx expo run:ios
npx expo run:android

# Test changes
npm test
npx tsc --noEmit
npm start

# Build for app stores (after all changes)
eas build --platform ios
eas build --platform android
```

---

**Last Updated:** 2026-02-18
**Status:** Development
**Next Milestone:** MVP Launch
