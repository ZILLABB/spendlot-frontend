import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
// import { BlurView } from 'expo-blur';
// import * as Haptics from 'expo-haptics';
// import { cameraService } from '../../services/cameraService';
import { Button, Loading, Card } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { ReceiptScanResult } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReceiptPreviewScreenProps {
  navigation: any;
  route: {
    params: {
      imageUri: string;
      source: 'camera' | 'gallery';
      scanResult?: ReceiptScanResult;
    };
  };
}

export const ReceiptPreviewScreen: React.FC<ReceiptPreviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { imageUri, source } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [showProcessingDetails, setShowProcessingDetails] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-process the image
    processImage();
  }, []);

  useEffect(() => {
    if (scanResult) {
      // Slide up results panel
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [scanResult]);

  const processImage = async () => {
    try {
      setIsProcessing(true);

      // Start progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      // Start pulse animation for processing indicator
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock OCR result
      const mockResult: ReceiptScanResult = {
        imageUri,
        confidence: 0.92,
        detectedText: "WHOLE FOODS MARKET\n123 Main St, City\nDate: 2024-01-15\nTotal: $45.67\nTax: $3.67\nSubtotal: $42.00",
        boundingBox: { x: 50, y: 100, width: 300, height: 400 },
        processingTime: 2000,
      };

      // Stop animations
      pulseAnimation.stop();
      pulseAnim.setValue(1);

      setScanResult(mockResult);

    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Processing Error', 'Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = async () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    if (!scanResult) return;

    navigation.navigate('ReceiptEdit', {
      imageUri,
      ocrData: {
        text: scanResult.detectedText,
        confidence: scanResult.confidence,
        boundingBox: scanResult.boundingBox,
      },
    });
  };

  const handleSaveToGallery = async () => {
    try {
      Alert.alert('Saved', 'Receipt saved to your photo gallery');
    } catch (error) {
      Alert.alert('Error', 'Failed to save receipt');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return COLORS.success[500];
    if (confidence >= 0.7) return COLORS.warning[500];
    return COLORS.error[500];
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.7) return 'Good';
    if (confidence >= 0.5) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleRetake}>
            <Text style={styles.controlIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.sourceText}>
            {source === 'camera' ? '📷 Camera' : '🖼️ Gallery'}
          </Text>

          <TouchableOpacity style={styles.controlButton} onPress={handleSaveToGallery}>
            <Text style={styles.controlIcon}>💾</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <Animated.View style={[styles.processingContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.processingIcon}>
                <Text style={styles.processingEmoji}>🔍</Text>
              </View>

              <Text style={styles.processingTitle}>Analyzing Receipt</Text>
              <Text style={styles.processingSubtitle}>
                Extracting text and data...
              </Text>

              <View style={styles.progressContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => setShowProcessingDetails(!showProcessingDetails)}
              >
                <Text style={styles.detailsButtonText}>
                  {showProcessingDetails ? 'Hide Details' : 'Show Details'}
                </Text>
              </TouchableOpacity>

              {showProcessingDetails && (
                <View style={styles.processingDetails}>
                  <Text style={styles.detailText}>• Enhancing image quality</Text>
                  <Text style={styles.detailText}>• Detecting text regions</Text>
                  <Text style={styles.detailText}>• Extracting merchant info</Text>
                  <Text style={styles.detailText}>• Parsing amounts and dates</Text>
                </View>
              )}
            </Animated.View>
          </View>
        )}
      </Animated.View>

      {/* Results Panel */}
      {scanResult && (
        <Animated.View 
          style={[
            styles.resultsPanel,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.resultsPanelHandle} />
          
          <ScrollView style={styles.resultsContent} showsVerticalScrollIndicator={false}>
            <Card style={styles.confidenceCard}>
              <View style={styles.confidenceHeader}>
                <Text style={styles.confidenceTitle}>Scan Quality</Text>
                <View style={[
                  styles.confidenceBadge,
                  { backgroundColor: getConfidenceColor(scanResult.confidence) }
                ]}>
                  <Text style={styles.confidenceBadgeText}>
                    {getConfidenceText(scanResult.confidence)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { 
                      width: `${scanResult.confidence * 100}%`,
                      backgroundColor: getConfidenceColor(scanResult.confidence)
                    }
                  ]}
                />
              </View>
              
              <Text style={styles.confidencePercentage}>
                {Math.round(scanResult.confidence * 100)}% confidence
              </Text>
            </Card>

            {scanResult.detectedText && (
              <Card style={styles.textCard}>
                <Text style={styles.textCardTitle}>Detected Text</Text>
                <Text style={styles.detectedText}>{scanResult.detectedText}</Text>
              </Card>
            )}

            <Card style={styles.statsCard}>
              <Text style={styles.statsTitle}>Processing Stats</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Processing Time:</Text>
                <Text style={styles.statsValue}>{scanResult.processingTime}ms</Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Source:</Text>
                <Text style={styles.statsValue}>{source}</Text>
              </View>
            </Card>
          </ScrollView>

          <View style={styles.actionButtons}>
            <Button
              title="Retake"
              onPress={handleRetake}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.actionButton}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
    fontWeight: 'bold',
  },
  sourceText: {
    color: 'white',
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    margin: SPACING.lg,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  processingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  processingEmoji: {
    fontSize: 40,
  },
  processingTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  processingSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: 2,
  },
  detailsButton: {
    paddingVertical: SPACING.xs,
  },
  detailsButtonText: {
    color: COLORS.primary[600],
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  processingDetails: {
    marginTop: SPACING.md,
    alignSelf: 'stretch',
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  resultsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  resultsPanelHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resultsContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  confidenceCard: {
    marginBottom: SPACING.md,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  confidenceTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  confidenceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  confidenceBadgeText: {
    color: 'white',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidencePercentage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  textCard: {
    marginBottom: SPACING.md,
  },
  textCardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  detectedText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
    fontFamily: 'monospace',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  statsCard: {
    marginBottom: SPACING.lg,
  },
  statsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  statsValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default ReceiptPreviewScreen;
