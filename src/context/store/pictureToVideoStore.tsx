import { create } from 'zustand';

export interface PictureFile {
  id: string;
  file: File;
  preview: string;
  source: 'local' | 'camera' | 'drive' | 'library';
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface PictureToVideoStore {
  // 파일 관리
  selectedFiles: PictureFile[];
  isModalOpen: boolean;
  currentTab: 'local' | 'camera' | 'library' | 'drive';
  
  // 로딩 상태
  isLoading: boolean;
  loadingMessage: string;
  
  // Actions
  addFiles: (files: PictureFile[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  
  // Modal 관리
  openModal: () => void;
  closeModal: () => void;
  setCurrentTab: (tab: 'local' | 'camera' | 'library' | 'drive') => void;
  
  // 로딩 상태 관리
  setLoading: (loading: boolean, message?: string) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const usePictureToVideoStore = create<PictureToVideoStore>((set, get) => ({
  // Initial state
  selectedFiles: [],
  isModalOpen: false,
  currentTab: 'local',
  isLoading: false,
  loadingMessage: '',

  // File management actions
  addFiles: (files: PictureFile[]) => {
    const { selectedFiles } = get();
    const remainingSlots = Math.max(0, 10 - selectedFiles.length);
    const filesToAdd = files.slice(0, remainingSlots);
    
    set({
      selectedFiles: [...selectedFiles, ...filesToAdd]
    });
  },

  removeFile: (fileId: string) => {
    const { selectedFiles } = get();
    const fileToRemove = selectedFiles.find(f => f.id === fileId);
    
    if (fileToRemove) {
      // Cleanup preview URL
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    set({
      selectedFiles: selectedFiles.filter(f => f.id !== fileId)
    });
  },

  clearFiles: () => {
    const { selectedFiles } = get();
    
    // Cleanup all preview URLs
    selectedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    
    set({
      selectedFiles: []
    });
  },

  reorderFiles: (fromIndex: number, toIndex: number) => {
    const { selectedFiles } = get();
    const newFiles = [...selectedFiles];
    const [removed] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removed);
    
    set({
      selectedFiles: newFiles
    });
  },

  // Modal management actions
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Loading state management
  setLoading: (loading: boolean, message?: string) => set({
    isLoading: loading,
    loadingMessage: message || ''
  }),
}));

// Helper function to create PictureFile from File
export const createPictureFile = (
  file: File, 
  source: PictureFile['source'] = 'local'
): PictureFile => ({
  id: generateId(),
  file,
  preview: URL.createObjectURL(file),
  source,
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
});

// Helper function to validate image files
export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};