import { cachedFetch, buildMwApiUrl, buildCommonsApiUrl } from 'utils'

export const getArticleMediaInfo = (lang, title, fromCommon) => {
  const params = {
    action: 'query',
    prop: 'imageinfo',
    iiextmetadatafilter: 'License|LicenseShortName|ImageDescription|Artist',
    iiextmetadatalanguage: lang,
    iiextmetadatamultilang: 1,
    iiurlwidth: getDeviceSize().width,
    iiurlheight: getDeviceSize().height,
    iiprop: 'url|extmetadata',
    titles: title
  }

  const url = fromCommon ? buildCommonsApiUrl(params) : buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    const pages = data.query.pages
    const imageInfo = pages[0].imageinfo

    if (!imageInfo) {
      return {}
    }

    const { Artist, ImageDescription, LicenseShortName } = imageInfo[0].extmetadata
    const author = Artist && strip(Artist.value)
    const description = ImageDescription && strip(
      (typeof ImageDescription.value === 'string' && ImageDescription.value) ||
      (ImageDescription.value[lang] || ImageDescription.value[Object.keys(ImageDescription.value)[0]])
    )

    const imageUrl = imageInfo[0].thumburl

    return {
      author,
      description,
      license: LicenseShortName && LicenseShortName.value,
      filePage: convertUrlToMobile(imageInfo[0].descriptionshorturl),
      bestFitImageUrl: imageUrl
    }
  })
}

const convertUrlToMobile = url => {
  return url.replace(/https:\/\/(.*?)\./, subDomain => subDomain + 'm.')
}

const strip = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

const getDeviceSize = () => {
  return { height: window.innerHeight, width: window.innerWidth }
}
