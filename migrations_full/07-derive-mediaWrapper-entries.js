/*
transformEntriesToType from product to mediaWrapper
-derive a mediaWrapper entry from an existing image in product.
-use the product slug as title to make entries unique unique

*/

const _ = require("lodash");

module.exports = function(migration) {
    migration.transformEntriesToType({
        sourceContentType: "product",
        targetContentType: "mediaWrapper",
        from: ["image", "slug"],
        shouldPublish: true,
        updateReferences: false,
        removeOldEntries: false,
        identityKey: function(fields) {
            try {
                const slug = _.get(fields, "slug['en-US']");
                if (slug) {
                    return slug;
                }
            } catch (error) {
                console.error("Error in identityKey:", error);
            }
        },
        transformEntryForLocale: function(fromFields, currentLocale) {
            try {
                const oldImageId = _.get(fromFields, "image['en-US'].sys.id");
                const slug = _.get(fromFields, "slug['en-US']");

                if (oldImageId && slug) {
                    const derivedAsset = {
                        sys: { type: "Link", linkType: "Asset", id: oldImageId },
                    };

                    return {
                        internalName: slug,
                        title: slug,
                        altText: "no altText",
                        asset: derivedAsset,
                    };
                } else {
                    console.warn("Missing image or slug for entry. Skipping transformation.");
                    return false;
                }
            } catch (error) {
                console.error("Error in transformEntryForLocale:", error);
                return false;
            }
        },
    });
};
