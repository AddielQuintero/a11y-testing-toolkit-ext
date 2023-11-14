import tabIndex from '../assets/tabIndex.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const TabIndexHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showTabIndexes, setShowTabIndexes, iconClass] = useLocalStorage('TabIndexActive', false)

  const codeToExecute = function(showTabIndexes: boolean) {
    const removeIndicators = () => {
      const indicators = document.querySelectorAll('.a11yToolkit-tabindex-indicator')
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
          span.className = 'a11yToolkit-tabindex-indicator'
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
          if (numericValueTabIndex >= 1) {
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
    <CustomButton
      onMouseEnter={() => setTooltipText('Tab Index')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={tabIndex} className="svg-icon" alt="Focus Indicator Icon" />
    </CustomButton>
  )
}
