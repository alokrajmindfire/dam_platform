import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAsset extends Document {
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  thumbnail_path?: string;
  width?: number;
  height?: number;
  duration?: number;
  tags: string[];
  metadata: Record<string, any>;
  user_id: Schema.Types.ObjectId;
  download_count: number;
}
const AssetSchema: Schema<IAsset> = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    original_name: {
      type: String,
      required: true,
    },
    mime_type: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
    },
    storage_path: {
      type: String,
      required: true,
    },
    thumbnail_path: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    download_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const AssetModel: Model<IAsset> = mongoose.model<IAsset>(
  'Asset',
  AssetSchema,
);
