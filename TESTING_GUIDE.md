# Kobe Radar - Testing Guide

## ✅ Automated Test Results

**All 50 unit tests PASSING** ✓

### Test Coverage Summary

#### 1. Geo Utility Functions (22 tests)
- ✓ Haversine distance calculation (real Kobe coordinates tested)
- ✓ Bearing calculation (0-360° normalization)
- ✓ Relative angle calculation (handles 360° wrapping)
- ✓ Proximity zone detection (arrived/near/medium/far)
- ✓ Edge cases: North/South Pole, Prime Meridian, floating point precision

#### 2. Radar Position Calculations (15 tests)
- ✓ Multi-zone scaling (0-100m, 100-500m, 500-2000m, >2000m)
- ✓ Polar to Cartesian coordinate conversion
- ✓ SVG positioning for all angles (0°, 90°, 180°, 270°, 45°)
- ✓ Negative angle wrapping
- ✓ Different radar sizes

#### 3. Edge Cases & Boundaries (8 tests)
- ✓ Extreme coordinates (poles, date line)
- ✓ Floating point precision
- ✓ Zero and negative values
- ✓ Arrival threshold detection

#### 4. Integration Tests (3 tests)
- ✓ Complete navigation flow
- ✓ Arrival detection scenarios

#### 5. Performance Tests (2 tests)
- ✓ 3000 rapid calculations in < 100ms
- ✓ All 576 angle combinations tested

---

## 🧪 Manual Testing Checklist

### Pre-Testing Setup
- [ ] Device has GPS enabled
- [ ] Device has magnetometer (compass)
- [ ] Location permissions granted
- [ ] In Kobe area OR using location mock

### A. Navigation Flow Tests

#### Test 1: Destination Selection
**Steps:**
1. Launch app
2. View list of 10 Kobe destinations
3. Tap on a destination card
4. Verify card shows cyan border when selected
5. Tap a different destination
6. Verify only new selection is highlighted

**Expected:**
- ✓ All 10 destinations visible
- ✓ Status badges show "未到達" (unvisited) for new spots
- ✓ Status badges show "到達済" (visited) with green color for visited spots
- ✓ Only one destination selected at a time
- ✓ "探索をはじめる" button enabled when spot selected
- ✓ "探索をはじめる" button disabled when no selection

#### Test 2: Radar Navigation Screen
**Steps:**
1. Select a destination
2. Tap "探索をはじめる"
3. Observe radar display

**Expected:**
- ✓ Radar shows 4 concentric circles
- ✓ Yellow arrow points toward destination
- ✓ Arrow rotates as device heading changes
- ✓ Coordinate bar shows current location (lat/lng)
- ✓ Distance displayed in meters (large) and in coordinate bar
- ✓ Destination dot appears on radar when in range
- ✓ Destination dot color matches spot color (or green if visited)
- ✓ Tap destination dot shows tooltip with spot name
- ✓ "探索を中止" button returns to destination select

#### Test 3: Arrival Celebration
**Steps:**
1. Navigate to within 100m of destination
2. Wait 3 seconds (debounce)
3. Observe celebration screen

**Expected:**
- ✓ Haptic feedback on arrival
- ✓ Particle animation plays (8 particles, subtle)
- ✓ Text shows "探索コンプリート!" and spot name
- ✓ Fade-in animation smooth (400ms)
- ✓ "スタンプ台帳へ" button visible
- ✓ "記念フォトを撮る" button visible (shows "Coming Soon")

#### Test 4: Stamp Collection
**Steps:**
1. From celebration screen, tap "スタンプ台帳へ"
2. View stamp grid

**Expected:**
- ✓ Grid shows 10 stamps (5 columns × 2 rows)
- ✓ Visited stamps show colored icon + checkmark
- ✓ Unvisited stamps show gray icon
- ✓ Header shows count "X/10 スポット獲得"
- ✓ Back button returns to destination select
- ✓ Stamp emoji badge in top-right of destination select screen

### B. Bottom Tab Navigation Tests

#### Test 5: Tab Bar Functionality
**Steps:**
1. View bottom tab bar
2. Tap "探索" tab
3. Tap "スタンプ" tab
4. Switch between tabs multiple times

**Expected:**
- ✓ Tab bar background matches UI (secondary background, no harsh borders)
- ✓ Active tab shows cyan color
- ✓ Inactive tab shows muted color
- ✓ Haptic feedback on tap
- ✓ Subtle scale animation on press
- ✓ Icons scale correctly (24px)
- ✓ Tab bar hidden during radar navigation
- ✓ Tab bar hidden during celebration

### C. Radar Accuracy Tests

