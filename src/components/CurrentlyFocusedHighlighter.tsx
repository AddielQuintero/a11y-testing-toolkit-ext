import { CustomButton } from './common/Button'
import CurrentlyFocusedIcon from '../assets/currentlyFocused.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

declare global {
  interface Window {
    myExtensionKeyDownHandler?: (event: KeyboardEvent) => void
    myExtensionPreventDefaultClick?: (event: Event) => void
  }
}

export const CurrentlyFocusedHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showCurrentlyFocused, setCurrentlyFocused, iconClass] = useLocalStorage(
    'CurrentlyFocusedActive',
    false
  )

  const codeToExecute = function(showCurrentlyFocused: boolean) {
    const focusableElements = document.querySelectorAll('a, button, input, [tabindex]')

    if (!window.myExtensionKeyDownHandler) {
      window.myExtensionKeyDownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Control' || event.key === 'Ctrl') {
          console.clear()
          console.log('Current Focused Element:')
          console.log(document.activeElement)
        }
      }
    }

    if (!window.myExtensionPreventDefaultClick) {
      window.myExtensionPreventDefaultClick = (event: any) => {
        event.preventDefault()
      }
    }

    const removeIndicators = () => {
      if (window.myExtensionKeyDownHandler) {
        document.body.removeEventListener('keydown', window.myExtensionKeyDownHandler)
      }

      focusableElements.forEach((element) => {
        if (window.myExtensionPreventDefaultClick) {
          element.removeEventListener('click', window.myExtensionPreventDefaultClick)
        }
      })
    }

    const highlightCurrentlyFocused = () => {
      if (window.myExtensionKeyDownHandler) {
        document.body.addEventListener('keydown', window.myExtensionKeyDownHandler)
      }

      focusableElements.forEach((element) => {
        if (window.myExtensionPreventDefaultClick) {
          element.addEventListener('click', window.myExtensionPreventDefaultClick)
        }
      })
    }

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
