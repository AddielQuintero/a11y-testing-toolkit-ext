import { useState } from 'react'
import { Bs1SquareFill } from 'react-icons/bs'
import { Bs1Square } from 'react-icons/bs'
import { CustomButton } from './common/Button'

export const TabIndexHighlighter = () => {
  const [showTabIndexes, setShowTabIndexes] = useState(false)

  const codeToExecute = function(showTabIndexes: boolean) {
    const removeIndicators = () => {
      const indicators = document.querySelectorAll('.tabindex-indicator')
      indicators.forEach((indicator) => indicator.remove())
    }

    const highlightTabIndex = () => {
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

    if (showTabIndexes) {
      removeIndicators()
    } else {
      highlightTabIndex()
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

  return (
    <CustomButton onClick={handleClick}>
      {showTabIndexes ? (
        <Bs1SquareFill className="buttons__icons" />
      ) : (
        <Bs1Square className="buttons__icons" />
      )}
    </CustomButton>
  )
}