#### Test 6: Distance Zones
**Test zones at different distances:**

| Distance | Zone | Color | Expected Behavior |
|----------|------|-------|-------------------|
| 0-99m | Arrived | White | Triggers arrival after 3s |
| 100-199m | Near | Yellow | Close proximity |
| 200-499m | Medium | Blue | Medium range |
| 500m+ | Far | Cyan | Long distance |

**Expected:**
- ✓ Radar circles change color based on zone
- ✓ Distance updates in real-time
- ✓ No jitter or rapid zone switching

#### Test 7: Compass Accuracy
**Steps:**
1. Start navigation
2. Rotate device 360°
3. Observe arrow rotation

**Expected:**
- ✓ Arrow points consistently toward destination
- ✓ Smooth rotation (no jitter)
- ✓ 0° points north when facing north
- ✓ 90° points east when facing east
- ✓ 180° points south when facing south
- ✓ 270° points west when facing west

#### Test 8: Destination Dot Positioning
**Steps:**
1. Navigate at various distances
2. Walk in circle around destination
3. Observe dot movement

**Expected:**
- ✓ Dot position scales correctly:
  - 0-100m: 0-50% of radar radius
  - 100-500m: 50-80% of radar radius
  - 500-2000m: 80-100% of radar radius
  - >2000m: Clamped at edge
- ✓ Dot moves smoothly
- ✓ Dot rotates around center as you move

### D. State Persistence Tests

#### Test 9: Visited Spots Persistence
**Steps:**
1. Visit a spot (trigger arrival)
2. Force close app
3. Reopen app
4. Check destination list and stamp card

**Expected:**
- ✓ Visited spot shows "到達済" badge (green)
- ✓ Visited spot shows green color in stamp card
- ✓ Visit count persists in header
- ✓ Timestamp saved (check AsyncStorage)

#### Test 10: Navigation State
**Steps:**
1. Select destination
2. Start navigation
3. Press home button (background app)
4. Return to app

**Expected:**
- ✓ Radar continues to update
- ✓ Current destination still active
- ✓ GPS tracking continues

### E. Edge Case Tests

#### Test 11: GPS Accuracy
**Test with various GPS conditions:**

**Good GPS (outdoor, clear sky):**
- [ ] Distance accuracy ±5-10m
- [ ] Smooth position updates

**Poor GPS (indoor, urban canyon):**
- [ ] App doesn't crash
- [ ] Shows "位置情報を取得中..." when no GPS
- [ ] 100m threshold accounts for drift

**No GPS permission:**
- [ ] App requests permission
- [ ] Graceful degradation

#### Test 12: Compass Calibration
**Steps:**
1. Start app with uncalibrated compass
2. Observe arrow behavior
3. Calibrate compass (figure-8 motion)
4. Observe improvement

**Expected:**
- ✓ Arrow may jitter when uncalibrated
- ✓ Low-pass filter (alpha=0.15) smooths readings
- ✓ No infinite loops or crashes

#### Test 13: Multiple Arrivals
**Steps:**
1. Visit spot A (trigger arrival)
2. Return to destination select
3. Navigate to spot A again
4. Trigger arrival again

**Expected:**
- ✓ Spot already marked as visited
- ✓ Celebration still shows
- ✓ Timestamp updates
- ✓ No duplicate entries in store

#### Test 14: Rapid Navigation Cancel
**Steps:**
1. Start navigation
2. Immediately tap "探索を中止"
3. Repeat 5 times quickly

**Expected:**
- ✓ No crashes
- ✓ Clean state transition
- ✓ No memory leaks

### F. UI Consistency Tests

#### Test 15: Theme Consistency
**Check all screens:**

**Color Palette:**
- ✓ Background primary: #0D0D0D (black)
- ✓ Background secondary: #1A1A2E (dark blue-gray)
- ✓ Card background: #252541 (purple-gray)
- ✓ Cyan accent: #00F5D4 (active elements)
- ✓ Text primary: #FFFFFF (white)
- ✓ Text muted: #6B6B8C (gray)

**Typography:**
- ✓ All Japanese text renders correctly
- ✓ Font sizes consistent (xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32)
- ✓ Font weights consistent (normal, 600, bold)

#### Test 16: Responsive Layout
**Test on different screen sizes:**

**Small phone (iPhone SE):**
- [ ] Radar scales correctly
- [ ] Buttons don't overlap
- [ ] Text readable

**Large phone (iPhone Pro Max):**
- [ ] Radar centered
- [ ] Safe areas respected
- [ ] No excessive white space

**Tablet (optional):**
- [ ] Layout scales appropriately

### G. Performance Tests

