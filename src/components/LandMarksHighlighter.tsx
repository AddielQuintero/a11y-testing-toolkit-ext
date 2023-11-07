import { useState } from 'react'
import { BsMapFill } from 'react-icons/bs'
import { BsMap } from 'react-icons/bs'
import { CustomButton } from './common/Button'

interface LandMarksProps {
  setTooltipText: (tooltipText: string) => void
}

export const LandMarksHighlighter = ({ setTooltipText }: LandMarksProps) => {
  const [showLandMarks, setShowLandMarks] = useState(false)

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
      const indicators = document.querySelectorAll('.LandMarks-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          container.style.outline = ''
          container.style.position = ''
          container.style.border = ''
        }
        indicator.remove()
      })
    }

    const highlightElement = (element: HTMLElement, label: string, color: string) => {
      element.style.outline = `2px solid ${color === '#00F' ? color : 'none'}`
      element.style.border = `2px solid ${color === 'red' ? color : 'none'}`

      const positionStyle = window.getComputedStyle(element).position

      if (positionStyle === 'static') {
        element.style.position = 'relative'
      }

      const labelElement = document.createElement('span')
      labelElement.className = 'LandMarks-indicator'
      labelElement.innerText = label
      labelElement.style.position = 'absolute'
      labelElement.style.padding = '2px'
      labelElement.style.top = '0'
      labelElement.style.left = '0'
      labelElement.style.zIndex = '999'
      labelElement.style.background = color
      labelElement.style.color = 'white'

      element.prepend(labelElement)
      return labelElement
    }

    const ariaLandMarks = () => {
      console.log('ARIA Landmark Roles in use:')
      landmarkRoles.forEach((role) => {
        const elements = document.querySelectorAll(`[role="${role}"]`)
        const formattedRole = 'a' + role.charAt(0).toUpperCase() + role.slice(1)
        elements.forEach((element) => {
          highlightElement(element as HTMLElement, formattedRole, colors.aria) // store the label element
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
        elements.forEach((element) => {
          if (element.hasAttribute('role')) {
            highlightedElements.add(element)
          } else if (!highlightedElements.has(element)) {
            highlightElement(element as HTMLElement, item.selector, colors.native)
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
    >
      {showLandMarks ? <BsMapFill className="buttons__icons" /> : <BsMap className="buttons__icons" />}
    </CustomButton>
  )
}
