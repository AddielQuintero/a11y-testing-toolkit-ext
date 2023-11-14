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

    const addImportantStyle = (element: Element, property: string, value: string) => {
      let styleSheet = document.getElementById('importantStyles') as HTMLStyleElement | null
      if (!styleSheet) {
        styleSheet = document.createElement('style')
        styleSheet.id = 'importantStyles'
        document.head.appendChild(styleSheet)
      }

      if (!element.id) {
        element.id =
          'a11yToolkit-' +
          Math.random()
            .toString(36)
            .substr(2, 9)
      }

      if (styleSheet.sheet) {
        styleSheet.sheet.insertRule(
          `#${element.id} { ${property}: ${value} !important; }`,
          styleSheet.sheet.cssRules.length
        )
      }
    }

    const removeIndicators = () => {
      const styleSheet = document.getElementById('importantStyles')
      if (styleSheet) {
        styleSheet.remove()
      }

      const containers = document.querySelectorAll('.a11yToolkit-image-alt-text-container')
      containers.forEach((container) => {
        Array.from(container.querySelectorAll('img, [role="img"]')).forEach((element) => {
          container.before(element)
        })

        container.remove()
      })
    }

    const highlightElement = (element: Element, label: string, color: string) => {
      let container = element.closest('.a11yToolkit-image-alt-text-container') as HTMLElement
      if (!container) {
        container = document.createElement('div')
        container.classList.add('a11yToolkit-image-alt-text-container')
        element.before(container)
        container.appendChild(element)

        addImportantStyle(element, 'outline', `2px solid ${color}`)

        const span = document.createElement('span')
        span.className = 'a11yToolkit-imageAltText-indicator'
        span.style.position = 'relative'
        span.style.padding = '2px'
        span.style.zIndex = '999'
        span.style.background = color
        span.style.color = 'white'
        span.style.fontSize = '11px'
        span.innerText = label

        container.insertAdjacentElement('afterbegin', span)
      }
    }

    const logElementCounts = () => {
      console.log(`${elements.length} elements IMG and RoleIMG were found on this page.`)
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const highlightImageAltText = () => {
      elements.forEach((element) => {
        if (element) {
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
