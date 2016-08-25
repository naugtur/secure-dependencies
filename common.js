const path = require('path')

module.exports = {
    getTarballName: function(dir) {
        const pkg = require(path.resolve(dir, './package.json'))
        const appname = pkg.name
        const version = pkg.version

        return `${appname}-${version}.tgz`

    }
}
