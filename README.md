# Kobe Radar - Town Exploration App

A location-based exploration app for Kobe where users navigate to 10 preset destinations using only a radar UI showing direction and distance — no maps.

## Features

- **Radar Navigation**: Navigate using a real-time SVG radar display with direction arrow and proximity-based color transitions
- **10 Kobe Destinations**: Explore famous Kobe locations including Meriken Park, Kitano Ijinkan, and more
- **Stamp Collection**: Collect stamps at each visited location in your digital stamp card
- **Arrival Celebration**: Particle burst animation and celebration screen upon arrival
- **Persistent Progress**: Your visited locations are saved using AsyncStorage
- **Dark Theme**: Cyan/teal neon aesthetic with dark background

## Tech Stack

- **Expo SDK** with TypeScript
- **React Navigation** (native stack)
- **Zustand** + AsyncStorage for state persistence
- **react-native-svg** + **react-native-reanimated** for radar UI
- **expo-location** + **expo-sensors** for GPS + compass
- **expo-haptics** for arrival feedback
- **react-native-google-mobile-ads** (test ads only, requires dev build)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For physical device testing: Expo Go app (iOS/Android)
- For dev build: Xcode (iOS) or Android Studio (Android)

### Installation

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Or run directly on device
npm run ios      # iOS Simulator (macOS only)
npm run android  # Android Emulator
```

### Testing Location Features

The app requires GPS and compass sensors to function properly:

1. **Expo Go (Development)**:
   - GPS works on physical devices
   - Compass may not work reliably
   - Use physical device for best testing experience

2. **Development Build (Recommended)**:
   ```bash
   # Create development build with ads
   npm run prebuild:clean
   npx expo run:ios      # or run:android
   ```

3. **Mock Locations (Development)**:
   - The app will display "位置情報を取得中..." if GPS is unavailable
   - For simulator testing, you can mock GPS location in Xcode/Android Studio

## Project Structure

```
/home/ec2-user/u/
  App.tsx                      # Main app entry point
  src/
    app/
      AppNavigator.tsx         # Navigation configuration
    screens/
      DestinationSelectScreen.tsx      # Spot selection screen
      RadarNavigationScreen.tsx        # Main radar navigation
      ArrivalCelebrationScreen.tsx     # Celebration on arrival
      StampCardScreen.tsx              # Stamp collection view
    components/
      radar/                    # SVG radar components
      destination/              # Destination list components
      stamp/                    # Stamp card components
      celebration/              # Particle effects & overlays
      common/                   # Shared UI components
    hooks/
      useLocation.ts            # GPS tracking
      useCompass.ts             # Magnetometer heading
      useRadar.ts               # Combined radar logic
    store/
      spotStore.ts              # Zustand state management
    data/
      spots.ts                  # 10 Kobe destination coordinates
    utils/
      geo.ts                    # Haversine, bearing, proximity calculations
      format.ts                 # Distance/coordinate formatting
    constants/
      theme.ts                  # Dark theme colors & spacing
      ads.ts                    # AdMob test unit IDs
```

## Core Algorithms

### Haversine Distance Calculation
Calculates great-circle distance between two GPS coordinates:
- Meriken Park → Nankinmachi: ~940m (verified)
- Formula: `R * 2 * atan2(√a, √(1-a))`

### Bearing Calculation
Calculates initial bearing from user to target (0-360°):
- Meriken Park → Kitano Ijinkan: ~12-15° north (verified)
- Formula: `atan2(y, x)` with coordinate deltas

### Relative Angle for Radar Arrow
Arrow rotation = `(bearing - heading + 360) % 360`

### Proximity Zones
- **Arrived**: < 100m (white glow)
- **Near**: 100-200m (yellow)
- **Medium**: 200-500m (green)
- **Far**: > 500m (cyan)

## Arrival Detection

- **Threshold**: 100 meters (generous for GPS accuracy)
- **Debounce**: 3 seconds sustained within threshold
- **Feedback**: Haptic notification + navigation to celebration screen
- **Persistence**: Automatically marked as visited in Zustand store

## AdMob Integration

Currently using **Google test ad unit IDs** only. Safe for development.

### Swapping to Production Ads

1. Create AdMob account at https://admob.google.com
2. Register app and create ad units (Banner + Interstitial)
3. Update `app.json`:
   ```json
   "plugins": [
     [
       "react-native-google-mobile-ads",
       {
         "androidAppId": "ca-app-pub-XXXXX~YYYYY",
         "iosAppId": "ca-app-pub-XXXXX~YYYYY"
       }
     ]
   ]
   ```
4. Update `src/constants/ads.ts` with real unit IDs
5. Run `npm run prebuild:clean`

## Known Limitations

- **Photo Feature**: Button shows "Coming Soon" alert (future feature)
- **Ads**: Placeholder component in Expo Go, requires dev build for real ads
- **Compass**: May not work in simulator, requires physical device
- **GPS Accuracy**: 100m threshold accounts for urban GPS drift

## Verification Checklist

- ✅ TypeScript compilation (0 errors)
- ✅ All 4 screens implemented
- ✅ All components created (radar, destination, stamp, celebration)
- ✅ Hooks implemented (useLocation, useCompass, useRadar)
- ✅ Geo calculations (haversine, bearing, proximity zones)
- ✅ Zustand store with AsyncStorage persistence
- ✅ 10 Kobe spots with coordinates
- ✅ Dark theme with cyan/teal neon colors
- ✅ Navigation flow complete
- ✅ Arrival detection with haptic feedback
- ✅ Stamp card grid (5 columns, visited/unvisited states)

## Future Enhancements

1. **Photo Feature**: Implement camera integration for arrival photos
2. **Real Ads**: Swap to production AdMob IDs
3. **Interstitial Ads**: Add on screen transitions
4. **Sound Effects**: Audio feedback for proximity changes
5. **Social Sharing**: Share completed stamp card
6. **Leaderboard**: Track visit times and compare with friends
7. **More Cities**: Expand beyond Kobe (Tokyo, Osaka, etc.)

## License

Private development project for Play Store experience and market validation.

## Contact

For issues or feedback, open an issue on GitHub.
