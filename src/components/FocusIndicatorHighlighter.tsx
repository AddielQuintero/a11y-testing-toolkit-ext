import { useState } from 'react'
import { CustomButton } from './common/Button'
import focusIndicatorIcon from '../assets/focusIndicator.svg'

interface FocusIndicatorProps {
  setTooltipText: (tooltipText: string) => void
}

export const FocusIndicatorHighlighter = ({ setTooltipText }: FocusIndicatorProps) => {
  const [showFocusIndicator, setFocusIndicator] = useState<boolean>(false)
  const iconClass = showFocusIndicator ? 'svg-active' : 'svg-default'

  const codeToExecute = function(showFocusIndicator: boolean) {
    const preventDefaultClick = (event: any) => {
      event.preventDefault()
    }

    const highlightFocusIndicator = () => {
      const style = document.createElement('style')
      style.innerHTML = `
          :focus {
            outline: 3px solid red; 
            box-shadow: 0 0 0 5px cyan; 
          }
        `
      document.head.appendChild(style)

      const focusableElements = document.querySelectorAll('a, button, input, [tabindex]')
      focusableElements.forEach((element) => {
        element.addEventListener('click', preventDefaultClick)
      })
    }

    const removeIndicators = () => {
      const styles = document.head.querySelectorAll('style')
      for (let style of styles) {
        if (style.innerHTML.includes(':focus {')) {
          document.head.removeChild(style)
        }
      }

      const focusableElements = document.querySelectorAll('a, button, input, [tabindex]')
      focusableElements.forEach((element) => {
        element.removeEventListener('click', preventDefaultClick)
      })
    }

    if (showFocusIndicator) {
      removeIndicators()
    } else {
      highlightFocusIndicator()
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
            args: [showFocusIndicator],
          },
          () => setFocusIndicator(!showFocusIndicator)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Focus Indicator')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={focusIndicatorIcon} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
