#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var prettier = require('prettier');
var lodash = require('lodash');
var path = _interopDefault(require('path'));
var fsExtra = require('fs-extra');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function renderContentfulImports() {
    return "\n    // THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.\n\n    import { Asset, Entry } from 'contentful'\n    import { Document } from '@contentful/rich-text-types'\n  ";
}

function renderInterface(_a) {
    var name = _a.name, extension = _a.extension, fields = _a.fields, description = _a.description;
    return "\n    " + (description ? "/** " + description + " */" : "") + "\n    export interface " + name + " " + (extension ? "extends " + extension : "") + " {\n      " + fields + "\n    }\n  ";
}

function renderInterfaceProperty(name, type, required, localization, description) {
    return [
        descriptionComment(description),
        name,
        required ? "" : "?",
        ": ",
        localization ? "Record<CONTENT_TYPE, " + type + ">" : type,
        required ? "" : " | undefined",
        ";",
    ].join("");
}
function descriptionComment(description) {
    if (description) {
        return "/** " + description + " */\n";
    }
    else {
        return "";
    }
}

function renderField(field, type, localization) {
    if (localization === void 0) { localization = false; }
    return renderInterfaceProperty(field.id, type, field.required, field.localized && localization, field.name);
}

function renderContentTypeId(contentTypeId) {
    return "I" + lodash.upperFirst(lodash.camelCase(contentTypeId));
}

function renderUnion(name, values) {
    return "\n    type " + name + " = " + renderUnionValues(values) + ";\n  ";
}
function renderUnionValues(values) {
    if (values.length === 0) {
        return "never";
    }
    else {
        return values.join(" | ");
    }
}

function renderSymbol(field) {
    var inValidation = field.validations.find(function (validation) { return !!validation.in; });
    if (inValidation) {
        return renderUnionValues(inValidation.in.map(function (value) { return "'" + value + "'"; }));
    }
    else {
        return "string";
    }
}

function renderLink(field) {
    if (field.linkType === "Asset") {
        return "Asset";
    }
    if (field.linkType === "Entry") {
        var contentTypeValidation = field.validations.find(function (validation) { return !!validation.linkContentType; });
        if (contentTypeValidation) {
            return renderUnionValues(contentTypeValidation.linkContentType.map(renderContentTypeId));
        }
        else {
            return "Entry<{ [fieldId: string]: unknown }>";
        }
    }
    return "unknown";
}

function renderArrayOf(source) {
    return "(" + source + ")[]";
}

function renderArray(field) {
    if (!field.items) {
        throw new Error("Cannot render non-array field " + field.id + " as an array");
    }
    var fieldWithValidations = __assign({}, field, { linkType: field.items.linkType, validations: field.items.validations || [] });
    switch (field.items.type) {
        case "Symbol": {
            return renderArrayOf(renderSymbol(fieldWithValidations));
        }
        case "Link": {
            return renderArrayOf(renderLink(fieldWithValidations));
        }
    }
    return renderArrayOf("unknown");
}

function renderBoolean(field) {
    return "boolean";
}

function renderLocation(field) {
    return "{ lat: number, lon: number }";
}

function renderNumber(field) {
    return "number";
}

function renderObject(field) {
    return "Record<string, any>";
}

function renderRichText(field) {
    return "Document";
}

function renderContentType(contentType, localization) {
    var name = renderContentTypeId(contentType.sys.id);
    var fields = renderContentTypeFields(contentType.fields, localization);
    var sys = renderSys(contentType.sys);
    return "\n    " + renderInterface({ name: name + "Fields", fields: fields }) + "\n\n    " + descriptionComment$1(contentType.description) + "\n    " + renderInterface({ name: name, extension: "Entry<" + name + "Fields>", fields: sys }) + "\n  ";
}
function descriptionComment$1(description) {
    if (description) {
        return "/** " + description + " */";
    }
    return "";
}
function renderContentTypeFields(fields, localization) {
    return fields
        .filter(function (field) { return !field.omitted; })
        .map(function (field) {
        var functionMap = {
            Array: renderArray,
            Boolean: renderBoolean,
            Date: renderSymbol,
            Integer: renderNumber,
            Link: renderLink,
            Location: renderLocation,
            Number: renderNumber,
            Object: renderObject,
            RichText: renderRichText,
            Symbol: renderSymbol,
            Text: renderSymbol,
        };
        return renderField(field, functionMap[field.type](field), localization);
    })
        .join("\n\n");
}
function renderSys(sys) {
    return "\n    sys: {\n      id: string;\n      type: string;\n      createdAt: string;\n      updatedAt: string;\n      locale: string;\n      contentType: {\n        sys: {\n          id: '" + sys.id + "';\n          linkType: 'ContentType';\n          type: 'Link';\n        }\n      }\n    }\n  ";
}

