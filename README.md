# secure-dependencies
*Never run npm install in production again!*

Creates a tarball of your app dependencies checked with node security platform. Just unpack it in production and you're ready to go.

## Why

- Even with shrinkwrap, you cannot be sure `npm install` in production will always deliver what you need
- Running `npm install` is a defacto remote code execution vulnerability
- Not convinced? Read this https://twitter.com/o_cee/status/892306836199800836 or this https://ponyfoo.com/articles/npm-meltdown-security-concerns
- If you keep node_modules in repo and run `npm rebuild` you still run postinstall scripts - effectively bash commands with your user credentials and access to sudo. You can turn them off, but then some binaries will not build correctly.
- Also, `npm install` takes more time than `scp | untar`

## Usage

```
npm install secure-dependencies --save-dev
```

Then in your package.json scripts section you can call it
```
"scripts": {
  "bundle": "secure-dependencies"
},
```

`{appname}-{nodeVersion}-{appVersion}.tgz` is produced with all production dependencies unless `nsp check` complains.

*Become left-pad proof!*

### Node support

This library could support versions 0.x but it doesn't. Consider this another reason to finally upgrade.

While it might work, the version of node in filename will be `0`. Trivial to fix, but I believe I should not.

### shrinkwrap

secure-dependencies will follow npm-shrinkwrap.json but if you want to use it for production and not locally, you can rename it to npm-shrinkwrap-production.json and it will work for installing the module for the bundle.

## What does it do?
In summary:
```
npm install --production
npm prune
npm dedupe
nsp check
tar
```

But don't trust me with your security, read the code!

## Try it out

```
cd exampleapp
npm install
npm start
```
exampleapp-node6-1.0.0.tgz is created

## Get bundle name

If you're scripting your deployment with configuration managers (or bash) it's often annoying to deal with parsing package.json

secure-dependencies exposes a tiny script that generates the filename. You can use it to figure out what the bundle name is based on package.json in current directory
```
"scripts": {
  "bundle-name": "get-bundle-name"
},
```
or
```
npm install -g secure-dependencies
get-bundle-name
```

# TODO
add paranoid mode
add scp as artifact repository
add deployment oneliner example

# Apache-2.0 License
