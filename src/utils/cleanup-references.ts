
import * as path from 'path';
import { 
    URI, 
    Foam ,
    generateLinkReferences,
    generateHeading,
    applyTextEdit,
} from "foam-core";
import { writeFileToDisk } from '../utils/write-file-to-disk';

type CleanupReferenceOptions = {
    'without-extensions': Boolean  | undefined
}

/**
 *
 * @param foam foam configuration  
 */
export const cleanupReferences = async (foam: Foam, options: CleanupReferenceOptions): Promise<void> => {
    const notes = foam.notes.getNotes().filter(Boolean); // removes undefined notes
    const fileWritePromises = notes.map(note => {
        // Get edits
        const heading = generateHeading(note);
        const definitions = generateLinkReferences(
            note,
            foam.notes,
            !options['without-extensions']
        );

        // apply Edits
        let file = note.source.text;
        file = heading ? applyTextEdit(file, heading) : file;
        file = definitions ? applyTextEdit(file, definitions) : file;

        if (heading || definitions) {
            return writeFileToDisk(note.source.uri, file);
        }

        return Promise.resolve(null);
    });
    await Promise.all(fileWritePromises)
}