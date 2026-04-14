"use strict";

// Northwind V4 demo service returns "OData-Version: 4.0;" (trailing semicolon),
// which sap.ui.model.odata.v4 rejects. Strip the semicolon on the way back.
module.exports = function ({ log } = {}) {
    if (log && log.info) { log.info("fix-odata-version middleware active"); }
    return function fixOdataVersion(req, res, next) {
        const origSetHeader = res.setHeader.bind(res);
        res.setHeader = function (name, value) {
            if (typeof name === "string" && name.toLowerCase() === "odata-version" && typeof value === "string") {
                const cleaned = value.replace(/;+\s*$/, "");
                if (cleaned !== value && log && log.info) { log.info(`rewrote OData-Version '${value}' -> '${cleaned}'`); }
                value = cleaned;
            }
            return origSetHeader(name, value);
        };
        const origWriteHead = res.writeHead.bind(res);
        res.writeHead = function (statusCode, ...rest) {
            const headers = rest[rest.length - 1];
            if (headers && typeof headers === "object" && !Array.isArray(headers)) {
                for (const k of Object.keys(headers)) {
                    if (k.toLowerCase() === "odata-version" && typeof headers[k] === "string") {
                        headers[k] = headers[k].replace(/;+\s*$/, "");
                    }
                }
            }
            return origWriteHead(statusCode, ...rest);
        };
        next();
    };
};
