#!/usr/bin/env node

const spawnShell = require('spawn-shell')
const path = require('path')
const console = require('console')
const fs = require('fs-extra')
const targz = require('tar.gz')


const dir = path.resolve(process.cwd(), 'node_modules')
const dirBackup = dir + '_backup'
fs.copySync(dir, dirBackup);
fs.emptyDirSync(dir)


const pkg = require(path.resolve(process.cwd(), './package.json'))
const appname = pkg.name
const version = pkg.version

const tarball = path.resolve(process.cwd(), `./${appname}-${version}.tgz`)
fs.removeSync(tarball)

function promiseCommand(command, opts) {
    console.log('>>>>', command)
    return spawnShell(command, opts).exitPromise
        .then((exitCode) => {
            if (exitCode === 0) {
                return;
            } else {
                throw Error("Exit " + exitCode)
            }
        })
}

function restore() {
    fs.removeSync(dir)
    fs.copySync(dirBackup, dir);
    fs.removeSync(dirBackup);
}

Promise.resolve()
    .then(() => promiseCommand(`npm install --production --no-optional`))
    .then(() => promiseCommand('npm prune --production'))
    .then(() => promiseCommand('npm dedupe'))
    .then(() => promiseCommand('npm install nsp'))
    .then(() => promiseCommand('nsp check'))
    .then(() => promiseCommand('npm prune --production'))
    .then(() => targz().compress(dir, tarball))
    .then(() => {
        restore()
        console.log('done')
    })
    .catch((err) => {
        restore()
        console.log(err)
    })
