// From https://stackoverflow.com/a/43467144
function validURL (str) {
  let url

  try {
    url = new URL(str)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

module.exports = validURL
