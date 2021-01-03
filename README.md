foam-capture
========

Foam Capture Cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/foam-capture.svg)](https://npmjs.org/package/foam-capture)
[![Downloads/week](https://img.shields.io/npm/dw/foam-capture.svg)](https://npmjs.org/package/foam-capture)
[![License](https://img.shields.io/npm/l/foam-capture.svg)](https://github.com/foambubble/foam/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g foam-capture
$ foam-capture COMMAND
running command...
$ foam-capture (-v|--version|version)
foam-capture/0.0.2 darwin-x64 node-v15.5.0
$ foam-capture --help [COMMAND]
USAGE
  $ foam-capture COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`foam-capture capture [CAPTURESTRING]`](#foam-capture-capture-capturestring)
* [`foam-capture help [COMMAND]`](#foam-capture-help-command)

## `foam-capture capture [CAPTURESTRING]`

Captures provided information

```
USAGE
  $ foam-capture capture [CAPTURESTRING]

OPTIONS
  -h, --help                 show CLI help
  -s, --workspace=workspace  Where the workspace exists, defaults to ".".
  -w, --without-extensions   generate link reference definitions without extensions (for legacy support)

EXAMPLE
  $ foam-capture capture [string-to-capture]
```

_See code: [src/commands/capture.ts](https://github.com/anglinb/foam-capture/blob/v0.0.2/src/commands/capture.ts)_

## `foam-capture help [COMMAND]`

display help for foam-capture

```
USAGE
  $ foam-capture help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_
<!-- commandsstop -->

## Development

- Run `yarn` somewhere in workspace (ideally root, see [yarn workspace docs](https://classic.yarnpkg.com/en/docs/workspaces/)
  - This will automatically symlink all package directories so you're using the local copy
- In `packages/foam-capture`, make changes and run with `yarn run cli`. This should use latest workspace manager changes.
