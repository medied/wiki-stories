import { renderImageSlider, onShowFn as sliderOnShowFn } from 'utils'

const prefixClassname = 'wp-gallery-fullscreen'

const renderFullScreenGallery = (lang, dir, title) => {
  console.log('renderFullscreeGallery - title...', title)
  return `
    <div class="${prefixClassname}" lang="${lang}" dir="${dir}">
      <div class="${prefixClassname}-close"></div>
      <div class="${prefixClassname}-title">${title}</div>
      <div class="${prefixClassname}-main"></div>
    </div>
  `.trim()
}

const hideFullscreenGallery = (container = document.body) => {
  console.log('fullscreen.js - hideFullscreenGallery - container...', container)
  const fullscreenGallery = container.querySelector(`.${prefixClassname}`)
  if (fullscreenGallery) {
    container.removeChild(fullscreenGallery)
  }
}

const showFullscreenGallery = (mediaItems, selectedThumb, lang, dir, container = document.body, handleNext, title) => {
  // render utils for fullscreen then slider component
  container.insertAdjacentHTML('beforeend', renderFullScreenGallery(lang, dir, title))
  container.querySelector(`.${prefixClassname}-main`)
    .insertAdjacentHTML('beforeend', renderImageSlider(mediaItems, selectedThumb, lang, dir, container))

  const url = buildWikipediaUrl(lang, title, true)
  console.log('fullscreen.js - url...', url)
  // onShow event for full screen component
  const closeButton = container.querySelector(`.${prefixClassname}-close`)
  closeButton.addEventListener('click', () => {
    hideFullscreenGallery(container)
  })

  // onShow event for slider component
  sliderOnShowFn(handleNext, url)
}

const buildWikipediaUrl = (lang, title, touch) => {
  return `https://${lang}${touch ? '.m' : ''}.wikipedia.org/wiki/${encodeURIComponent(title)}`
}

export { showFullscreenGallery, hideFullscreenGallery, buildWikipediaUrl }
