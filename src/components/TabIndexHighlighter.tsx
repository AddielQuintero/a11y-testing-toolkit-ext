import { useState } from 'react'

export const TabIndexHighlighter = () => {
  const [showTabIndexes, setShowTabIndexes] = useState(false)

  const codeToExecute = function(showTabIndexes: boolean) {
    if (showTabIndexes) {
      const indicators = document.querySelectorAll('.tabindex-indicator')
      indicators.forEach((indicator) => indicator.remove())
    } else {
      const elements = document.querySelectorAll('[tabindex]')
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const valueTabIndex = element.getAttribute('tabindex') || 'unknown'
          const positionStyle = window.getComputedStyle(element).position
          if (positionStyle === 'static') {
            element.style.position = 'relative'
          }

          const span = document.createElement('span')
          span.className = 'tabindex-indicator'
          span.style.position = 'absolute'
          span.style.padding = '2px'
          span.style.top = '0'
          span.style.left = '0'
          span.style.zIndex = '999'
          span.style.background = 'red'
          span.style.color = 'white'
          span.style.fontSize = '11px'
          span.innerText = valueTabIndex

          const numericValueTabIndex = parseInt(valueTabIndex, 10)
          if (numericValueTabIndex > 1) {
            span.innerText += '⚠️'
          }

          element.appendChild(span)
        }
      })
    }
  }

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab && currentTab.id) {
        const tabId = currentTab.id

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: codeToExecute,
            args: [showTabIndexes],
          },
          () => setShowTabIndexes(!showTabIndexes)
        )
      }
    })
  }

  return <button onClick={handleClick}>{showTabIndexes ? 'Hide TI' : 'Show TI'}</button>
}