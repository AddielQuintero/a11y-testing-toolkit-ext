import { TabIndexHighlighter } from './components/TabIndexHighlighter'
import { AutocompleteHighlighter } from './components/AutocompleteHighlighter'
import { AriaRolesHighlighter } from './components/AriaRolesHighlighter'
import { LandMarksHighlighter } from './components/LandMarksHighlighter'
import { HeadingsHighlighter } from './components/HeadingsHighlighter'
import { TargetSize } from './components/TargetSize'

function App() {
  return (
    <>
      <div className="toolkit">
        <HeadingsHighlighter />
        <TabIndexHighlighter />
        <AutocompleteHighlighter />
        <AriaRolesHighlighter />
        <LandMarksHighlighter />
        <TargetSize />
      </div>
    </>
  )
}

export default App
