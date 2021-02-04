/// <reference types="jest" />
import { promises as fs } from "fs";
import * as util from 'util'
import rimraf  from 'rimraf';
import { prepareKnowledgeBase, bootstrapFoam, doesFileExist  } from './test-utils';
import { captureToInbox } from '../src/utils/capture-to-inbox'

describe('twitter', () => {

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

  it('should do nothing without a valid twitter link', async ()=> {
    

  })

  it('should create a new twitter folder', async () => {
    const kbPath = await prepareKnowledgeBase("kb-without-inbox")
    cleanupDirs.push(kbPath) // Make sure we clean this up later
    const foam = await bootstrapFoam(kbPath)

    expect(foam.notes.getNotes().length).toEqual(1)   
    // let inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    // expect(inboxNote).toBe(undefined)

    await capture(foam, "https://twitter.com/shizcrey/status/1348866954002575360?s=12");

    expect(foam.notes.getNotes().length).toEqual(2) 
    inboxNote = foam.notes.getNotes().find(note => note.source.uri.fsPath.endsWith("inbox.md"))
    expect(inboxNote).not.toBe(undefined)

    let inboxNoteContent = await fs.readFile(inboxNote.source.uri.fsPath, 'utf8')
    expect(inboxNoteContent).toEqual("# Inbox\n\n- hello world")
  })

});
