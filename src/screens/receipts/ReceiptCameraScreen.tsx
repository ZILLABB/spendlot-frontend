import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
// import { CameraView, CameraType, FlashMode } from 'expo-camera';
// import { BlurView } from 'expo-blur';
// import * as Haptics from 'expo-haptics';
// import { cameraService } from '../../services/cameraService';
import { Loading, Button } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
// import { CameraState } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReceiptCameraScreenProps {
  navigation: any;
}

export const ReceiptCameraScreen: React.FC<ReceiptCameraScreenProps> = ({ navigation }) => {
  // const cameraRef = useRef<CameraView>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate camera initialization
    setTimeout(() => {
      setIsReady(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  const handleCapture = async () => {
    if (isCapturing) return;

    try {
      setIsCapturing(true);

      // Simulate capture delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to preview screen with mock image
      navigation.navigate('ReceiptPreview', {
        imageUri: 'https://via.placeholder.com/400x600/f0f0f0/333333?text=Receipt+Image',
        source: 'camera',
      });
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture image');
    } finally {
      setIsCapturing(false);
    }
  };

  const openGallery = async () => {
    // Simulate gallery selection
    navigation.navigate('ReceiptPreview', {
      imageUri: 'https://via.placeholder.com/400x600/e0e0e0/666666?text=Gallery+Image',
      source: 'gallery',
    });
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Loading text="Initializing camera..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Animated.View style={[styles.cameraContainer, { opacity: fadeAnim }]}>
        {/* Mock Camera View */}
        <View style={styles.camera}>
          <View style={styles.mockCameraContent}>
            <Text style={styles.mockCameraText}>📷</Text>
            <Text style={styles.mockCameraSubtext}>Camera Preview</Text>
            <Text style={styles.mockCameraNote}>
              Camera functionality will be available when camera dependencies are installed
            </Text>
          </View>
        </View>

        {/* Receipt Guide Overlay */}
        <View style={styles.guideOverlay}>
          <View style={styles.guideFrame} />
          <Text style={styles.guideText}>
            Position receipt within the frame
          </Text>
        </View>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.controlIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={openGallery}
          >
            <Text style={styles.galleryIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonDisabled
            ]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <Loading size="small" color="white" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  mockCameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  mockCameraText: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  mockCameraSubtext: {
    fontSize: FONT_SIZES.xl,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  mockCameraNote: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
    borderWidth: 2,
    borderColor: COLORS.primary[400],
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: SPACING.lg,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
    color: 'white',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary[500],
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary[500],
  },
  placeholder: {
    width: 50,
    height: 50,
  },
});

export default ReceiptCameraScreen;
