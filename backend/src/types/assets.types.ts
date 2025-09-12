import { Schema } from 'mongoose';

export interface CreateAssetData {
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  user_id: Schema.Types.ObjectId;
  width?: number;
  height?: number;
  duration?: number;
  tags?: string[];
  size: number;
}

export interface FindManyFilters {
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}

export interface IAssetType {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  url?: string;
  thumbnailUrl?: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
  };
  transcoded?: {
    '1080p': string;
    '720p': string;
  };
  tags?: string[];
  description?: string;
  downloadCount: number;
  userId: Schema.Types.ObjectId;
}
