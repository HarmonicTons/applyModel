// dependencies
var js2xmlparser = require("js2xmlparser");
var applyModel = require('./applyModel');

var data = {
    "Object": [{
        "a": "hello",
        "d": {
            "a": 5,
            "b": 6,
            "c": 7
        },
        "b": 2,
        "c": [{
            "a": 5,
            "b": 6
        }, {
            "a": 4,
            "b": 21
        }],
        "e": ["hello", "how are you"]
    }, {
        "a": "goodbye",
        "b": 3,
        "c": [{
            "a": 5,
            "b": 6
        }, {
            "a": 4,
            "b": 21
        }],
        "d": {
            "a": 5,
            "b": 6,
            "c": 7
        },
        "e": ["---", "azerazer"],
        "f": 5,
        "g": 8
    }]
}

var model = {
    "type": "object",
    "properties": {
        "Object": {
            "type": "array",
            "items": {
                "type": "object",
                "export-ordered": true,
                "properties": {
                    "a": {
                        "export-toAttribute": true
                    },
                    "b": {
                        "export-order": 1
                    },
                    "c": {
                        "export-order": 2,
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "a": {
                                },
                                "b": {
                                    "export-ignore": true
                                }
                            }
                        }
                    },
                    "d": {
                        "export-order": 3,
                        "type": "object",
                        "properties": {
                            "a": {
                            },
                            "b": {
                            },
                            "c": {
                                "export-ignore": true
                            }
                        }
                    },
                    "e": {
                        "export-order": 4,
                        "type": "array",
                        "export-ignore": true,
                        "items": {

                        }
                    },
                    "f": {
                        "export-order": 5
                    }
                }
            }
        }
    }
}



// apply model to data
var formatedData = applyModel(data, model);

// build XML from data
var xml = js2xmlparser.parse("MAIN", formatedData);
