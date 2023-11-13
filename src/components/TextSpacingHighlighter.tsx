import { useState } from 'react'
import { CustomButton } from './common/Button'
import TextSpacingIcon from '../assets/textSpacing.svg'

interface TextSpacingProps {
  setTooltipText: (tooltipText: string) => void
}

export const TextSpacingHighlighter = ({ setTooltipText }: TextSpacingProps) => {
  const [showTextSpacing, setTextSpacing] = useState<boolean>(false)
  const iconClass = showTextSpacing ? 'svg-active' : 'svg-default'

  const codeToExecute = function(showTextSpacing: boolean) {
    // const colors = { aria: '#00F', native: 'red' }

    const removeIndicators = () => {}

    const highlightTextSpacing = () => {}
    if (showTextSpacing) {
      removeIndicators()
    } else {
      highlightTextSpacing()
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
            args: [showTextSpacing],
          },
          () => setTextSpacing(!showTextSpacing)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Text Spacing')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={TextSpacingIcon} className="svg-icon" alt="Text Spacing Icon" />
    </CustomButton>
  )
}
