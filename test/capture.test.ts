/// <reference types="jest" />
import { promises as fs } from "fs";
import * as util from 'util'
import rimraf  from 'rimraf';
import {
  Foam, 
  bootstrap,
  FileDataStore,
  Services,
  createConfigFromFolders,
  URI
} from "foam-core";
import { prepareKnowledgeBase } from './test-utils';
import { captureToInbox } from '../src/utils/capture-to-inbox'

const doesFileExist = path =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

const bootstrapFoam = async (path:string): Promise<Foam> => {

  const workspaceURI = URI.file(path)
  const config = createConfigFromFolders([workspaceURI]);
  const services: Services = {
    dataStore: new FileDataStore(config),
  };
  const foam = (await bootstrap(config, services));
  return foam
}

describe('capture', () => {

    let result:Array<any> = [];
    let cleanupDirs:Array<string> = []


    beforeEach(() => {
      result = [];
      jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(val =>
          result.push(val)
        );
      jest.spyOn(global.console, 'info').mockImplementation();
    });

    afterEach(async () => {
      await Promise.all(cleanupDirs.map((value) => {
        return new Promise(resolve => rimraf(value, resolve))
      }))
      cleanupDirs = []
      return jest.restoreAllMocks()
    })


  it('should create a new inbox file with value', async () => {
    const kbPath = await prepareKnowledgeBase("kb-without-inbox")
    cleanupDirs.push(kbPath) // Make sure we clean this up later
    const foam = await bootstrapFoam(kbPath)

    expect(foam.notes.getNotes().length).toEqual(1)   
    let inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    expect(inboxNote).toBe(undefined)

    await captureToInbox(foam, "hello world");

    expect(foam.notes.getNotes().length).toEqual(2) 
    inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    expect(inboxNote).not.toBe(undefined)

    let inboxNoteContent = await fs.readFile(inboxNote.source.uri.fsPath, 'utf8')
    expect(inboxNoteContent).toEqual("# Inbox\n\n- hello world")
  })

  it('should update the existing inbox file with value', async () => {
    const kbPath = await prepareKnowledgeBase("kb-with-inbox")
    cleanupDirs.push(kbPath) // Make sure we clean this up later
    const foam = await bootstrapFoam(kbPath)

    expect(foam.notes.getNotes().length).toEqual(2)   
    let inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    expect(inboxNote).not.toBe(undefined)
    expect(inboxNote.source.text).toEqual("# Inbox\n\n- Hello world")

    await captureToInbox(foam, "another item");

    const expectedUpdatedText = "# Inbox\n\n- Hello world\n- another item"

    expect(foam.notes.getNotes().length).toEqual(2) 
    inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    expect(inboxNote).not.toBe(undefined)
    expect(inboxNote.source.text).toEqual(expectedUpdatedText)

    let inboxNoteContent = await fs.readFile(inboxNote.source.uri.fsPath, 'utf8')
    expect(inboxNoteContent).toEqual(expectedUpdatedText)
  })
});
