/**
 * applyModel.js
 * Apply a JSON model to a JS object to prepare it for the js2xmlparser module
 *
 * Applicable formats:
 *      - "export-ignore": the property will not be exported in the XML,
 *      - "export-toAttribute": the property will be an attribute of its parent in the XML,
 *      - "export-order": the properties will be in a specified ordered in the XML.
 *
 * Created by troncin on 07/12/2016.
 */

'use strict';

/**
 * Apply a model to an object
 * @param data object to modify
 * @param model model to apply
 */
function applyModel(data, model) {
    try {

        // Apply to items of arrays
        if (model.type === "array") {
            return data.map(item => applyModel(item, model.items));
        }

        // Apply to properties of objects or maps
        else if (model.type === "object" && model.properties) {

            // copy the source data into a map
            let map = new Map();
            Object.keys(data).forEach(key => {
                // keep only the properties that are in the model
                if (model.properties.hasOwnProperty(key)) {
                    map.set(key, data[key]);
                }
            });

            // for each property in the model
            var isOrdered = false;
            Object.keys(model.properties).forEach(prop => {
                let submodel = model.properties[prop];
                //check if is ordered
                if (submodel["export-order"]) {
                    isOrdered = true;
                }

                // properties to ignore
                if (submodel["export-ignore"]) {
                    map.delete(prop);
                    return;
                }

                // create properties from the model that are missing in the data
                if (typeof map.get(prop) === 'undefined') {
                    let val = {};
                    if (submodel.type === "number") {
                        val = 0;
                    } else if (submodel.type === "string") {
                        val = "";
                    } else if (submodel.type === "array") {
                        val = [];
                    }
                    map.set(prop, val);
                }

                // transform a property into an attribute
                else if (submodel["export-toAttribute"]) {
                    let subobj = {}
                    subobj[prop] = map.get(prop);
                    map.set('@' + prop, subobj);
                    map.delete(prop);
                    return;
                }

                // apply model to children
                map.set(prop, applyModel(map.get(prop), model.properties[prop]));
            });

            // order properties if needed
            if (isOrdered) {
                return new Map([...map.entries()].sort((a, b) => {
                    if (!model.properties[a[0]] || !model.properties[a[0]]["export-order"]) return 999;
                    if (!model.properties[b[0]] || !model.properties[b[0]]["export-order"]) return -999;
                    return model.properties[a[0]]["export-order"] - model.properties[b[0]]["export-order"];
                }));
            }

            return map;
        }

        return data;

    } catch (error) {
        console.error(`ApplyModel Error: \n\t Data: ${JSON.stringify(data)}, \n\t Model: ${JSON.stringify(model)}, \n\t Error: ${error}.`);
    }
}

module.exports = applyModel;
