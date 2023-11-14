// import { useState, useEffect } from 'react'
import { CustomButton } from './common/Button'
import focusIndicatorIcon from '../assets/focusIndicator.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const FocusIndicatorHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showFocusIndicator, setFocusIndicator, iconClass] = useLocalStorage('FocusIndicatorActive', false)

  const codeToExecute = function(showFocusIndicator: boolean) {
    const styleElementId = 'a11yToolkit-focus-indicator-style'

    const removeIndicators = () => {
      const existingStyleElement = document.getElementById(styleElementId)
      if (existingStyleElement) {
        document.head.removeChild(existingStyleElement)
      }
    }

    const highlightFocusIndicator = () => {
      const styleElement = document.createElement('style')
      styleElement.id = styleElementId
      styleElement.innerHTML = ` a:focus, *:focus {
                                box-shadow: rgb(0 255 255) 0px 0px 0px 8px !important;
                                outline: rgb(255, 0, 0) solid 4px !important;
                                outline-offset: 1px !important;
                                border-radius: 2px;
                            }`

      document.head.appendChild(styleElement)
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