function renderAllLocales(locales) {
    return renderUnion("LOCALE_CODE", locales.map(function (locale) { return "'" + locale.code + "'"; }));
}

function renderDefaultLocale(locales) {
    var defaultLocale = locales.find(function (locale) { return locale.default; });
    if (!defaultLocale) {
        throw new Error("Could not find a default locale in Contentful.");
    }
    return "type CONTENTFUL_DEFAULT_LOCALE_CODE = '" + defaultLocale.code + "';";
}

function renderNamespace(source, namespace) {
    if (!namespace)
        return source;
    return "\n    declare namespace " + namespace + " {\n    " + source + "\n    }\n\n    export as namespace " + namespace + "\n    export=" + namespace + "\n  ";
}

function render(contentTypes, locales, _a) {
    var _b = _a === void 0 ? {} : _a, namespace = _b.namespace, _c = _b.localization, localization = _c === void 0 ? false : _c;
    return __awaiter(this, void 0, void 0, function () {
        var sortedContentTypes, sortedLocales, typingsSource, source, prettierConfig;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sortedContentTypes = contentTypes.sort(function (a, b) { return a.sys.id.localeCompare(b.sys.id); });
                    sortedLocales = locales.sort(function (a, b) { return a.code.localeCompare(b.code); });
                    typingsSource = [
                        renderAllContentTypes(sortedContentTypes, localization),
                        renderAllContentTypeIds(sortedContentTypes),
                        renderAllLocales(sortedLocales),
                        renderDefaultLocale(sortedLocales),
                    ].join("\n\n");
                    source = [renderContentfulImports(), renderNamespace(typingsSource, namespace)].join("\n\n");
                    return [4 /*yield*/, prettier.resolveConfig(process.cwd())];
                case 1:
                    prettierConfig = _d.sent();
                    return [2 /*return*/, prettier.format(source, __assign({}, prettierConfig, { parser: "typescript" }))];
            }
        });
    });
}
function renderAllContentTypes(contentTypes, localization) {
    return contentTypes.map(function (contentType) { return renderContentType(contentType, localization); }).join("\n\n");
}
function renderAllContentTypeIds(contentTypes) {
    return renderUnion("CONTENT_TYPE", contentTypes.map(function (contentType) { return "'" + contentType.sys.id + "'"; }));
}

function renderLink$1(field) {
    if (field.linkType === "Asset") {
        return "any";
    }
    if (field.linkType === "Entry") {
        var contentTypeValidation = field.validations.find(function (validation) { return !!validation.linkContentType; });
        if (contentTypeValidation) {
            return renderUnionValues(contentTypeValidation.linkContentType.map(renderContentTypeId));
        }
        else {
            return "unknown";
        }
    }
    return "unknown";
}

function renderArray$1(field) {
    if (!field.items) {
        throw new Error("Cannot render non-array field " + field.id + " as an array");
    }
    var fieldWithValidations = __assign({}, field, { linkType: field.items.linkType, validations: field.items.validations || [] });
    switch (field.items.type) {
        case "Symbol": {
            return renderArrayOf(renderSymbol(fieldWithValidations));
        }
        case "Link": {
            return renderArrayOf(renderLink$1(fieldWithValidations));
        }
    }
    return renderArrayOf("unknown");
}

function renderRichText$1(field) {
    return "any";
}

function renderContentType$1(contentType) {
    var name = renderContentTypeId(contentType.sys.id);
    var fields = renderContentTypeFields$1(contentType.fields);
    return renderInterface({
        name: name,
        fields: "\n      fields: { " + fields + " };\n      [otherKeys: string]: any;\n    ",
    });
}
function renderContentTypeFields$1(fields) {
    return fields
        .filter(function (field) { return !field.omitted; })
        .map(function (field) {
        var functionMap = {
            Array: renderArray$1,
            Boolean: renderBoolean,
            Date: renderSymbol,
            Integer: renderNumber,
            Link: renderLink$1,
            Location: renderLocation,
            Number: renderNumber,
            Object: renderObject,
            RichText: renderRichText$1,
            Symbol: renderSymbol,
            Text: renderSymbol,
        };
        return renderField(field, functionMap[field.type](field));
    })
        .join("\n\n");
}

