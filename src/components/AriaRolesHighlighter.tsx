import ariaRoles from '../assets/ariaRoles.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const AriaRolesHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showAriaRoles, setShowAriaRoles, iconClass] = useLocalStorage('AriaRolesActive', false)

  const codeToExecute = function(showAriaRoles: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    let cssSpanBase = `position: relative; padding: 2px; z-index: 999; background: ${colors.aria}; color: white;`
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
      const highlightedElements = document.querySelectorAll('.a11yToolkit-highlighted')
      highlightedElements.forEach((element: any) => {
        element.style.outline = ''
        element.classList.remove('a11yToolkit-highlighted')

        const role = element.getAttribute('role')
        const span = element.tagName === 'IMG' || (role === 'img' && element.previousSibling)
        const container = element.querySelector('.a11yToolkit-ariaRoles-indicator')

        if (span && span.classList.contains('a11yToolkit-ariaRoles-indicator')) {
          span.remove()
        }
        if (container) {
          container.remove()
        }
      })
    }

    const highlightValidRoles = (element: any, role: string) => {
      if (element.classList.contains('a11yToolkit-highlighted')) {
        return
      }
      element.classList.add('a11yToolkit-highlighted')
      element.style.cssText += `outline: 2px solid ${colors.aria} !important;`

      const span = document.createElement('span')
      span.className = 'a11yToolkit-ariaRoles-indicator'
      span.style.cssText = cssSpanBase
      span.innerText = role

      const position = element.tagName === 'IMG' || role === 'img' ? 'beforebegin' : 'afterbegin'
      element.insertAdjacentElement(position, span)
    }

    const highlightInvalidRoles = (element: any) => {
      if (element.classList.contains('a11yToolkit-highlighted')) {
        return
      }
      element.classList.add('a11yToolkit-highlighted')
      element.style.cssText += `outline: 2px solid ${colors.native} !important;`

      const warningIcon = document.createElement('span')
      warningIcon.className = 'a11yToolkit-ariaRoles-indicator'
      warningIcon.style.cssText = cssSpanBase + `background: ${colors.native};`
      warningIcon.innerText = ' ⚠️'

      const role = element.getAttribute('role')
      const position = element.tagName === 'IMG' || role === 'img' ? 'beforebegin' : 'afterbegin'
      element.insertAdjacentElement(position, warningIcon)
    }

    const highlightAriaRoles = () => {
      elements.forEach((element: any) => {
        const role = element.getAttribute('role')

        if (role) {
          roleCounts[role] = (roleCounts[role] || 0) + 1

          if (!isVisible(element)) {
            return
          }

          if (validAriaRoles.includes(role)) {
            highlightValidRoles(element, role)
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

              highlightInvalidRoles(element)
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
    <CustomButton
      onMouseEnter={() => setTooltipText('Aria Roles')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={ariaRoles} className="svg-icon" alt="Focus Indicator Icon" />
    </CustomButton>
  )
}
