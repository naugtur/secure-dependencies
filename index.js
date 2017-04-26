#!/usr/bin/env node

// Hi, great to see you!
// Everyone should read code they run.
// You deserve a medal
// |@@@@|     |####|
// \@@@@|     |####/
//  \@@@|     |###/
//   `@@|_____|##'
//       \ 0 /
//     .-'''''-.
//   .'  * * *  `.
//  :  *DEV-OPS*  :
// : ~ A W A R D ~ :
//  :  *       *  :
//   `.  * * *  .'
//     `-.....-'

const spawnShell = require('spawn-shell')
const path = require('path')
const console = require('console')
const fs = require('fs-extra')
const targz = require('tar.gz')
const common = require('./common')

//Prepare a temporary bundle folder
const dir = path.resolve(process.cwd(), 'secure-dependencies-bundle')
fs.ensureDirSync(dir);
fs.emptyDirSync(dir)

//npm --prefix requires package.json to be in the location given
fs.copySync('package.json', path.resolve(dir, './package.json'));

//Shrinkwrap is important, we don't want to silently skip it
if (fs.existsSync('npm-shrinkwrap.json')) {
    fs.copySync('npm-shrinkwrap.json', path.resolve(dir, './npm-shrinkwrap.json'));
}
//but shrinkwrap is uncomfortable for daily development, so you can store it in a file that only this bundler will use.
//TODO: make this configurable with commandline argument
if (fs.existsSync('npm-shrinkwrap-production.json')) {
    fs.copySync('npm-shrinkwrap-production.json', path.resolve(dir, './npm-shrinkwrap.json'));
}

const tarball = path.resolve(process.cwd(), common.getTarballName(dir))
    //Get rid of the previous tarball, because I'm afraid tar could merge instead of overwriting
fs.removeSync(tarball)

//The main purpose of this is to reject the promise based on exit code
function promiseCommand(command) {
    const opts = {
        env: process.env
    };
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

Promise.resolve()
    .then(() => promiseCommand(`npm install --production --no-optional --unsafe-perm=false --prefix=${dir}`))
    //Gues what, almost nothing supports --prefix
    .then(() => promiseCommand(`cd ${dir} && npm prune --production`))
    .then(() => promiseCommand(`cd ${dir} && npm dedupe`))
    .then(() => promiseCommand(`cd ${dir} && nsp check`))
    .then(() => targz().compress(path.resolve(dir, 'node_modules'), tarball))
    .then(() => {
        fs.removeSync(dir)
        console.log('Done. Here is your tarball:')
        console.log(tarball)
    })
    .catch((err) => {
        console.log(err)
        exit(1)
    })
