import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember {
  userId: Schema.Types.ObjectId;
  role: 'owner' | 'admin' | 'member';
}

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: ITeamMember[];
  createdBy: Schema.Types.ObjectId;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member'],
          default: 'member',
        },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', TeamSchema);