#### Test 17: Animation Performance
**Check frame rates:**

**Radar screen:**
- [ ] Arrow rotation: 60 FPS
- [ ] Distance updates: Smooth
- [ ] Dot movement: No lag

**Celebration:**
- [ ] Particle animation: Smooth
- [ ] Fade-in: Clean
- [ ] No dropped frames

**Tab bar:**
- [ ] Press animation: Instant
- [ ] No delay

#### Test 18: Memory Usage
**Steps:**
1. Navigate between all screens
2. Visit multiple spots
3. Switch tabs repeatedly
4. Monitor memory

**Expected:**
- ✓ No memory leaks
- ✓ Stable memory usage
- ✓ No crashes after extended use

### H. AdMob Tests (Development Build Only)

#### Test 19: Banner Ads
**Steps:**
1. Build development version
2. Launch app
3. Observe banner ads on each screen

**Expected:**
- ✓ Test banner shows at bottom
- ✓ Doesn't overlap content
- ✓ Safe area respected
- ✓ Loads correctly

---

## 🐛 Known Issues & Limitations

### Expected Behavior:
1. **GPS accuracy:** 100m arrival threshold accounts for urban GPS drift
2. **Compass jitter:** Low-pass filter reduces but doesn't eliminate all movement
3. **Simulator limitations:** GPS/Compass require physical device for testing
4. **AdMob:** Requires development build (not Expo Go)

### Edge Cases Handled:
- ✓ Coordinates across date line (180°/-180°)
- ✓ Coordinates near poles
- ✓ Angle wrapping at 0°/360° boundary
- ✓ Very small distances (<1m)
- ✓ Very large distances (>2000m)
- ✓ Floating point precision

---

## 📊 Test Results Summary

### Automated Tests
- **Total:** 50 tests
- **Passed:** 50 ✅
- **Failed:** 0
- **Coverage:** Core utilities 100%

### Manual Testing Status
Use this checklist for QA testing:
- [ ] Navigation Flow (4 tests)
- [ ] Tab Navigation (1 test)
- [ ] Radar Accuracy (3 tests)
- [ ] State Persistence (2 tests)
- [ ] Edge Cases (4 tests)
- [ ] UI Consistency (2 tests)
- [ ] Performance (2 tests)
- [ ] AdMob (1 test)

**Total Manual Tests:** 19

---

## 🚀 How to Run Tests

### Automated Tests
```bash
# Run all tests
npm test

# Run with verbose output
npm run test:verbose

# Run with coverage report
npm run test:coverage

# Watch mode (re-run on file changes)
npm test -- --watch
```

### Manual Testing
```bash
# Development server
npm start

# Android device
npm run android

# iOS device (requires macOS + Xcode)
npm run ios

# Development build (for AdMob testing)
npm run prebuild:clean
npx expo run:ios    # or
npx expo run:android
```

---

## 📝 Test Data

### Kobe Spot Coordinates (for manual testing)
1. Meriken Park: 34.6861°N, 135.1874°E
2. Nankinmachi: 34.6906°N, 135.1929°E
3. Kitano Ijinkan: 34.6950°N, 135.1889°E
4. Shin-Kobe Ropeway: 34.7029°N, 135.1760°E
5. Sannomiya Center: 34.6950°N, 135.1950°E
6. Harbor Land: 34.6835°N, 135.1860°E
7. Port Tower: 34.6851°N, 135.1863°E
8. Kobe Earthquake Museum: 34.6854°N, 135.1881°E
9. Ikuta Shrine: 34.6914°N, 135.1935°E
10. Motomachi Shopping: 34.6888°N, 135.1902°E

### Test Scenarios by Location
**Near Meriken Park:** Test arrival detection, multiple spots nearby
**Near Shin-Kobe:** Test long distances, radar edge cases
**Indoor (Sannomiya Station):** Test poor GPS conditions

---

## 🎯 Success Criteria

### Core Functionality
- [x] All automated tests pass
- [ ] All manual tests pass
- [ ] No crashes during normal use
- [ ] GPS accuracy within expected range
- [ ] Compass accuracy acceptable
- [ ] State persists correctly

### User Experience
- [ ] UI matches design (clean, minimal)
- [ ] Animations smooth (no lag)
- [ ] Navigation intuitive
- [ ] Japanese text displays correctly
- [ ] Haptic feedback feels good

### Performance
- [ ] 60 FPS during navigation
- [ ] < 100ms for 3000 calculations
- [ ] No memory leaks
- [ ] Battery usage reasonable

---

**Last Updated:** 2026-02-18
**Test Version:** 1.0.0
**Platform:** React Native (Expo) - iOS/Android
