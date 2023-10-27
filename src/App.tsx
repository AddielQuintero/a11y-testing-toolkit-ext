import { TabIndexHighlighter } from './components/TabIndexHighlighter'
import { AutocompleteHighlighter } from './components/AutocompleteHighlighter'
import './App.css'

function App() {
  return (
    <>
      <div className="toolkit">
        <TabIndexHighlighter />
        <AutocompleteHighlighter />
      </div>
    </>
  )
}

export default App
