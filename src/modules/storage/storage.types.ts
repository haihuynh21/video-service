export interface StorageUploadParams {
    filePath: string;
    key: string;
    contentType: string;
  }
  
  export interface StorageUploadResult {
    r2Key: string;
    publicUrl: string;
  }