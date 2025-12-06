
import { toast } from '@/hooks/use-toast';

// Types for the HumAI API
export interface HumeAIConfig {
  apiKey: string;
  configId?: string;
  enableFaceTracking: boolean;
  enableVoiceTracking: boolean;
}

export interface EmotionAnalysisResult {
  emotions: {
    name: string;
    score: number;
  }[];
  dominantEmotion: string;
  confidence: number;
  timestamp: number;
  facialFeatures?: Record<string, number>;
}

// Convert emotion score to intensity (0-100)
export const emotionScoreToIntensity = (score: number): number => {
  // HumeAI returns scores typically between 0-1
  return Math.min(100, Math.round(score * 100));
};

class HumeAIService {
  private apiKey: string | null = null;
  private configId: string | null = null;
  private webSocket: WebSocket | null = null;
  private isConnected = false;
  private enableFaceTracking = false;
  private enableVoiceTracking = false;
  private onEmotionCallback: ((result: EmotionAnalysisResult) => void) | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private mediaStream: MediaStream | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;
  
  // Map HumeAI emotion names to our internal emotion names
  private emotionMap: Record<string, string> = {
    'joy': 'happy',
    'amusement': 'happy',
    'contentment': 'calm',
    'surprise': 'surprised',
    'confusion': 'confused',
    'fear': 'fearful',
    'sadness': 'sad',
    'anger': 'angry',
    'disgust': 'disgusted',
    'anxiety': 'anxious',
    'distress': 'stressed',
    'boredom': 'bored'
  };
  
  configure(config: HumeAIConfig) {
    this.apiKey = config.apiKey;
    this.configId = config.configId || null;
    this.enableFaceTracking = config.enableFaceTracking;
    this.enableVoiceTracking = config.enableVoiceTracking;
    
    console.log('HumeAI service configured:', { 
      faceTracking: this.enableFaceTracking, 
      voiceTracking: this.enableVoiceTracking
    });
    
    return this;
  }
  
  onEmotion(callback: (result: EmotionAnalysisResult) => void) {
    this.onEmotionCallback = callback;
    return this;
  }
  
  // Initialize webcam and start facial emotion tracking
  async initializeFaceTracking(videoElement: HTMLVideoElement) {
    if (!this.apiKey) {
      console.error('HumeAI not configured: Missing API key');
      return false;
    }
    
    this.videoElement = videoElement;
    
    try {
      // Request webcam access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      this.videoElement.srcObject = this.mediaStream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        this.videoElement!.onloadedmetadata = () => {
          this.videoElement!.play().then(() => resolve());
        };
      });
      
      console.log('Webcam initialized for HumeAI face tracking');
      
      // Connect to HumeAI WebSocket
      await this.connectWebSocket();
      
      return true;
    } catch (error) {
      console.error('Error initializing webcam for HumeAI:', error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Veuillez autoriser l'accès à votre caméra pour l'analyse émotionnelle.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  private async connectWebSocket() {
    try {
      // Close existing connection if any
      if (this.webSocket) {
        this.webSocket.close();
      }
      
      // Connect to HumeAI WebSocket API
      this.webSocket = new WebSocket(`wss://api.hume.ai/v0/evi/chat?api_key=${this.apiKey}`);
      
      this.webSocket.onopen = () => {
        console.log('Connected to HumeAI WebSocket');
        this.isConnected = true;
        
        // Start sending frames if face tracking is enabled
        if (this.enableFaceTracking && this.videoElement) {
          this.startFaceAnalysis();
        }
      };
      
      this.webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.processEmotionData(data);
        } catch (error) {
          console.error('Error parsing HumeAI WebSocket message:', error);
        }
      };
      
      this.webSocket.onerror = (error) => {
        console.error('HumeAI WebSocket error:', error);
        this.isConnected = false;
      };
      
      this.webSocket.onclose = () => {
        console.log('HumeAI WebSocket connection closed');
        this.isConnected = false;
      };
    } catch (error) {
      console.error('Error connecting to HumeAI WebSocket:', error);
      this.isConnected = false;
    }
  }
  
  private startFaceAnalysis() {
    // Clear any existing interval
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    
    // Set up interval to capture and send frames for analysis
    this.analysisInterval = setInterval(() => {
      if (!this.isConnected || !this.videoElement) return;
      
      try {
        // Create a canvas to capture the current video frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        
        // Draw the current video frame on the canvas
        context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert the image to a base64 data URL
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Send the image to HumeAI for analysis
        if (this.webSocket && this.isConnected) {
          this.webSocket.send(JSON.stringify({
            type: 'face_analysis',
            image: imageData.split(',')[1] // Remove the data URL prefix
          }));
        }
      } catch (error) {
        console.error('Error capturing or sending video frame:', error);
      }
    }, 1000); // Analyze every second
  }
  
  private processEmotionData(data: any) {
    if (!data || !data.emotions) return;
    
    try {
      // Extract emotions from the response
      const emotions = data.emotions.map((emotion: any) => ({
        name: this.emotionMap[emotion.name.toLowerCase()] || emotion.name.toLowerCase(),
        score: emotion.score
      }));
      
      // Find the dominant emotion (highest score)
      const dominantEmotion = emotions.reduce(
        (max, emotion) => emotion.score > max.score ? emotion : max, 
        { name: 'neutral', score: 0 }
      );
      
      // Create the emotion analysis result
      const result: EmotionAnalysisResult = {
        emotions,
        dominantEmotion: dominantEmotion.name,
        confidence: dominantEmotion.score,
        timestamp: Date.now(),
        facialFeatures: data.facialFeatures || {}
      };
      
      // Call the callback with the result
      if (this.onEmotionCallback) {
        this.onEmotionCallback(result);
      }
    } catch (error) {
      console.error('Error processing HumeAI emotion data:', error);
    }
  }
  
  // Stop webcam and emotion tracking
  stop() {
    // Clear analysis interval
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    // Close WebSocket connection
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
    
    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    // Clear video element
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
    
    this.isConnected = false;
    console.log('HumeAI service stopped');
  }
  
  // Check if the service is currently active
  isActive() {
    return this.isConnected && (!!this.analysisInterval || !!this.webSocket);
  }
}

// Create a singleton instance
export const humeAIService = new HumeAIService();

// Initialize with API key from env
export const initializeHumeAI = (apiKey: string = "34CxF7DO2EPBwmmOTvl4y43QWUJmbahtpfvm7DVH40f16RIx") => {
  return humeAIService.configure({
    apiKey,
    enableFaceTracking: true,
    enableVoiceTracking: false
  });
};

export default humeAIService;
