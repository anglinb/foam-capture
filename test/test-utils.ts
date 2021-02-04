import * as os from 'os';
import * as fs from'fs';
import * as path from 'path';
import copy from 'recursive-copy';
import mkdirp from 'mkdirp'
import uuid4 from "uuid4";
import { 
  bootstrap,
  URI,
  Foam,
  createConfigFromFolders,
  Services,
  FileDataStore
} from 'foam-core';
import { rejects } from 'assert';

const fixturesPath = './fixtures'
export const prepareKnowledgeBase = async (fixtureName: string): Promise<string> => {
    const fixtureNamePath = path.resolve(path.join(__dirname, fixturesPath, fixtureName))
    if (! (await doesFileExist(fixtureNamePath))) {
        throw new Error(`Unable to find fixture at path: ${fixtureNamePath}`)
    }
    const tempDirPath = os.tmpdir()
    const tempDirFixturePath = path.join(tempDirPath, uuid4())
    await mkdirp(tempDirFixturePath)
    // await new Promise((_, resolve) => fs.mkdir(tempDirFixturePath, (err) => {
    //     if (err === null){
    //         return resolve()
    //     }
    //     rejects
    // }));
    try {
        let result = await copy(fixtureNamePath, tempDirFixturePath)
    } catch (e) {
        console.log("Faield to create test directory.")
        throw e
    }
    return tempDirFixturePath
}


export const doesFileExist = path =>
  fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);

export const bootstrapFoam = async (path:string): Promise<Foam> => {

  const workspaceURI = URI.file(path)
  const config = createConfigFromFolders([workspaceURI]);
  const services: Services = {
    dataStore: new FileDataStore(config),
  };
  const foam = (await bootstrap(config, services));
  return foam
}
