import { useState } from 'react'
import { CustomButton } from './common/Button'
import listItem from '../assets/listItem.svg'

interface ListItemsProps {
  setTooltipText: (tooltipText: string) => void
}

export const ListItemsHighlighter = ({ setTooltipText }: ListItemsProps) => {
  const [showListItems, setShowListItems] = useState<boolean>(false)

  const iconClass = showListItems ? 'svg-active' : 'svg-default'

  const codeToExecute = function(showListItems: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    let span: HTMLElement
    let ariaMarkCount = 0
    let nativeMarkCount = 0
    const roleCounts: { [key: string]: number } = {}

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

      const indicators = document.querySelectorAll('.a11yToolkit-listItems-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          container.style.outline = ''
          container.style.position = ''
        }
        indicator.remove()
      })
    }

    const highlightElement = (element: HTMLElement, label: string, color: string) => {
      const existingIndicator = element.querySelector('.a11yToolkit-listItems-indicator')
      if (existingIndicator) {
        return
      }

      let value = `${label === 'LI' || label === 'aLI' ? '1px' : '2px'} solid ${color}`

      addImportantStyle(element, 'outline', value)

      const positionStyle = window.getComputedStyle(element).position
      if (positionStyle === 'static') {
        element.style.position = 'relative'
      }

      span = document.createElement('span')
      span.className = 'a11yToolkit-listItems-indicator'
      span.style.position = 'relative'
      span.style.padding = '2px'
      span.style.zIndex = '999'
      span.style.background = color
      span.style.color = 'white'
      span.style.fontSize = '11px'
      span.innerText = label

      if (label === 'LI' || label === 'aLI') {
        element.insertAdjacentElement('beforeend', span)
      } else {
        element.insertAdjacentElement('afterbegin', span)
      }
    }

    const logElement = (element: HTMLElement) => {
      console.log(element)
    }

    const logElementCounts = () => {
      const elements = ariaMarkCount + nativeMarkCount
      console.log(`${elements} elements with role attribute were found on this page.`)
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const highlightListItems = () => {
      const ariaLists = document.querySelectorAll("[role='list']")
      const ariaListItems = document.querySelectorAll("[role='listitem']")

      ariaLists.forEach((element) => {
        const role = element.getAttribute('role')
        if (element instanceof HTMLElement && role) {
          highlightElement(element, 'aL', colors.aria)
          roleCounts[role] = (roleCounts[role] || 0) + 1
          logElement(element)
        }
        ariaMarkCount++
      })

      ariaListItems.forEach((element) => {
        const role = element.getAttribute('role')
        if (element instanceof HTMLElement && role) {
          highlightElement(element, 'aLI', colors.aria)
          roleCounts[role] = (roleCounts[role] || 0) + 1
        }
        ariaMarkCount++
      })

      const pageLists = document.querySelectorAll('ul:not([role]), ol:not([role])')
      const pageListItems = document.querySelectorAll('li:not([role])')

      pageLists.forEach((element) => {
        if (element instanceof HTMLElement) {
          highlightElement(element, element.tagName, colors.native)
          logElement(element)
          roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
        }
        nativeMarkCount++
      })

      pageListItems.forEach((element) => {
        if (element instanceof HTMLElement) {
          highlightElement(element, element.tagName, colors.native)
          roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
        }
        nativeMarkCount++
      })

      logElementCounts()
    }

    // const highlightListItems = () => {
    //   const pageLists = document.querySelectorAll('ul,ol')
    //   const pageListItems = document.querySelectorAll('li')
    //   const ariaLists = document.querySelectorAll("[role='list']")
    //   const ariaListItems = document.querySelectorAll("[role='listitem']")

    //   ariaLists.forEach((element) => {
    //     if (element instanceof HTMLElement) {
    //       const role = element.getAttribute('role')
    //       if (role) {
    //         highlightElement(element, role, colors.aria)
    //       }
    //     }
    //   })

    //   ariaListItems.forEach((element) => {
    //     if (element instanceof HTMLElement) {
    //       const role = element.getAttribute('role')
    //       if (role) {
    //         highlightElement(element, role, colors.aria)
    //       }
    //     }
    //   })

    //   pageLists.forEach((element) => {
    //     if (element instanceof HTMLElement) {
    //       highlightElement(element, element.tagName, colors.native)
    //     }
    //   })

    //   pageListItems.forEach((element) => {
    //     if (element instanceof HTMLElement) {
    //       highlightElement(element, element.tagName, colors.native)
    //     }
    //   })
    // }

    if (showListItems) {
      removeIndicators()
    } else {
      highlightListItems()
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
            args: [showListItems],
          },
          () => setShowListItems(!showListItems)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('List Items')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={listItem} className="svg-icon" alt="listItem Icon" />
    </CustomButton>
  )
}
