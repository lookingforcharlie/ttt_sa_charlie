import { Request, Response } from 'express';
import scoreboardSchema from '../scoreboard.model';

const handleGetScoreboard = async (req: Request, res: Response) => {
  try {
    const data = await scoreboardSchema.find({});
    res.json(data);
  } catch (error) {
    res.json({ error });
  }
};

export default handleGetScoreboard;
