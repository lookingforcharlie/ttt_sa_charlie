import logger from '../logger';
import scoreboardSchema from '../scoreboard.model';

import { Request, Response } from 'express';

const saveScoreboard = async (
  playerName: string,
  result: number
): Promise<string | null> => {
  try {
    const scoreboard = new scoreboardSchema({
      playerName,
      result,
    });

    await scoreboard.save();
    return null; // Indicates success
  } catch (error) {
    logger.error('Error saving scoreboard:', error);
    return 'Error saving scoreboard';
  }
};

const handleSaveScoreboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { playerName, result } = req.body;

  try {
    const errorMessage = await saveScoreboard(playerName, result);

    if (errorMessage) {
      res.status(500).json({ error: errorMessage });
    } else {
      res.json({ message: 'Scoreboard saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Invalid Add Request' });
  }
};

export default handleSaveScoreboard;
