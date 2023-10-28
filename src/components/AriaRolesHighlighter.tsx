import { useState } from 'react'
import { BsBadgeArFill } from 'react-icons/bs'
import { BsBadgeAr } from 'react-icons/bs'
import { CustomButton } from './common/Button'

export const AriaRolesHighlighter = () => {
  const [showAriaRoles, setShowAriaRoles] = useState(false)

  const codeToExecute = function(showAriaRoles: boolean) {
    const isVisible = (element: Element) => {
      const style = window.getComputedStyle(element)
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.getAttribute('role') !== 'presentation' &&
        element.getAttribute('role') !== 'none'
      )
    }

    const removeIndicators = () => {
      const indicators = document.querySelectorAll('.ariaRoles-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          container.style.outline = ''
          container.style.position = ''
        }
        indicator.remove()
      })
    }

    const highlightValidRoles = (element: HTMLElement, role: string) => {
      const positionStyle = window.getComputedStyle(element).position
      if (element instanceof HTMLElement) {
        if (positionStyle === 'static') {
          element.style.position = 'relative'
        }

        element.style.outline = '2px solid blue'
        const label = document.createElement('span')
        label.innerText = role
        label.className = 'ariaRoles-indicator'
        label.style.position = 'absolute'
        label.style.padding = '2px'
        label.style.top = '0'
        label.style.left = '0'
        label.style.zIndex = '999'
        label.style.background = '#00F'
        label.style.color = 'white'
        element.appendChild(label)
      }
    }

    const highlightInvalidRoles = (element: HTMLElement) => {
      element.style.outline = '2px solid red'
      const positionStyle = window.getComputedStyle(element).position
      if (positionStyle === 'static') {
        element.style.position = 'relative'
      }

      const warningIcon = document.createElement('span')
      warningIcon.className = 'ariaRoles-indicator'
      warningIcon.innerText = ' ⚠️'
      warningIcon.style.padding = '2px'
      warningIcon.style.position = 'absolute'
      warningIcon.style.top = '0'
      warningIcon.style.left = '0'
      warningIcon.style.zIndex = '9999'
      element.appendChild(warningIcon)
    }

    const highlightAriaRoles = () => {
      const validAriaRoles = [
        // Roles de widgets
        'button',
        'checkbox',
        'gridcell',
        'link',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'option',
        'progressbar',
        'radio',
        'scrollbar',
        'searchbox',
        'separator',
        'slider',
        'spinbutton',
        'switch',
        'tab',
        'tabpanel',
        'textbox',
        'treeitem',
        // Composite roles
        'combobox',
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'tablist',
        'tree',
        'treegrid',
        // Document structure functions
        'application',
        'article',
        'cell',
        'columnheader',
        'definition',
        'directory',
        'document',
        'feed',
        'figure',
        'group',
        'heading',
        'img',
        'list',
        'listitem',
        'math',
        'none',
        'note',
        'presentation',
        'row',
        'rowgroup',
        'rowheader',
        'separator',
        'table',
        'term',
        'toolbar',
        'tooltip',
        // Featured roles
        'banner',
        'complementary',
        'contentinfo',
        'form',
        'main',
        'navigation',
        'region',
        'search',
        // Roles de región en vivo
        'alert',
        'log',
        'marquee',
        'status',
        'timer',
        // Window roles
        'alertdialog',
        'dialog',
      ]
      const elements = document.querySelectorAll('[role]')
      const roleCounts: { [key: string]: number } = {}

      elements.forEach((element) => {
        const role = element.getAttribute('role')

        if (role) {
          roleCounts[role] = (roleCounts[role] || 0) + 1

          if (!isVisible(element)) {
            return
          }

          if (validAriaRoles.includes(role)) {
            highlightValidRoles(element as HTMLElement, role)
          }
        }
      })

      console.log(`${elements.length} elements with role attribute were found on this page.`)
      console.log('Count of each role:')
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })

      console.log(' ')
      Object.entries(roleCounts).forEach(([role]) => {
        if (!validAriaRoles.includes(role)) {
          console.error(`Invalid role: ${role}`)

          elements.forEach((element) => {
            if (element.getAttribute('role') === role) {
              console.error(`Element with invalid role '${role}':`, element)

              highlightInvalidRoles(element as HTMLElement)
            }
          })
        }
      })
    }

    if (showAriaRoles) {
      removeIndicators()
    } else {
      highlightAriaRoles()
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
            args: [showAriaRoles],
          },
          () => {
            setShowAriaRoles(!showAriaRoles)
          }
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick}>
      {showAriaRoles ? 
        <BsBadgeArFill className="buttons__icons" />
       : 
        <BsBadgeAr className="buttons__icons" />
      }
    </CustomButton>
  )
}
