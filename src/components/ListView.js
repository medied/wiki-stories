import { h } from 'preact'

/**
 * The containerRef is suggested to be used together with the hooks useNavigation
 * without the containerRef, the view won't scroll to the selected row
 */
export const ListView = ({ items = [], header, containerRef, empty, handleClick }) => {
  return (
    <div class='listview'>
      { header && <div class='header'>{header}</div> }
      <div class='list' ref={containerRef}>
        {
          items.length ? items.map(item => (
            item.imageUrl ? (
              <div class='item' dir={item.dir} data-selectable data-title={item.title} data-selected-key={item.title} key={item.title} onClick={() => { handleClick(item.title) }}>
                <div class='info'>
                  <bdi class='title' dangerouslySetInnerHTML={{ __html: item.displayTitle || item.title }} />
                  { item.description && <bdi class='description' dangerouslySetInnerHTML={{ __html: item.description }} /> }
                </div>
                { item.imageUrl && <div class='img' style={{ backgroundImage: `url(${item.imageUrl})` }} /> }
                { item.link && <div class='link'><img src='/images/link.svg' /></div> }
              </div>
            ) : null
          )) : <div class='empty'>{empty}</div>
        }
      </div>
    </div>
  )
}