function renderFieldsOnly(contentTypes, _a) {
    var namespace = (_a === void 0 ? {} : _a).namespace;
    return __awaiter(this, void 0, void 0, function () {
        var sortedContentTypes, typingsSource, source, prettierConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sortedContentTypes = contentTypes.sort(function (a, b) { return a.sys.id.localeCompare(b.sys.id); });
                    typingsSource = renderAllContentTypes$1(sortedContentTypes);
                    source = [renderNamespace(typingsSource, namespace)].join("\n\n");
                    return [4 /*yield*/, prettier.resolveConfig(process.cwd())];
                case 1:
                    prettierConfig = _b.sent();
                    return [2 /*return*/, prettier.format(source, __assign({}, prettierConfig, { parser: "typescript" }))];
            }
        });
    });
}
function renderAllContentTypes$1(contentTypes) {
    return contentTypes.map(function (contentType) { return renderContentType$1(contentType); }).join("\n\n");
}

var meow = require("meow");
var cli = meow("\n  Usage\n    $ contentful-typescript-codegen --output <file> <options>\n\n  Options\n    --output,      -o  Where to write to\n    --poll,        -p  Continuously refresh types\n    --interval N,  -i  The interval in seconds at which to poll (defaults to 15)\n    --namespace N, -n  Wrap types in namespace N (disabled by default)\n    --fields-only      Output a tree that _only_ ensures fields are valid\n                       and present, and does not provide types for Sys,\n                       Assets, or Rich Text. This is useful for ensuring raw\n                       Contentful responses will be compatible with your code.\n    --localization -l  Output fields with localized values\n\n  Examples\n    $ contentful-typescript-codegen -o src/@types/generated/contentful.d.ts\n", {
    flags: {
        output: {
            type: "string",
            alias: "o",
            required: true,
        },
        fieldsOnly: {
            type: "boolean",
            required: false,
        },
        poll: {
            type: "boolean",
            alias: "p",
            required: false,
        },
        interval: {
            type: "string",
            alias: "i",
            required: false,
        },
        localization: {
            type: "boolean",
            alias: "l",
            required: false,
        },
        namespace: {
            type: "string",
            alias: "n",
            required: false,
        },
    },
});
function runCodegen(outputFile) {
    return __awaiter(this, void 0, void 0, function () {
        var getEnvironmentPath, getEnvironment, environment, contentTypes, locales, outputPath, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getEnvironmentPath = path.resolve(process.cwd(), "./getContentfulEnvironment.js");
                    getEnvironment = require(getEnvironmentPath);
                    return [4 /*yield*/, getEnvironment()];
                case 1:
                    environment = _a.sent();
                    return [4 /*yield*/, environment.getContentTypes({ limit: 1000 })];
                case 2:
                    contentTypes = _a.sent();
                    return [4 /*yield*/, environment.getLocales()];
                case 3:
                    locales = _a.sent();
                    outputPath = path.resolve(process.cwd(), outputFile);
                    if (!cli.flags.fieldsOnly) return [3 /*break*/, 5];
                    return [4 /*yield*/, renderFieldsOnly(contentTypes.items, { namespace: cli.flags.namespace })];
                case 4:
                    output = _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, render(contentTypes.items, locales.items, {
                        localization: cli.flags.localization,
                        namespace: cli.flags.namespace
                    })];
                case 6:
                    output = _a.sent();
                    _a.label = 7;
                case 7:
                    fsExtra.outputFileSync(outputPath, output);
                    return [2 /*return*/];
            }
        });
    });
}
runCodegen(cli.flags.output).catch(function (error) {
    console.error(error);
    process.exit(1);
});
if (cli.flags.poll) {
    var intervalInSeconds = parseInt(cli.flags.interval, 10);
    if (!isNaN(intervalInSeconds) && intervalInSeconds > 0) {
        setInterval(function () { return runCodegen(cli.flags.output); }, intervalInSeconds * 1000);
    }
    else {
        throw new Error("Expected a positive numeric interval, but got " + cli.flags.interval);
    }
}
//# sourceMappingURL=contentful-typescript-codegen.js.map
