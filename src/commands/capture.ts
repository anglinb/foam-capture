import * as path from 'path';
import { Command, flags } from '@oclif/command';
import ora from 'ora';
import {
  bootstrap,
  createConfigFromFolders,
  generateLinkReferences,
  generateHeading,
  applyTextEdit,
  Services,
  FileDataStore,
  URI,
} from 'foam-core';
import { writeFileToDisk } from '../utils/write-file-to-disk';
import { isValidDirectory } from '../utils';
import { captureToInbox } from '../utils/capture-to-inbox';

export default class Capture extends Command {
    static description =
    'Captures provided information';

  static examples = [
    `$ foam-capture capture [string-to-capture]
`,
  ];

  static flags = {
    'workspace': flags.string({
        char: 's',
        description: 
        'Where the workspace exists, defaults to ".".',
    }),
    'without-extensions': flags.boolean({
      char: 'w',
      description:
        'generate link reference definitions without extensions (for legacy support)',
    }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'captureString' }];

  async run() {
    const spinner = ora('Reading Files').start();

    const { args, flags } = this.parse(Capture);

    const { captureString } = args;
 
    const { workspace = "./" } = flags;

    if (isValidDirectory(workspace)) {
        const workspaceURI = URI.file(workspace)
        const config = createConfigFromFolders([workspaceURI]);
        const services: Services = {
          dataStore: new FileDataStore(config),
        };
        const foam = (await bootstrap(config, services));
        const graph = foam.notes;
  
        const notes = graph.getNotes().filter(Boolean); // removes undefined notes
  
        spinner.succeed();
        spinner.text = `${notes.length} files found`;
        spinner.succeed();

        await captureToInbox(foam, captureString);

        spinner.text = 'Generating link definitions';
  
        const fileWritePromises = notes.map(note => {
          // Get edits
          const heading = generateHeading(note);
          const definitions = generateLinkReferences(
            note,
            graph,
            !flags['without-extensions']
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
  
        await Promise.all(fileWritePromises);
  
        spinner.succeed();
        spinner.succeed('Done!');

    } else {
        spinner.fail('Directory does not exist!');
    }
  }
}