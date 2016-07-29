# secure-bundle-dependencies

Creates a tarball of your app dependencies checked with node security platform

*The ultimate solution to `npm install` in production and alternatives.*

*Be ready for the next left-pad!*


## Usage

```
npm install secure-bundle-dependencies --save-dev
```

Then in your package.json scripts section you can call it
```
"scripts": {
    "bundle": "secure-bundle-dependencies"
  },
```

`{appname}-{version}.tgz` is produced with all production dependencies unless `nsp check` complains

To try it:
```
cd exampleapp
npm install
npm start
```
