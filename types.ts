export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string;
  base64: string;
}

export const DEFAULT_PROMPT = "Remove only the star watermark icon in the bottom right corner. Do NOT remove the image background. Keep the entire image unchanged except for the watermark. Fill the removed area to match the surrounding background texture.";
