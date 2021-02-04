import { Foam } from 'foam-core';

/**
 * 
 * @param foam foam configuration
 * @param capture the raw data
 * @returns the new string with the link to the tweet
 */
export const capture = async (foam: Foam, capture: string): Promise<string> => {
  
  const notes = foam.notes.getNotes().filter(Boolean); // removes undefined notes
  const workspace = foam.config.workspaceFolders[0]

  // Ensure the tweets directory exists 
  workspace.fsPath

  const tweetsDirectory = workspace

  return "catpure"
}
