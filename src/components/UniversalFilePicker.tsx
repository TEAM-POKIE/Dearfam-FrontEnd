import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Camera, Image, Cloud } from 'lucide-react';
import { usePictureToVideoStore } from '@/context/store/pictureToVideoStore';
import { LocalFilePicker } from './filePickers/LocalFilePicker';
import { CameraPicker } from './filePickers/CameraPicker';
import { PhotoLibraryPicker } from './filePickers/PhotoLibraryPicker';
import { GoogleDrivePicker } from './filePickers/GoogleDrivePicker';

interface UniversalFilePickerProps {
  isOpen: boolean;
  onClose: () => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  title?: string;
}

type TabType = 'local' | 'camera' | 'library' | 'drive';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const UniversalFilePicker = ({
  isOpen,
  onClose,
  acceptedFileTypes = ['image/*'],
  maxFiles = 10,
  title = '파일 선택'
}: UniversalFilePickerProps) => {
  const navigate = useNavigate();
  const { currentTab, setCurrentTab, selectedFiles } = usePictureToVideoStore();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const tabs: TabConfig[] = [
    {
      id: 'local',
      label: '파일 선택',
      icon: <Upload className="w-5 h-5" />,
      component: <LocalFilePicker acceptedFileTypes={acceptedFileTypes} maxFiles={maxFiles} />
    },
    {
      id: 'library',
      label: '사진 보관함',
      icon: <Image className="w-5 h-5" />,
      component: <PhotoLibraryPicker acceptedFileTypes={acceptedFileTypes} maxFiles={maxFiles} />
    },
    {
      id: 'camera',
      label: '카메라',
      icon: <Camera className="w-5 h-5" />,
      component: <CameraPicker maxFiles={maxFiles} />
    },
    {
      id: 'drive',
      label: 'Google Drive',
      icon: <Cloud className="w-5 h-5" />,
      component: <GoogleDrivePicker acceptedFileTypes={acceptedFileTypes} maxFiles={maxFiles} />
    }
  ];

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {title} ({selectedFiles.length}/{maxFiles})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                currentTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {tabs.find(tab => tab.id === currentTab)?.component}
        </div>

        {/* Footer */}
        {selectedFiles.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedFiles.length}개 파일 선택됨
              </div>
              <button
                onClick={() => {
                  navigate('/goods/videoGeneration');
                  handleClose();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};