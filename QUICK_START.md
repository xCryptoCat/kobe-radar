# Quick Start Guide - Kobe Radar

## Option 1: Development with Expo Go (Fastest)

Best for: Quick testing of UI without GPS/compass

```bash
# Start development server
npm start

# Scan QR code with Expo Go app on your phone
```

**Note**: GPS works, but compass may be unreliable. Ads show as placeholder.

## Option 2: Development Build (Recommended)

Best for: Full feature testing including ads

```bash
# Generate native projects
npm run prebuild:clean

# iOS (requires macOS + Xcode)
npx expo run:ios

# Android (requires Android Studio + Android SDK)
npx expo run:android
```

## Testing the App

### Mock Testing (Simulator)
1. Start app on simulator
2. Simulate location in Xcode (iOS) or Android Studio settings
3. Set location to Kobe coordinates: `34.6843, 135.1862`
4. Observe radar behavior

### Real-World Testing
1. Deploy to physical device
2. Go to actual Kobe location (or any outdoor area)
3. Select a destination
4. Walk toward destination
5. Observe:
   - Radar arrow points in correct direction
   - Distance decreases as you approach
   - Colors change: cyan → green → yellow → white
   - Arrival detected at < 100m (after 3 seconds)
   - Celebration screen with particles
   - Stamp appears in stamp card

## Common Issues

### "Location permission denied"
- Go to device Settings → Kobe Radar → Allow Location

### "Magnetometer not available"
- Compass requires physical device
- Simulator doesn't have magnetometer hardware

### Ads not showing
- Ads require development build (Option 2)
- Test ad IDs are configured and should work immediately

### TypeScript errors
```bash
npx tsc --noEmit
```
Should return 0 errors. If errors appear, check file imports.

## Development Commands

```bash
npm start           # Start Expo dev server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run in browser (limited features)
npm run prebuild    # Generate native projects
npm run prebuild:clean  # Clean rebuild native projects
```

## File Structure

```
/src
  /app          - Navigation
  /screens      - 4 main screens
  /components   - UI components by feature
  /hooks        - GPS, compass, radar logic
  /store        - Zustand state management
  /data         - 10 Kobe spot definitions
  /utils        - Geo calculations, formatters
  /constants    - Theme, ad IDs
  /types        - TypeScript definitions
```

## What to Test

- [ ] Destination selection works
- [ ] Radar displays and arrow rotates
- [ ] Distance updates in real-time
- [ ] Colors change based on proximity
- [ ] Arrival detection triggers at < 100m
- [ ] Haptic feedback on arrival
- [ ] Celebration particles animate
- [ ] Stamp appears in stamp card
- [ ] Back navigation works
- [ ] State persists after app restart

## Next Steps

1. Test on physical device
2. Walk to real Kobe location
3. Collect all 10 stamps
4. Prepare AdMob account for production ads
5. Build release APK/IPA for store submission

## Support

See README.md for full documentation.
See IMPLEMENTATION_SUMMARY.md for technical details.
