import { Schema, model, Document } from "mongoose";

interface Icategories extends Document {
  categories: string[];
}

const CategorySchema = new Schema<Icategories>({
  categories: [{ type: String, required: true }]
});

const CategoryModel = model<Icategories>("Category", CategorySchema);

export { Icategories, CategoryModel };

