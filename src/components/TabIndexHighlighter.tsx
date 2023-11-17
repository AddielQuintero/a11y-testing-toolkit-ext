import tabIndex from '../assets/tabIndex.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const TabIndexHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showTabIndexes, setShowTabIndexes, iconClass] = useLocalStorage('TabIndexActive', false)

  const codeToExecute = function(showTabIndexes: boolean) {
    const removeIndicators = () => {
      const elements = document.querySelectorAll('.a11yToolkit-tabindex-processed')
      elements.forEach((element) => {
        element.classList.remove('a11yToolkit-tabindex-processed')

        const indicator = element.previousElementSibling
        if (indicator && indicator.classList.contains('a11yToolkit-tabindex-indicator')) {
          indicator.remove()
        }
      })
    }

    const highlightTabIndex = () => {
      const elements = document.querySelectorAll('[tabindex]')
      elements.forEach((element: any) => {
        if (element.classList.contains('a11yToolkit-tabindex-processed')) {
          return
        }

        element.classList.add('a11yToolkit-tabindex-processed')

        const valueTabIndex = element.getAttribute('tabindex') || 'unknown'

        const span = document.createElement('span')
        span.className = 'a11yToolkit-tabindex-indicator'
        span.style.position = 'relative'
        span.style.padding = '2px'
        span.style.height = 'max-content'
        span.style.zIndex = '999'
        span.style.background = 'red'
        span.style.color = 'white'
        // span.style.fontSize = '11px'
        span.innerText = valueTabIndex

        const numericValueTabIndex = parseInt(valueTabIndex, 10)
        if (numericValueTabIndex >= 1) {
          span.innerText += '⚠️'
        }

        // element.appendChild(span)
        element.insertAdjacentElement('beforebegin', span)
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
