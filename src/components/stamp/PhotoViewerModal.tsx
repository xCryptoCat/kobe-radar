import React from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { theme } from '../../constants/theme';

interface PhotoViewerModalProps {
  visible: boolean;
  photoUri: string | null;
  spotName: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  visible,
  photoUri,
  spotName,
  onClose,
}) => {
  if (!photoUri) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{spotName}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        </View>
        <TouchableOpacity
          style={styles.closeButtonBottom}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text.primary,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  closeButtonBottom: {
    margin: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.accent.cyan,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
});
