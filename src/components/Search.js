import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, OfflinePanel } from 'components'
import {
  useNavigation, useSearch, useI18n,
  useOnlineStatus
} from 'hooks'
import {
  articleHistory, getAppLanguage, showFullscreenGallery, hideFullscreenGallery
} from 'utils'
import { getRandomArticleTitle, getArticleMediaList, getSuggestedArticles } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  let previousTitle
  let currentTitle
  let nextTitle
  const [, setNavigation] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
  const isOnline = useOnlineStatus(online => {
    if (online) {
      setQuery(inputRef.current.value)
    }
  })

  const renderStory = (title) => {
    const [mediaPromise] = getArticleMediaList(lang, title)
    const [suggestionsPromise] = getSuggestedArticles(lang, title)

    Promise.all([mediaPromise, suggestionsPromise]).then(([media, suggestions]) => {
      console.log('Search - renderStory - title...', title)
      console.log('Search - renderStory - media...', media)
      console.log('Search - renderStory - suggestions...', suggestions)
      // setNextTitle(suggestions[0].title)
      if (suggestions) {
        nextTitle = suggestions[0].title // hacking
      }
      currentTitle = title // 'next previous title'
      // console.log('Search - nextTitle...', nextTitle)
      // console.log('Search - currentTitle...', currentTitle)
      // console.log('Search - previousTitle...', previousTitle)
      hideFullscreenGallery()
      showFullscreenGallery(media, '', lang, 'ltr', document.body, renderNextStory, title)
    })
  }

  const handleClick = (title) => {
    console.log('Search - handleClick - title..', title)
    renderStory(title)
  }

  const renderNextStory = (direction) => {
    console.log('Search - renderNextStory - direction...', direction)

    if (previousTitle === nextTitle) {
      goToRandomArticle()
    } else if (direction > 0) {
      // forward
      console.log('Search - renderNextStory - forward - previousTitle...', previousTitle)
      console.log('Search - renderNextStory - forward - currentTitle...', currentTitle)
      console.log('Search - renderNextStory - forward - nextTitle...', nextTitle)
      previousTitle = currentTitle
      renderStory(nextTitle)
    } else {
      // backward
      console.log('Search - renderNextStory - backward - previousTitle...', previousTitle)
      console.log('Search - renderNextStory - backward - currentTitle...', currentTitle)
      console.log('Search - renderNextStory - backward - nextTitle...', nextTitle)
      renderStory(previousTitle || currentTitle)
    }
  }

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
  }

  const goToRandomArticle = () => {
    const [randomPromise] = getRandomArticleTitle(lang)

    randomPromise.then(title => {
      console.log('Search - random title...', title)
      renderStory(title)
    })
  }

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/wiki20.png' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable maxlength='255' />
      { (isOnline && !searchResults) && <div class='random' onClick={goToRandomArticle}><img class='random-img' src='images/wiki20random.png' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} /><p>Or go random!</p></div> }
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} handleClick={handleClick} /> }
      { !isOnline && <OfflinePanel /> }
    </div>
  )
}
