import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { CameraSettings, ImageProcessingOptions, ReceiptScanResult } from '../types';

class CameraService {
  private defaultSettings: CameraSettings = {
    flashMode: 'auto',
    quality: 0.8,
    ratio: '16:9',
    autoFocus: true,
  };

  private defaultProcessingOptions: ImageProcessingOptions = {
    compress: 0.8,
    format: 'jpeg',
    base64: false,
    exif: true,
  };

  // Permission Management
  async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<{
    camera: boolean;
    mediaLibrary: boolean;
  }> {
    const [cameraResult, mediaResult] = await Promise.all([
      Camera.getCameraPermissionsAsync(),
      MediaLibrary.getPermissionsAsync(),
    ]);

    return {
      camera: cameraResult.status === 'granted',
      mediaLibrary: mediaResult.status === 'granted',
    };
  }

  // Camera Operations
  async takePicture(
    cameraRef: Camera.CameraView,
    customSettings?: Partial<CameraSettings>
  ): Promise<string | null> {
    try {
      if (!cameraRef) {
        throw new Error('Camera reference not available');
      }

      // Haptic feedback for premium feel
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const settings = { ...this.defaultSettings, ...customSettings };
      
      const photo = await cameraRef.takePictureAsync({
        quality: settings.quality,
        base64: false,
        exif: true,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture image');
      }

      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  }

  // Gallery Operations
  async pickFromGallery(
    allowsMultipleSelection: boolean = false
  ): Promise<string[]> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection,
      });

      if (result.canceled || !result.assets) {
        return [];
      }

      return result.assets.map(asset => asset.uri);
    } catch (error) {
      console.error('Error picking from gallery:', error);
      return [];
    }
  }

  // Image Processing
  async processReceiptImage(
    imageUri: string,
    options?: Partial<ImageProcessingOptions>
  ): Promise<ReceiptScanResult> {
    const startTime = Date.now();
    
    try {
      const processingOptions = { ...this.defaultProcessingOptions, ...options };

      // Auto-enhance the image for better OCR results
      const enhancedImage = await this.enhanceReceiptImage(imageUri);
      
      // Simulate OCR processing (replace with actual OCR service)
      const mockOcrResult = await this.simulateOCR(enhancedImage);

      const processingTime = Date.now() - startTime;

      return {
        imageUri: enhancedImage,
        confidence: mockOcrResult.confidence,
        detectedText: mockOcrResult.text,
        boundingBox: mockOcrResult.boundingBox,
        processingTime,
      };
    } catch (error) {
      console.error('Error processing receipt image:', error);
      
      return {
        imageUri,
        confidence: 0,
        processingTime: Date.now() - startTime,
      };
    }
  }

  private async enhanceReceiptImage(imageUri: string): Promise<string> {
    try {
      // Apply image enhancements for better OCR
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          // Auto-rotate based on EXIF
          { rotate: 0 },
          // Resize for optimal OCR processing
          { resize: { width: 1200 } },
        ],
        {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Error enhancing image:', error);
      return imageUri;
    }
  }

  private async simulateOCR(imageUri: string): Promise<{
    text: string;
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
  }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock OCR results - replace with actual OCR service
    const mockResults = [
      {
        text: "WHOLE FOODS MARKET\n123 Main St, City\nDate: 2024-01-15\nTotal: $45.67\nTax: $3.67\nSubtotal: $42.00",
        confidence: 0.92,
        boundingBox: { x: 50, y: 100, width: 300, height: 400 }
      },
      {
        text: "TARGET STORE\n456 Oak Ave\nDate: 2024-01-14\nTotal: $23.45\nTax: $1.89\nSubtotal: $21.56",
        confidence: 0.87,
        boundingBox: { x: 40, y: 80, width: 320, height: 450 }
      },
      {
        text: "STARBUCKS\n789 Coffee St\nDate: 2024-01-13\nTotal: $8.95\nTax: $0.72\nSubtotal: $8.23",
        confidence: 0.95,
        boundingBox: { x: 60, y: 120, width: 280, height: 350 }
      }
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }

  // Save to device
  async saveToDevice(imageUri: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        return false;
      }

      await MediaLibrary.saveToLibraryAsync(imageUri);
      
      // Haptic feedback for successful save
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      return true;
    } catch (error) {
      console.error('Error saving to device:', error);
      return false;
    }
  }

  // Utility methods
  async getImageDimensions(imageUri: string): Promise<{ width: number; height: number }> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // This is a workaround - in a real app, you'd use a proper image info library
      return { width: 1200, height: 1600 }; // Default dimensions
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return { width: 0, height: 0 };
    }
  }

  // Camera settings management
  getDefaultSettings(): CameraSettings {
    return { ...this.defaultSettings };
  }

  updateDefaultSettings(settings: Partial<CameraSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...settings };
  }
}

export const cameraService = new CameraService();
export default CameraService;
