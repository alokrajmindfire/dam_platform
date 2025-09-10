import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAsset extends Document {
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

const AssetSchema = new Schema<IAsset>(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    storagePath: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['uploading', 'processing', 'ready', 'failed'],
      default: 'processing',
    },
    metadata: {
      width: Number,
      height: Number,
      duration: Number,
    },
    transcoded: {
      type: Map,
      of: String,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

AssetSchema.index({ userId: 1, createdAt: -1 });
AssetSchema.index({ userId: 1, tags: 1 });
AssetSchema.index({ userId: 1, mimeType: 1, status: 1 });
AssetSchema.index({ originalName: 1 });
AssetSchema.index({ filename: 1 }, { unique: true });

export const Asset: Model<IAsset> = mongoose.model<IAsset>(
  'Asset',
  AssetSchema,
);
