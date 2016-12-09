/**
 * applyModel.js
 * Apply a JSON model to a JS object to prepare it for the js2xmlparser module
 *
 * Applicable formats:
 *      - "export-ignore": the property will not be exported in the XML,
 *      - "export-toAttribute": the property will be an attribute of its parent in the XML,
 *      - "export-ordered" & "export-order": the properties of this object will be in a specified
 *          ordered in the XML.
 *
 * <TRO> <07/12/2016>
 */

'use strict';

// dependencies
var _ = require('lodash');

/**
 * module function
 */
function applyModel(obj, model, parent, key) {

    // Apply to items of arrays
    if (model.type === "array") {
        _.forEach(obj, (item, index) => {
            applyModel(item, model.items, obj, index);
        });
    }
    // Apply to properties of objects
    else if (model.type === "object" && model.properties) {

        // remove properties from the data that are not present in the model
        _.forEach(obj, (val, prop) => {
            if (!model.properties.hasOwnProperty(prop)) {
                delete obj[prop];
            }
        });

        // for each property in the model
        _.forEach(model.properties, (submodel, prop) => {
            // properties to ignore
            if (submodel["export-ignore"]) {
                delete obj[prop];
                return;
            }

            // create properties from the model that are missing in the data
            if (!obj.hasOwnProperty(prop)) {
                obj[prop] = {};
            }

            // transform a property into an attribute
            else if (submodel["export-toAttribute"]) {
                obj['@' + prop] = {};
                obj['@' + prop][prop] = obj[prop];
                delete obj[prop];
            }

            applyModel(obj[prop], model.properties[prop], obj, prop);
        });

        // order properties if needed
        if (model["export-ordered"]) {
            var map = new Map();
            _.forEach(obj, (val, key) => {
                map.set(key, val);
            });
            parent[key] = new Map([...map.entries()].sort((a, b) => {
                if (!model.properties[a[0]] || !model.properties[a[0]]["export-order"]) return 999;
                if (!model.properties[b[0]] || !model.properties[b[0]]["export-order"]) return -999;
                return model.properties[a[0]]["export-order"] - model.properties[b[0]]["export-order"];
            }));
        }
    }
}

module.exports = applyModel;
