import * as path from 'path';
import { URI, Foam } from "foam-core";
import { writeFileToDisk } from '../utils/write-file-to-disk';

/**
 *
 * @param foam foam configuration  
 * @param capture what data we would like to capture 
 */
export const captureToInbox = async (foam: Foam, capture: string): Promise<void> => {
    const notes = foam.notes.getNotes().filter(Boolean); // removes undefined notes
    const workspace = foam.config.workspaceFolders[0]

    // Try to find an inbox
    const inboxNote = notes.find(note => {
        const relativePath = path.relative(workspace.fsPath, note.source.uri.fsPath)
        return relativePath == "inbox.md"
    });

    let inboxNoteContent, inboxNoteURI, inboxEol;
    if (inboxNote === undefined) { // We'll create an inbox if needed
        inboxNoteContent = `# Inbox\n\n- ${capture}` 
        inboxNoteURI = URI.file(path.join(workspace.fsPath, "inbox.md"))
        inboxEol = "\n"
    } else {
        inboxNoteContent = `${inboxNote.source.text}\n- ${capture}` 
        inboxNoteURI = inboxNote.source.uri
        inboxEol = inboxNote.source.eol
    }
    await writeFileToDisk(inboxNoteURI, inboxNoteContent)
    foam.notes.setNote(foam.parse(inboxNoteURI, inboxNoteContent, inboxEol))
}