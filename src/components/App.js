import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Routes, PopupContainer, OfflineIndicator } from 'components'
import { DirectionContext, I18nContext, PopupContext, FontContext } from 'contexts'
import { articleTextSize } from 'utils'
import { useErrorLogging } from 'hooks'

export const App = ({ i18n, dir }) => {
  // @todo making it used by the global state management
  const [popupState, setPopupState] = useState([])
  const [url, setUrl] = useState()

  // useDirection
  const [dirState, setDirState] = useState(dir)
  useEffect(() => {
    document.body.setAttribute('dir', dirState)
  }, [dirState])
  // end of useDirection

  // useTextSize
  const [textSize, setTextSize] = useState(articleTextSize.get())
  useEffect(() => {
    document.body.className = `font-size-${textSize + 1}`
  }, [textSize])
  // end of useTextSize

  useErrorLogging()

  return (
    <I18nContext.Provider value={i18n}>
      <PopupContext.Provider value={{ popupState, setPopupState }}>
        <DirectionContext.Provider value={{ dirState, setDirState }}>
          <FontContext.Provider value={{ textSize, setTextSize }}>
            <OfflineIndicator routeUrl={url} />
            <Routes onRouteChange={({ url }) => setUrl(url)} />
            <PopupContainer popups={popupState} />
          </FontContext.Provider>
        </DirectionContext.Provider>
      </PopupContext.Provider>
    </I18nContext.Provider>
  )
}
