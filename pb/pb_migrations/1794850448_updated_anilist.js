/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9iefm82ad06o7ea")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mdbildmi",
    "name": "startDate_month",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 12,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srbuclmm",
    "name": "startDate_day",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 31,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9iefm82ad06o7ea")

  // remove
  collection.schema.removeField("mdbildmi")

  // remove
  collection.schema.removeField("srbuclmm")

  return dao.saveCollection(collection)
})
