import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, RotateCcw, Download, X, AlertCircle } from 'lucide-react';
import { usePictureToVideoStore, createPictureFile } from '@/context/store/pictureToVideoStore';

interface CameraPickerProps {
  maxFiles: number;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export const CameraPicker = ({ maxFiles }: CameraPickerProps) => {
  const { selectedFiles, addFiles } = usePictureToVideoStore();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);

  // Check if camera is available
  const checkCameraAvailability = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setCameraError('카메라를 찾을 수 없습니다.');
        return false;
      }
      return true;
    } catch {
      setCameraError('카메라 접근 권한이 필요합니다.');
      return false;
    }
  }, []);

  const startCamera = useCallback(async () => {
    const hasCamera = await checkCameraAvailability();
    if (hasCamera) {
      setIsCameraOpen(true);
      setCameraError('');
    }
  }, [checkCameraAvailability]);

  const stopCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const newPhoto: CapturedPhoto = {
          id: `camera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dataUrl: imageSrc,
          timestamp: Date.now()
        };
        setCapturedPhotos(prev => [newPhoto, ...prev]);
      }
    }
  }, []);

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const removeCapturedPhoto = useCallback((photoId: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  }, []);

  const addCapturedPhotosToSelection = useCallback(() => {
    const remainingSlots = maxFiles - selectedFiles.length;
    const photosToAdd = capturedPhotos.slice(0, remainingSlots);
    
    const pictureFiles = photosToAdd.map(photo => {
      // Convert data URL to File object
      const byteCharacters = atob(photo.dataUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], `camera-photo-${photo.timestamp}.jpg`, {
        type: 'image/jpeg',
        lastModified: photo.timestamp
      });
      
      return createPictureFile(file, 'camera');
    });
    
    addFiles(pictureFiles);
    setCapturedPhotos([]);
  }, [capturedPhotos, selectedFiles.length, maxFiles, addFiles]);

  // HTTPS 및 카메라 지원 확인
  const isSecureContext = location.protocol === 'https:' || location.hostname === 'localhost';
  const isCameraSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  return (
    <div className="p-6 space-y-6">
      {/* Camera Support & Security Warnings */}
      {(!isCameraSupported || !isSecureContext) && (
        <div className="space-y-4">
          {!isCameraSupported && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <CameraOff className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">카메라 지원 안됨</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>현재 브라우저에서 카메라 기능을 지원하지 않습니다.</p>
                    <p className="mt-1">Chrome, Firefox, Safari 등 최신 브라우저를 사용해주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isSecureContext && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">보안 연결 필요</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>카메라 접근을 위해서는 HTTPS 연결이 필요합니다.</p>
                    <p className="mt-1">개발 환경에서는 localhost를 사용하거나, 운영 환경에서는 HTTPS를 설정해주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">카메라 오류</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{cameraError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">카메라로 사진 촬영</h3>
          
          {!isCameraOpen ? (
            <button
              onClick={startCamera}
              disabled={!isSecureContext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Camera className="w-4 h-4" />
              카메라 시작
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              카메라 종료
            </button>
          )}
        </div>

        {/* Camera View */}
        {isCameraOpen && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full"
              onUserMediaError={(error) => {
                console.error('Camera error:', error);
                setCameraError('카메라를 시작할 수 없습니다. 권한을 확인해주세요.');
                setIsCameraOpen(false);
              }}
            />
            
            {/* Camera Controls Overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <button
                onClick={toggleCamera}
                className="p-3 bg-gray-800 bg-opacity-75 text-white rounded-full hover:bg-opacity-100 transition-all"
                title="카메라 전환"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <button
                onClick={capture}
                className="p-4 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all"
                title="사진 촬영"
              >
                <Camera className="w-8 h-8 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Captured Photos */}
      {capturedPhotos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              촬영된 사진 ({capturedPhotos.length})
            </h3>
            
            {capturedPhotos.length > 0 && (
              <button
                onClick={addCapturedPhotosToSelection}
                disabled={selectedFiles.length >= maxFiles}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                선택에 추가
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {capturedPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.dataUrl}
                  alt={`촬영된 사진`}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                
                <button
                  onClick={() => removeCapturedPhoto(photo.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  aria-label="사진 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• 카메라 기능은 HTTPS 환경에서만 사용 가능합니다</p>
        <p>• 브라우저에서 카메라 접근 권한을 허용해주세요</p>
        <p>• 모바일에서는 전면/후면 카메라를 전환할 수 있습니다</p>
        {selectedFiles.length >= maxFiles && (
          <p className="text-red-500">• 최대 {maxFiles}개까지 선택 가능합니다</p>
        )}
      </div>
    </div>
  );
};