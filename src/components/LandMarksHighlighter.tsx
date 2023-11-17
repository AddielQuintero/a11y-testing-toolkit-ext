import landMarks from '../assets/landMarks.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const LandMarksHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showLandMarks, setShowLandMarks, iconClass] = useLocalStorage('LandMarksActive', false)

  const codeToExecute = function(showLandMarks: boolean) {
    const landmarksNative = [
      { selector: 'header', ariaEquivalent: 'banner' },
      { selector: 'nav', ariaEquivalent: 'navigation' },
      { selector: 'main', ariaEquivalent: 'main' },
      { selector: 'footer', ariaEquivalent: 'contentinfo' },
    ]

    const landmarkRoles = [
      'banner', // Usually the site header container.
      'navigation', // For navigation areas.
      'main', // Main content of the page.
      'contentinfo', // Information about the main content (for example, the footer).
    ]

    const colors = { aria: '#00F', native: 'red' }

    let ariaLandmarkCount = 0
    let nativeLandmarkCount = 0
    let highlightedElements = new Set()

    const removeIndicators = () => {
      const highlightedElements = document.querySelectorAll('.a11yToolkit-highlighted')
      highlightedElements.forEach((element: any) => {
        element.style.outline = ''
        element.classList.remove('a11yToolkit-highlighted')

        const span = element.previousSibling
        if (span && span.classList.contains('a11yToolkit-landMarks-indicator')) {
          span.remove()
        }
      })
    }

    const highlightElement = (element: any, label: string, color: string) => {
      const highlightedElement = element.classList.contains('a11yToolkit-highlighted')
      if (!highlightedElement) {
        element.classList.add('a11yToolkit-highlighted')
        element.style.cssText += `outline: 2px solid ${color} !important;`

        const span = document.createElement('span')
        span.className = 'a11yToolkit-landMarks-indicator'
        span.innerText = label
        span.style.position = 'relative'
        span.style.height = 'max-content'
        span.style.padding = '2px'
        span.style.zIndex = '999'
        span.style.background = color
        span.style.color = 'white'

        element.insertAdjacentElement('beforebegin', span)
      }
    }

    const ariaLandMarks = () => {
      console.log('ARIA Landmark Roles in use:')
      landmarkRoles.forEach((role) => {
        const elements = document.querySelectorAll(`[role="${role}"]`)
        const formattedRole = 'a' + role.charAt(0).toUpperCase() + role.slice(1)
        elements.forEach((element: any) => {
          highlightElement(element, formattedRole, colors.aria) // store the label element
          highlightedElements.add(element)
          ariaLandmarkCount++
        })
        if (elements.length !== 0) {
          console.log(`${formattedRole}: ${elements.length} occurrences`)
        }
      })

      if (ariaLandmarkCount === 0) {
        console.log('No ARIA landmarks used in page')
      }
    }

    const nativeLandMarks = () => {
      console.log(' ')
      console.log('NATIVE Landmark Roles in use:')
      landmarksNative.forEach((item) => {
        const elements = document.querySelectorAll(item.selector)
        elements.forEach((element: any) => {
          if (element.hasAttribute('role')) {
            highlightedElements.add(element)
          } else if (!highlightedElements.has(element)) {
            highlightElement(element, item.selector, colors.native)
          }
          nativeLandmarkCount++
        })

        if (elements.length !== 0) {
          console.log(`${item.selector}: ${elements.length} occurrences`)
        }
      })

      if (nativeLandmarkCount === 0) {
        console.log('No NATIVE landmarks used in page')
      }

      // Check and display messages
      if (ariaLandmarkCount === 0 && nativeLandmarkCount === 0) {
        console.log('No landmarks used in page')
      }
    }

    if (showLandMarks) {
      removeIndicators()
    } else {
      ariaLandMarks()
      nativeLandMarks()
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
            args: [showLandMarks],
          },
          () => setShowLandMarks(!showLandMarks)
        )
      }
    })
  }
  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Land Marks')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={landMarks} className="svg-icon" alt="Focus Indicator Icon" />
    </CustomButton>
  )
}
