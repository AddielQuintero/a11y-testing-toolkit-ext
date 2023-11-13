import { useState } from 'react'
import { CustomButton } from './common/Button'
import headingIcon from '../assets/headingsIcon.svg'

interface HeadingsProps {
  setTooltipText: (tooltipText: string) => void
}

export const HeadingsHighlighter = ({ setTooltipText }: HeadingsProps) => {
  const [showHeadings, setShowHeadings] = useState<boolean>(false)
  const iconClass = showHeadings ? 'svg-active' : 'svg-default'

  const codeToExecute = function(showListItems: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    const pageHeadings = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
    const ariaHeadings = document.querySelectorAll("[role='heading']")

    const addImportantStyle = (element: Element, property: string, value: string) => {
      let styleSheet = document.getElementById('importantStyles') as HTMLStyleElement | null
      if (!styleSheet) {
        styleSheet = document.createElement('style')
        styleSheet.id = 'importantStyles'
        document.head.appendChild(styleSheet)
      }

      if (!element.id) {
        element.id = 'a11yToolkit-' + Math.random().toString(36).substr(2, 9)
      }

      if (styleSheet.sheet) {
        styleSheet.sheet.insertRule(
          `#${element.id} { ${property}: ${value} !important;}`,
          styleSheet.sheet.cssRules.length
        )
      }
    }

    const removeIndicators = () => {
      const styleSheet = document.getElementById('importantStyles')
      if (styleSheet) {
        styleSheet.remove()
      }

      const indicators = document.querySelectorAll('.a11yToolkit-headings-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          container.style.outline = ''
          container.style.position = ''
        }
        indicator.remove()
      })
    }

    const ensureUniqueIndicator = (element: HTMLElement, label: string) => {
      return !Array.from(element.getElementsByClassName('a11yToolkit-headings-indicator')).some(
        (indicator) => indicator.textContent === label
      )
    }

    const highlightElement = (element: HTMLElement, label: string, color: string) => {
      if (ensureUniqueIndicator(element, label)) {
        const positionStyle = window.getComputedStyle(element).position
        if (positionStyle === 'static') {
          element.style.position = 'relative'
        }

        const existingIndicators = element.getElementsByClassName('a11yToolkit-headings-indicator')

        const span = document.createElement('span')
        span.className = 'a11yToolkit-headings-indicator'
        span.style.position = 'absolute'
        span.style.top = '0'
        span.style.left = `${existingIndicators.length * 24}px`
        span.style.padding = '2px'
        span.style.zIndex = '999'
        span.style.background = color
        span.style.color = 'white'
        span.style.fontSize = '11px'
        span.innerText = label

        element.insertAdjacentElement('afterbegin', span)
      }
    }

    const highlightHeadings = () => {
      ariaHeadings.forEach((element) => {
        const ariaLevel = element.getAttribute('aria-level')
        if (element instanceof HTMLElement && ariaLevel) {
          highlightElement(element, 'aH' + ariaLevel, colors.aria)
          // element.style.outline = `2px solid ${colors.aria}`
          addImportantStyle(element, 'outline', `2px solid ${colors.aria}`)
        }
      })

      pageHeadings.forEach((element) => {
        if (element instanceof HTMLElement) {
          const hasAria = element.hasAttribute('role') && element.getAttribute('role') === 'heading'
          highlightElement(element, element.tagName, colors.native)
          if (!hasAria) {
            // element.style.outline = `2px solid ${colors.native}`
            addImportantStyle(element, 'outline', `2px solid ${colors.native}`)
          }
        }
      })
    }

    if (showListItems) {
      removeIndicators()
    } else {
      highlightHeadings()
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
            args: [showHeadings],
          },
          () => setShowHeadings(!showHeadings)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Headings')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={headingIcon} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
