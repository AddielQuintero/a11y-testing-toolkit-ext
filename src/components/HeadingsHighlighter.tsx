// import { useState } from 'react'
import { CustomButton } from './common/Button'
import headingIcon from '../assets/headingsIcon.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const HeadingsHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showHeadings, setShowHeadings, iconClass] = useLocalStorage('HeadingsActive', false)

  const codeToExecute = function(showListItems: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    const pageHeadings = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
    const ariaHeadings = document.querySelectorAll("[role='heading']")

    const ensureUniqueIndicator = (element: HTMLElement, label: string) => {
      return !Array.from(element.getElementsByClassName('a11yToolkit-headings-indicator')).some(
        (indicator) => indicator.textContent === label
      )
    }

    const removeIndicators = () => {
      const indicators = document.querySelectorAll('.a11yToolkit-headings-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          container.style.outline = ''
        }
        indicator.remove()
      })
    }

    const highlightElement = (element: HTMLElement, label: string, color: string) => {
      if (ensureUniqueIndicator(element, label)) {
        const span = document.createElement('span')
        span.className = 'a11yToolkit-headings-indicator'
        span.style.position = 'relative'
        span.style.padding = '2px'
        span.style.zIndex = '999'
        span.style.background = color
        span.style.color = 'white'
        // span.style.fontSize = '11px'
        span.innerText = label

        element.insertAdjacentElement('afterbegin', span)
      }
    }

    const highlightHeadings = () => {
      ariaHeadings.forEach((element: any) => {
        const ariaLevel = element.getAttribute('aria-level')
        highlightElement(element, 'aH' + ariaLevel, colors.aria)
        element.style.cssText += `outline: 2px solid ${colors.aria} !important;`
      })

      pageHeadings.forEach((element: any) => {
        const hasAria = element.hasAttribute('role') && element.getAttribute('role') === 'heading'
        highlightElement(element, element.tagName, colors.native)
        if (!hasAria) {
          element.style.cssText += `outline: 2px solid ${colors.native} !important;`
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
