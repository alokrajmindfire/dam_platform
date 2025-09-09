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
