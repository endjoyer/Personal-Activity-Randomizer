import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  _id: string;
  name: string;
}

export interface ISection extends Document {
  _id: string;
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  activities: IActivity[];
  order: number;
}

const activitySchema: Schema = new Schema({
  name: { type: String, required: true },
});

const sectionSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  activities: [activitySchema],
  order: { type: Number, required: true },
});

export default mongoose.models.Section ||
  mongoose.model<ISection>('Section', sectionSchema);
