const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  JFULL: { type: String, required: true },
  JID: { type: String, required: true },
  JYEAR: { type: String, required: true },
  JCASE: { type: String, required: true },
  JNO: { type: String, required: true },
  JDATE: { type: String, required: true },
  JTITLE: { type: String, required: true },
  JPDF: { type: String, required: true },
  SEGMENT_JTITLE: { type: String, required: true },
  SEGMENT_JFULL: { type: String, required: true },
});

judgeSchema.index({ 'SEGMENT_JTITLE': 'text', 'SEGMENT_JFULL': 'text' });

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = Judge;