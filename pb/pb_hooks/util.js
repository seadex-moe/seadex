module.exports = {
  copy: obj => JSON.parse(JSON.stringify(obj)),
  anilistData: id => {
    try {
      const data = $app.dao()?.findFirstRecordByFilter('anilist', `alID = '${id}'`)

      const title = data.get('title_english') || data.get('title_userPreferred') || ''
      const poster = data.get('coverImage_extraLarge') || data.get('coverImage_medium') || ''
      return {
        title,
        poster
      }
    } catch (e) {
      console.log(e.toString())
      return id
    }
  }
}
