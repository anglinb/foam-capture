import {
    URI,
    bootstrap,
    Foam,
    createConfigFromFolders,
    Services,
    FileDataStore,
} from 'foam-core';
import { isValidDirectory } from '../utils';

/**
 *
 * @param workspace path to workspace 
 */

 export const opinionatedBootstrap = async (workspace: string): Promise<Foam>  => {
    if (isValidDirectory(workspace)) {
        const workspaceURI = URI.file(workspace)
        const config = createConfigFromFolders([workspaceURI]);
        const services: Services = {
          dataStore: new FileDataStore(config),
        };
        return bootstrap(config, services);
    } else {
        throw new Error(`Unable to bootstrap, workspace directory not valid: ${workspace}`)
    }
 }