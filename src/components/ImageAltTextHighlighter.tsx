import { CustomButton } from './common/Button'
import imageAltText from '../assets/imageAltText.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const ImageAltTextHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showImageAltText, setShowImageAltText, iconClass] = useLocalStorage('ImageAltTextActive', false)

  const codeToExecute = function(showImageAltText: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    const elements = document.querySelectorAll("img, [role='img']")
    const roleCounts: { [key: string]: number } = {}

    const removeIndicators = () => {
      const highlightedElements = document.querySelectorAll('.a11yToolkit-highlighted')
      highlightedElements.forEach((element: any) => {
        element.style.outline = ''
        element.classList.remove('a11yToolkit-highlighted')

        const span = element.previousSibling
        if (span && span.classList.contains('a11yToolkit-imageAltText-indicator')) {
          span.remove()
        }
      })
    }

    const highlightElement = (element: any, label: string, color: string) => {
      if (element.classList.contains('a11yToolkit-highlighted')) {
        return
      }

      element.classList.add('a11yToolkit-highlighted')
      element.style.cssText += `outline: 2px solid ${color} !important;`

      const span = document.createElement('span')
      span.className = 'a11yToolkit-imageAltText-indicator'
      span.style.position = 'relative'
      span.style.padding = '2px'
      span.style.zIndex = '999'
      span.style.background = color
      span.style.color = 'white'
      // span.style.fontSize = '11px'
      span.innerText = label

      element.insertAdjacentElement('beforebegin', span)
    }

    const logElementCounts = () => {
      console.log(`${elements.length} elements IMG and RoleIMG were found on this page.`)
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const highlightImageAltText = () => {
      elements.forEach((element) => {
        const alt = element.getAttribute('alt') || 'No alt text'
        const ariaRole = element.getAttribute('role')
        const ariaLabel = element.getAttribute('aria-label') || 'No alt text'
        if (ariaRole === 'img') {
          highlightElement(element, ariaLabel, colors.aria)
          roleCounts['RoleIMG'] = (roleCounts['RoleIMG'] || 0) + 1
        }
        highlightElement(element, alt, colors.native)
        if (element.tagName !== 'DIV') {
          roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
        }
      })

      logElementCounts()
    }

    if (showImageAltText) {
      removeIndicators()
    } else {
      highlightImageAltText()
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
            args: [showImageAltText],
          },
          () => setShowImageAltText(!showImageAltText)
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Image alt text')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={imageAltText} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
