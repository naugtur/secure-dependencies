# secure-dependencies
*Never run npm install in production again!*

Creates a tarball of your app dependencies checked with node security platform. Just unpack it in production and you're ready to go.


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

`{appname}-{version}.tgz` is produced with all production dependencies unless `nsp check` complains

*Become left-pad proof!*

## Try it out

```
cd exampleapp
npm install
npm start
```
exampleapp-1.0.0.tgz is created
