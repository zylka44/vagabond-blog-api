import mongoose from 'mongoose';

const url = 'mongodb+srv://dbUser:roraty@tuitam.gixm7p7.mongodb.net/tuitam?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(url);

export const PictureSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
});

export const ChunkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  pictures: [PictureSchema],
  info: {
    type: String,
  },
});

export const Publication = new mongoose.Schema({
  published: {
    type: Boolean,
  },
  date: {
    type: String,
  },
  type: {
    type: String,
  },
  coordinates: {
    type: String,
  },
  tags: {
    type: String,
  },
});

export const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
  },
  chunks: [ChunkSchema],
  publication: Publication,
  mainPictureUrl: {
    type: String,
  },
});

export const Article = mongoose.model('Article', ArticleSchema);

export const SessionSchema = new mongoose.Schema({
  credentials: {
    type: String,
  },
});

export const Session = mongoose.model('Session', SessionSchema);
