const path = require('path')

module.exports = {
    getTarballName: function(dir) {
        const pkg = require(path.resolve(dir, './package.json'))
        const appname = pkg.name
        const version = pkg.version
        const nodeVersionSplit = process.versions.node.split('.')
        const nodeV = `node${nodeVersionSplit[0]}`

        return `${appname}-${nodeV}-${version}.tgz`

    }
}
