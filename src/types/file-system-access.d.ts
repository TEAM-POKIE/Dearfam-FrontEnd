// File System Access API type declarations
interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string | string[]>;
}

interface FilePickerOptions {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
  id?: string;
  startIn?: string;
  suggestedName?: string;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | BufferSource | string): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  showSaveFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle>;
}