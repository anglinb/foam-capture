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
import { cleanupReferences } from '../utils/cleanup-references';
import { opinionatedBootstrap } from '../utils/opinionated-bootstrap';

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

    // Parse out the cli arguments
    const { args, flags } = this.parse(Capture);
    const { captureString } = args;
    const { workspace = "./" } = flags;

    // Create the foam instance and run the steps
    let foam
    try{ 
      foam = await opinionatedBootstrap(workspace)
    } catch(e){
      spinner.fail('Directory does not exist!');
      return 
    }
    await captureToInbox(foam, captureString);
    await cleanupReferences(foam, { 'without-extensions': flags['without-extensions']})

    spinner.succeed('Done!');
  }
}