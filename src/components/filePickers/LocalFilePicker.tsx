import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { usePictureToVideoStore, createPictureFile, validateImageFile } from '@/context/store/pictureToVideoStore';

interface LocalFilePickerProps {
  acceptedFileTypes: string[];
  maxFiles: number;
}

export const LocalFilePicker = ({ acceptedFileTypes, maxFiles }: LocalFilePickerProps) => {
  const { selectedFiles, addFiles, removeFile } = usePictureToVideoStore();
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors: fileErrors }) => {
      fileErrors.forEach((error: any) => {
        if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name}: 지원되지 않는 파일 형식입니다`);
        } else if (error.code === 'file-too-large') {
          newErrors.push(`${file.name}: 파일 크기가 너무 큽니다 (최대 10MB)`);
        } else {
          newErrors.push(`${file.name}: ${error.message}`);
        }
      });
    });
    
    const validFiles = acceptedFiles.filter(validateImageFile);
    const remainingSlots = maxFiles - selectedFiles.length;
    
    // Check capacity
    if (acceptedFiles.length > remainingSlots) {
      newErrors.push(`최대 ${maxFiles}개까지만 선택할 수 있습니다`);
    }
    
    const filesToAdd = validFiles.slice(0, remainingSlots);
    const pictureFiles = filesToAdd.map(file => createPictureFile(file, 'local'));
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Clear errors after 5 seconds
      setTimeout(() => setErrors([]), 5000);
    } else {
      setErrors([]);
    }
    
    if (pictureFiles.length > 0) {
      addFiles(pictureFiles);
    }
  }, [selectedFiles.length, maxFiles, addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - selectedFiles.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: selectedFiles.length >= maxFiles,
  });

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

  return (
    <div className="p-6 space-y-6">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-2">파일 업로드 오류</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Warning */}
      {selectedFiles.length >= maxFiles && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">선택 완료</h4>
              <p className="text-sm text-yellow-800">
                최대 {maxFiles}개까지 선택되었습니다. 새 파일을 추가하려면 기존 파일을 삭제해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${selectedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? '파일을 드롭하세요' : '파일을 드래그하거나 클릭하여 선택'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG, GIF, WebP 파일 (최대 10MB)
            </p>
            {selectedFiles.length >= maxFiles && (
              <p className="text-sm text-red-500 mt-1">
                최대 {maxFiles}개까지 선택 가능합니다
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">선택된 파일</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles
              .filter(file => file.source === 'local')
              .map((file) => (
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

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• 이미지 파일만 업로드 가능합니다 (JPG, PNG, GIF, WebP)</p>
        <p>• 파일 크기는 최대 10MB까지 지원됩니다</p>
        <p>• 최대 {maxFiles}개까지 선택할 수 있습니다</p>
        <p>• 드래그 앤 드롭으로 쉽게 파일을 추가할 수 있습니다</p>
      </div>
    </div>
  );
};