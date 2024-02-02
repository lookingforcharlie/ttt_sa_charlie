import mongoose from 'mongoose';

const scoreboardSchema = new mongoose.Schema({
  playerName: { type: String },
  result: { type: String },
  time: { type: Date, default: Date.now },
});

export default mongoose.model('scoreboard', scoreboardSchema);
// 'scoreboard' is the name of the schema we created.
