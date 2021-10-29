const _ = require("lodash")

function removeLastSlashChar(url) {
    if (url.slice(-1) === "/") return url.slice(0, -1)
    return url
}

module.exports = (ctx) => {
    // ************************************** //
    // PARSE REQUESTED ROUTE TO ORIGINAL PATH //
    // ************************************** //
    let originalPath = removeLastSlashChar(ctx.request.url.split("?")[0])
    const params = ctx.params || {}
    // remove the param "0" from route if it exists
    // to prevent broken pregmactch logic replacer
    if (params["0"]) delete params["0"]
    if (Object.keys(params).length > 0) {
        originalPath = originalPath.split("/").map(partValue => {
            for (const partKey in params) {
                if (params[partKey] == partValue) return `(:.*\/|(:.*))`
            }
            return partValue
        }).join("\/")
    }


    // Get all application routes
    let routes = strapi.config.routes
    _.forEach(strapi.plugins, (plugin) => {
        _.forEach(plugin.config.routes, (route) => {
            if (route && route.method && route.path) {
                routes.push(route)
            }
        })
    })

    // ******************************* //
    // FIND ROUTE AND INPUT ITS FIELDS //
    // ******************************* //
    // define a regex separating params
    const regex = new RegExp(originalPath, 'gm');
    const route = routes.find(route => {
        return (
            route.method == ctx.request.method &&
            removeLastSlashChar(route.path).replace(regex, "true") === "true"
        )
    })

    return route;
}