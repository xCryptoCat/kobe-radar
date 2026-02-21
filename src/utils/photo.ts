import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

export const takePhoto = async (): Promise<string | null> => {
  // Request camera permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  // Launch camera
  const result = await ImagePicker.launchCameraAsync({
    quality: 0.7,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  // Copy from cache to persistent document directory
  const asset = result.assets[0];
  const filename = `photo_${Date.now()}.jpg`;

  // Get document directory (ensure it exists)
  const docDir = FileSystem.documentDirectory;
  if (!docDir) {
    return null;
  }

  const photosDir = `${docDir}photos/`;
  const destPath = `${photosDir}${filename}`;

  // Ensure photos directory exists
  try {
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }

  // Copy photo to persistent storage
  await FileSystem.copyAsync({ from: asset.uri, to: destPath });

  return destPath;
};
