import { useRef, useCallback, useState } from 'react';
import { Image, Upload, X, Smartphone } from 'lucide-react';
import { usePictureToVideoStore, createPictureFile, validateImageFile } from '@/context/store/pictureToVideoStore';

interface PhotoLibraryPickerProps {
  acceptedFileTypes: string[];
  maxFiles: number;
}

export const PhotoLibraryPicker = ({ acceptedFileTypes, maxFiles }: PhotoLibraryPickerProps) => {
  const { selectedFiles, addFiles, removeFile } = usePictureToVideoStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(validateImageFile);
      const remainingSlots = maxFiles - selectedFiles.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      const pictureFiles = filesToAdd.map(file => createPictureFile(file, 'library'));
      addFiles(pictureFiles);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles.length, maxFiles, addFiles]);

  const openPhotoLibrary = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    removeFile(fileId);
  }, [removeFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const libraryFiles = selectedFiles.filter(file => file.source === 'library');

  return (
    <div className="p-6 space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        capture={isMobile ? "environment" : undefined}
      />

      {/* Photo Library Access */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {isMobile ? (
              <Smartphone className="w-16 h-16 text-gray-400" />
            ) : (
              <Image className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isMobile ? '사진 보관함에서 선택' : '컴퓨터에서 사진 선택'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {isMobile 
              ? '기기의 사진 보관함에서 이미지를 선택하세요'
              : '컴퓨터에 저장된 이미지 파일을 선택하세요'
            }
          </p>

          <button
            onClick={openPhotoLibrary}
            disabled={selectedFiles.length >= maxFiles || isUploading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                처리 중...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {isMobile ? '사진 선택' : '파일 선택'}
              </>
            )}
          </button>
        </div>

        {/* Capacity Warning */}
        {selectedFiles.length >= maxFiles && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              최대 {maxFiles}개까지 선택 가능합니다. 새 파일을 추가하려면 기존 파일을 삭제해주세요.
            </p>
          </div>
        )}
      </div>

      {/* Selected Photos from Library */}
      {libraryFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            선택된 사진 ({libraryFiles.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {libraryFiles.map((file) => (
              <div 
                key={file.id}
                className="relative group bg-gray-50 rounded-lg overflow-hidden border"
              >
                {/* Image Preview */}
                <div className="aspect-square">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* File Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Image className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">사진보관함</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  aria-label="파일 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Specific Instructions */}
      {isMobile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                모바일 사용 팁
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• '사진 선택' 버튼을 누르면 사진 보관함이 열립니다</li>
                <li>• 여러 사진을 한 번에 선택할 수 있습니다</li>
                <li>• 일부 브라우저에서는 카메라로 직접 촬영도 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• JPG, PNG, GIF, WebP 파일을 지원합니다</p>
        <p>• 파일 크기는 최대 10MB까지 지원됩니다</p>
        <p>• 최대 {maxFiles}개까지 선택할 수 있습니다</p>
        {isMobile && (
          <p>• 모바일에서는 사진 보관함과 카메라 촬영을 모두 이용할 수 있습니다</p>
        )}
      </div>
    </div>
  );
};