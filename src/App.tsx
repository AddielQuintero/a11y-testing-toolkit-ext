import { useState } from 'react'
import { TabIndexHighlighter } from './components/TabIndexHighlighter'
import { AutocompleteHighlighter } from './components/AutocompleteHighlighter'
import { AriaRolesHighlighter } from './components/AriaRolesHighlighter'
import { LandMarksHighlighter } from './components/LandMarksHighlighter'
import { HeadingsHighlighter } from './components/HeadingsHighlighter'
import { ListItemsHighlighter } from './components/ListItemsHighlighter'
import { TargetSize } from './components/TargetSize'

function App() {
  const [tooltipText, setTooltipText] = useState('')

  return (
    <>
      <div className="toolkit">
        <div className="toolkit__container">
          <HeadingsHighlighter setTooltipText={setTooltipText} />
          <ListItemsHighlighter setTooltipText={setTooltipText} />
          <TabIndexHighlighter setTooltipText={setTooltipText} />
          <AutocompleteHighlighter setTooltipText={setTooltipText} />
          <AriaRolesHighlighter setTooltipText={setTooltipText} />
          <LandMarksHighlighter setTooltipText={setTooltipText} />
          <TargetSize setTooltipText={setTooltipText} />
        </div>
        <div className="toolkit__title">{tooltipText}</div>
      </div>
    </>
  )
}

export default App
