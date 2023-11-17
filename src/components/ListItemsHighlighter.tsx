import { CustomButton } from './common/Button'
import listItem from '../assets/listItem.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const ListItemsHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showListItems, setShowListItems, iconClass] = useLocalStorage('ListItemsActive', false)

  const codeToExecute = function(showListItems: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    let span: HTMLElement
    let ariaMarkCount = 0
    let nativeMarkCount = 0
    const roleCounts: { [key: string]: number } = {}

    const removeIndicators = () => {
      const elements = document.querySelectorAll('.a11yToolkit-listItems-indicator')
      elements.forEach((indicator) => {
        const parentElement = indicator.parentElement
        if (parentElement) {
          parentElement.style.outline = ''
          parentElement.style.position = ''
          parentElement.removeChild(indicator)
        }
      })
    }

    const highlightElement = (element: HTMLElement, label: string, color: string) => {
      const existingIndicator = element.querySelector('.a11yToolkit-listItems-indicator')
      if (existingIndicator) {
        return
      }

      let cssSpanBase = `position: relative; padding: 2px; z-index: 999; background: ${color}; color: white;`
      let cssOutlineBase = `outline: 2px solid ${color} !important;`

      if (label === 'LI' || label === 'aLI') {
        // cssSpanBase += ` position: absolute; right: 0; bottom: 0; `
        cssOutlineBase += `outline: 1px solid ${color} !important; `
      }

      element.style.cssText += cssOutlineBase

      span = document.createElement('span')
      span.className = 'a11yToolkit-listItems-indicator'
      span.style.cssText = cssSpanBase
      span.innerText = label

      // const position = (label === 'LI' || label === 'aLI') ? 'beforeend' : 'afterbegin';
      element.insertAdjacentElement('afterbegin', span)
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
      const ariaLists = document.querySelectorAll("[role='list'], [role='listitem']")
      const nativeLists = document.querySelectorAll(
        'ul:not([role="list"]), ul[role]:not([role="list"]), ol:not([role="list"]), ol[role]:not([role="list"]), li:not([role="listitem"]), li[role]:not([role="listitem"])'
      )

      ariaLists.forEach((element: any) => {
        let role = element.getAttribute('role')
        let name = role === 'list' ? 'aL' : 'aLI'
        highlightElement(element, name, colors.aria)
        roleCounts[role] = (roleCounts[role] || 0) + 1
        if (name === 'aL') {
          logElement(element)
        }
        ariaMarkCount++
      })

      nativeLists.forEach((element: any) => {
        highlightElement(element, element.tagName, colors.native)
        if (element.tagName === 'UL' || element.tagName === 'OL') {
          logElement(element)
        }
        roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
        nativeMarkCount++
      })

      logElementCounts()
    }

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
