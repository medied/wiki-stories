import { h } from 'preact'
import { Router } from 'preact-router'
import { createHashHistory } from 'history'
import { Search } from 'components'

export const Routes = ({ onRouteChange }) => {
  const onChange = ({ url }) => {
    onRouteChange(url)
  }
  return (
    <Router history={createHashHistory()} onChange={onChange}>
      <Search path='/' />
    </Router>
  )
}
