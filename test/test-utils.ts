import * as os from 'os';
import * as fs from'fs';
import * as path from 'path';
import copy from 'recursive-copy';
import mkdirp from 'mkdirp'
import uuid4 from "uuid4";
import { rejects } from 'assert';

const fixturesPath = './fixtures'
export const prepareKnowledgeBase = async (fixtureName: string): Promise<string> => {
    const fixtureNamePath = path.resolve(path.join(__dirname, fixturesPath, fixtureName))
    const doesFileExist = fs.promises
        .access(fixtureNamePath)
        .then(() => true)
        .catch(() => false);
    if (!doesFileExist) {
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