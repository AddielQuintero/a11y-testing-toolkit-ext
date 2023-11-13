import { useState } from 'react'
import { CustomButton } from './common/Button'
import CurrentlyFocusedIcon from '../assets/currentlyFocused.svg'

interface CurrentlyFocusedProps {
  setTooltipText: (tooltipText: string) => void
}

export const CurrentlyFocusedHighlighter = ({ setTooltipText }: CurrentlyFocusedProps) => {
  const [showCurrentlyFocused, setCurrentlyFocused] = useState<boolean>(false)
  const iconClass = showCurrentlyFocused ? 'svg-active' : 'svg-default'

  const codeToExecute = function(showCurrentlyFocused: boolean) {
    // const colors = { aria: '#00F', native: 'red' }

    const removeIndicators = () => {}

    const highlightCurrentlyFocused = () => {}

    if (showCurrentlyFocused) {
      removeIndicators()
    } else {
      highlightCurrentlyFocused()
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
            args: [showCurrentlyFocused],
          },
          () => setCurrentlyFocused(!showCurrentlyFocused)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Print currently focused element in console')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={CurrentlyFocusedIcon} className="svg-icon" alt="Focus Indicator Icon" />
    </CustomButton>
  )
}
