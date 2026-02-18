import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../constants/theme';

// Note: BannerAd component from react-native-google-mobile-ads requires dev build
// For now, we'll use a placeholder that can be replaced later

export const BannerAdWrapper: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Ad Space (Dev Build Required)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.accent.cyan,
  },
  placeholder: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.muted,
  },
});
