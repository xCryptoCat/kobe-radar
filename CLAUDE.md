# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kobe Radar is a location-based exploration app for Kobe, Japan. Users navigate to 10 preset destinations using **only a radar UI** showing direction and distance — no maps. Built with Expo/React Native + TypeScript.

## Development Commands

### Running the App
```bash
npm start                 # Start Expo dev server
npm start -- --tunnel     # Start with tunnel (for remote testing)
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator (macOS only)
```

### Development Builds (Required for AdMob)
```bash
npm run prebuild:clean   # Generate native projects (clean rebuild)
npx expo run:ios         # Build and run iOS dev build
npx expo run:android     # Build and run Android dev build
```

### Type Checking
```bash
npx tsc --noEmit         # Check TypeScript errors (should be 0)
```

## Critical Architecture Patterns

### 1. Hook Composition Pattern (Radar System)
The radar navigation system uses a **three-layer hook composition**:

- `useLocation()` → GPS tracking with expo-location
- `useCompass()` → Magnetometer heading with low-pass filter (alpha=0.15)
- `useRadar(targetCoords, onArrival)` → **Combines both** + geo calculations

**Important**: `useRadar` uses `useRef` for callback stability to prevent infinite loops. When modifying:
- Never add callbacks directly to dependency arrays
- Use functional `setState` with threshold checks (only update if distance/angle changes >1 unit)
- See `src/hooks/useRadar.ts:32-46` for pattern

### 2. State Management Architecture
Uses **Zustand with persist middleware** to AsyncStorage:
- Store lives in `src/store/spotStore.ts`
- Persists visited spots with timestamps
- Access via: `const { markVisited, isVisited } = useSpotStore()`
- **Never mutate** visited spots directly — always use actions

### 3. Geo Calculations (src/utils/geo.ts)
Core algorithms verified against real Kobe coordinates:
- **Haversine distance**: Great-circle distance in meters (verified: Meriken→Nankinmachi = ~940m)
- **Bearing calculation**: Initial bearing 0-360° (verified: Meriken→Kitano = ~12-15°)
- **Relative angle**: `(bearing - heading + 360) % 360` — drives arrow rotation
- **Proximity zones**: arrived (<100m), near (100-200m), medium (200-500m), far (>500m)

### 4. Navigation Flow
```
DestinationSelectScreen
  ↓ (select spot + tap "探索をはじめる")
RadarNavigationScreen (useRadar hook)
  ↓ (arrival detection: <100m for 3 seconds)
ArrivalCelebrationScreen (markVisited called)
  ↓ (tap "スタンプ台帳へ")
StampCardScreen
```

### 5. Animation Architecture
**Important**: This app does NOT use react-native-reanimated (causes Worklets version conflicts).
- Uses React Native's built-in `Animated` API instead
- DirectionArrow: SVG transform rotation (no animation library)
- ParticleEffect: Animated.timing with interpolation
- CompletionOverlay: Animated.spring for scale/opacity

**If adding animations**: Use `Animated.Value` + `useRef`, NOT `useSharedValue` from reanimated.

## Key Files to Understand

### Core Logic
- `src/hooks/useRadar.ts` — Main radar logic, arrival detection, threshold updates
- `src/utils/geo.ts` — Haversine, bearing, relative angle calculations
- `src/store/spotStore.ts` — Zustand store with AsyncStorage persistence

### Data
- `src/data/spots.ts` — 10 Kobe destinations with lat/lng/color (hardcoded)

### Theme
- `src/constants/theme.ts` — Dark theme (#0D0D0D) with cyan/teal neon accents
- All components use this centralized theme (no inline colors)

## Common Issues & Solutions

### Infinite Loop Errors
If you see "Maximum update depth exceeded":
1. Check `useEffect` dependencies in hooks
2. Ensure callbacks use `useRef` pattern (see useRadar)
3. Add threshold checks before `setState` (don't update if value hasn't changed significantly)

### GPS/Compass Not Working
- **GPS**: Requires physical device or simulator location mock
- **Compass**: Requires physical device (magnetometer unavailable in simulators)
- Test with: `npx expo start --tunnel` + scan QR on physical device

### AdMob Ads Not Showing
- Ads require **development build**, won't work in Expo Go
- Currently using test ad unit IDs (safe for dev)
- To use real ads: Update `app.json` plugins + `src/constants/ads.ts` → run `npm run prebuild:clean`

## Testing on Physical Device

Best workflow for testing location features:
```bash
# Start with tunnel (works from anywhere)
npx expo start --tunnel

# Scan QR code with Expo Go app
# Or enter manually: exp://[tunnel-url]
```

GPS accuracy: 100m arrival threshold accounts for urban GPS drift in Kobe.

## Important Constraints

1. **No react-native-reanimated** — Use built-in Animated API only
2. **Arrival threshold: 100m** — Don't change without testing real GPS accuracy
3. **Debounce: 3 seconds** — Prevents false arrivals from GPS jitter
4. **10 hardcoded spots** — Coordinates in `src/data/spots.ts` (verified against Google Maps)
5. **Dark theme only** — App designed for nighttime exploration
6. **Japanese text labels** — UI text is in Japanese (e.g., "探索をはじめる")

## Modifying Spot Data

To add/change destinations:
1. Edit `src/data/spots.ts`
2. Add coordinates (use Google Maps for accuracy)
3. Assign unique color (hex) for stamp icon
4. Update stamp grid if changing total count (currently 5 columns for 10 spots)

## AdMob Production Setup

When ready for production ads:
1. Create AdMob account → register app
2. Create Banner + Interstitial ad units
3. Update `app.json` → `plugins` → `react-native-google-mobile-ads` with real app IDs
4. Update `src/constants/ads.ts` with real unit IDs
5. Run `npm run prebuild:clean` to regenerate native projects
