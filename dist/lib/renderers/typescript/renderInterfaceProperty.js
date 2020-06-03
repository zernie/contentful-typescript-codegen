"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renderInterfaceProperty(name, type, required, localization, localized, description) {
    return [
        descriptionComment(description),
        name,
        required ? "" : "?",
        ": ",
        localization ? renderLocalizedField(localized, type) : type,
        required ? "" : " | undefined",
        ";",
    ].join("");
}
exports.default = renderInterfaceProperty;
function renderLocalizedField(localized, type) {
    return localized ? "LocalizedField<" + type + ">" : "DefaultLocalizedField<" + type + ">";
}
function descriptionComment(description) {
    if (description) {
        return "/** " + description + " */\n";
    }
    else {
        return "";
    }
}
//# sourceMappingURL=renderInterfaceProperty.js.map