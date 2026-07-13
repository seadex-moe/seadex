/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lugqetp0",
    "name": "subGrouping",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^-?\\d+:.+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oiwizhmushn5qqh")

  // remove
  collection.schema.removeField("lugqetp0")

  return dao.saveCollection(collection)
})
