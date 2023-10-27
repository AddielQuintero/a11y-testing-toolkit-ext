import { TabIndexHighlighter } from './components/TabIndexHighlighter'
import { AutocompleteHighlighter } from './components/AutocompleteHighlighter'
import { AriaRolesHighlighter } from './components/AriaRolesHighlighter'
import { LandMarksHighlighter } from './components/LandMarksHighlighter'
import './App.css'

function App() {
  return (
    <>
      <div className="toolkit">
        <TabIndexHighlighter />
        <AutocompleteHighlighter />
        <AriaRolesHighlighter />
        <LandMarksHighlighter />
      </div>
    </>
  )
}

export default App
