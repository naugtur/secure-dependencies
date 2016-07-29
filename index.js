#!/usr/bin/env node
const spawnShell = require('spawn-shell')
const path = require('path')
const console = require('console')
const fs = require('fs-extra')
const targz = require('tar.gz')


const dir = path.resolve(process.cwd(), 'secure-node-bundle')
fs.ensureDirSync(dir);
fs.emptyDirSync(dir)
fs.copySync('package.json', path.resolve(dir, './package.json'));
if(fs.existsSync('npm-shrinkwrap.json')){
    fs.copySync('npm-shrinkwrap.json', path.resolve(dir, './npm-shrinkwrap.json'));
}
if(fs.existsSync('npm-shrinkwrap-production.json')){
    fs.copySync('npm-shrinkwrap-production.json', path.resolve(dir, './npm-shrinkwrap.json'));
}


const pkg = require(path.resolve(dir, './package.json'))
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

Promise.resolve()
    .then(() => promiseCommand(`npm install --production --no-optional --unsafe-perm=false --prefix=${dir}`))
    .then(() => promiseCommand(`cd ${dir} && npm prune --production`))
    .then(() => promiseCommand(`cd ${dir} && npm dedupe`))
    .then(() => promiseCommand(`cd ${dir} && npm install nsp`))
    .then(() => promiseCommand(`cd ${dir} && nsp check`))
    .then(() => promiseCommand(`cd ${dir} && npm prune --production`))
    .then(() => targz().compress(path.resolve(dir, 'node_modules'), tarball))
    .then(() => {
        fs.removeSync(dir)
        console.log('done')
    })
    .catch((err)=>{
        console.log(err)
        exit(0)
    })
