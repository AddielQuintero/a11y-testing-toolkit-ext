import { useState } from 'react'
import { CustomButton } from './common/Button'
import { BsSearch } from 'react-icons/bs'

declare global {
  interface Window {
    handleMouseOver?: (event: MouseEvent) => void
    showTooltip?: boolean
  }
}

window.showTooltip = false

export const TargetSize = () => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const iconClass = isActive ? 'icon-active' : 'icon-default'

  const codeToExecute = (isActive: boolean) => {
    let currentElement: HTMLElement | null = null
    let tooltip: HTMLElement
    let widthValue: number = 0
    let heightValue: number = 0

    if (!document.querySelector('.a11y-toolkit-size-tooltip')) {
      tooltip = document.createElement('figure')
      tooltip.style.display = 'flex'
      tooltip.style.flexDirection = 'column'
      tooltip.style.position = 'absolute'
      tooltip.style.borderRadius = '8px'
      tooltip.style.background = 'hsla(0, 0%, 10%, 0.8)'
      tooltip.style.fontSize = '14px'
      tooltip.style.fontWeight = 'bold'
      tooltip.style.backdropFilter = 'blur(5px)'
      tooltip.style.boxShadow = ' rgba(0, 0, 0, 0.35) 0px 5px 15px'
      tooltip.style.transition = 'top 0.2s, left 0.2s'
      tooltip.style.fontFamily = ' monospace'
      tooltip.style.zIndex = '9999'
      tooltip.className = 'a11y-toolkit-size-tooltip'

      document.body.appendChild(tooltip)
    } else {
      tooltip = document.querySelector('.a11y-toolkit-size-tooltip') as HTMLElement
    }

    const isSmall = (width: number, height: number) => {
      return width < 24 || height < 24
    }

    const printElement = (event: KeyboardEvent) => {
      if (!window.showTooltip) return
      if (event.key === 'Control' || event.key === 'Ctrl') {
        if (isSmall(widthValue, heightValue)) {
          console.log(currentElement)
        }
      }
    }

    window.handleMouseOver = (event: MouseEvent) => {
      if (!window.showTooltip) return
      const element = event.target as HTMLElement
      if (element !== currentElement) {
        const computedStyle = window.getComputedStyle(element)
        let width = element.style.width || computedStyle.width
        let height = element.style.height || computedStyle.height

        if (width === 'auto') {
          width = `${element.offsetWidth}px`
        }

        if (height === 'auto') {
          height = `${element.offsetHeight}px`
        }

        widthValue = parseFloat(width)
        heightValue = parseFloat(height)

        let elementName = element.tagName.toLowerCase()
        let idOrClass = element.id
          ? `#${element.id}`
          : element.className
          ? `.${element.className.split(' ')[0]}`
          : ''
        const tooltipWidth = tooltip.offsetWidth
        const tooltipHeight = tooltip.offsetHeight

        let tooltipLeft = event.clientX
        let tooltipTop = event.clientY

        if (tooltipLeft + tooltipWidth * 1.5 > window.innerWidth || event.clientX > window.innerWidth / 2) {
          tooltipLeft = event.clientX - tooltipWidth * 1.5
        }

        if (event.clientY < window.innerHeight / 2) {
          tooltipTop = event.clientY + 20
        } else {
          tooltipTop = event.clientY - tooltipHeight - 20
        }
        tooltip.style.top = `${tooltipTop}px`
        tooltip.style.left = `${tooltipLeft}px`

        element.style.outline = '2px dotted black'
        element.style.boxShadow = '0 0 5px 5px white'

        let codeBackgroundColor = 'hsla(0, 0%, 10%, 0.9)'
        let codeColor = 'hotpink'

        if (isSmall(widthValue, heightValue)) {
          codeBackgroundColor = '#990000'
          codeColor = 'white'
          element.style.background = '#990000'
          element.style.backgroundColor = '#990000'
        }

        tooltip.innerHTML = `
          <header style="padding: 10px;">
            <strong style="color: white;">&lt${elementName}&gt${idOrClass}</strong>
          </header>
          <code style="background: ${codeBackgroundColor}; padding: 10px; border-radius: 8px; display: grid; grid-template-columns: max-content auto; gap: 0.25em 0.5em;">
            <span style="color: ${codeColor};">Width:</span><span style="color: white;"> ${width}</span>
            <span style="color: ${codeColor};">Height:</span><span style="color: white;">  ${height}</span>
          </code>`

        currentElement = element
      }
    }

    document.body.addEventListener('mouseover', window.handleMouseOver)

    document.body.addEventListener('keydown', printElement)

    document.body.addEventListener('mouseout', () => {
      if (currentElement) {
        currentElement.style.outline = ''
        currentElement.style.boxShadow = ''
        currentElement.style.background = ''
        currentElement.style.backgroundColor = ''
      }
    })

    if (isActive) {
      window.showTooltip = false
      const indicators = document.querySelectorAll('.a11y-toolkit-size-tooltip')
      indicators.forEach((indicator) => indicator.remove())
    } else {
      window.showTooltip = true
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
            args: [isActive],
          },
          () => setIsActive(!isActive)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick}>
      <BsSearch className={iconClass} />
    </CustomButton>
  )
}
