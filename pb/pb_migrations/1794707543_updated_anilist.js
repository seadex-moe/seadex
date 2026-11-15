/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9iefm82ad06o7ea")

  // remove
  collection.schema.removeField("5r6jbgsr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4ek1yqjr",
    "name": "startDate",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9iefm82ad06o7ea")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5r6jbgsr",
    "name": "startDate_year",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("4ek1yqjr")

  return dao.saveCollection(collection)
})
