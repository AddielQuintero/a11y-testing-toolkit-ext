import autoComplete from '../assets/autoComplete.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import { TooltipProps } from '../types/Tooltip'

export const AutocompleteHighlighter = ({ setTooltipText }: TooltipProps) => {
  const [showAutoCompletes, setShowAutoCompletes, iconClass] = useLocalStorage('AutocompleteActive', false)

  const codeToExecute = function(showAutoCompletes: boolean) {
    const validAutocompleteValues: string[] = [
      'name',
      'honorific-prefix',
      'given-name',
      'additional-name',
      'family-name',
      'honorific-suffix',
      'nickname',
      'username',
      'new-password',
      'current-password',
      'one-time-code',
      'organization-title',
      'organization',
      'street-address',
      'address-line1',
      'address-line2',
      'address-line3',
      'address-level4',
      'address-level3',
      'address-level2',
      'address-level1',
      'country',
      'country-name',
      'postal-code',
      'cc-name',
      'cc-given-name',
      'cc-additional-name',
      'cc-family-name',
      'cc-number',
      'cc-exp',
      'cc-exp-month',
      'cc-exp-year',
      'cc-csc',
      'cc-type',
      'transaction-currency',
      'transaction-amount',
      'language',
      'bday',
      'bday-day',
      'bday-month',
      'bday-year',
      'sex',
      'url',
      'photo',
      'tel',
      'tel-country-code',
      'tel-national',
      'tel-area-code',
      'tel-local',
      'tel-local-prefix',
      'tel-local-suffix',
      'tel-extension',
      'email',
      'impp',
    ]

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

      const containers = document.querySelectorAll('.a11yToolkit-autocomplete-container')
      containers.forEach((container) => {
        const element = container.querySelector('input')
        if (element) {
          container.before(element)
          element.style.outline = ''
        }
        container.remove()
      })
    }

    const isVisible = (element: HTMLElement) => {
      const isAriaHidden = (element: HTMLElement) => element.getAttribute('aria-hidden') === 'true'
      const isDisplayNone = (style: CSSStyleDeclaration) => style.display === 'none'
      const isVisibilityHidden = (style: CSSStyleDeclaration) => style.visibility === 'hidden'
      const hasZeroSize = (element: HTMLElement) => element.offsetWidth === 0 || element.offsetHeight === 0
      const style = window.getComputedStyle(element)
      return !(
        isAriaHidden(element) ||
        isDisplayNone(style) ||
        isVisibilityHidden(style) ||
        hasZeroSize(element)
      )
    }
    const autocompleteCounts: Record<string, number> = {}
    const inputs = document.querySelectorAll('input')
    const visibleInputs = [...inputs].filter(isVisible)

    const processAutocompleteValues = (
      input: HTMLInputElement,
      autocompleteCounts: Record<string, number>
    ) => {
      const autocompleteValue = input.getAttribute('autocomplete')
      if (autocompleteValue !== null) {
        autocompleteCounts[autocompleteValue] = (autocompleteCounts[autocompleteValue] || 0) + 1
      }
    }

    const highlightAutocomplete = (input: HTMLInputElement) => {
      let container = input.closest('.a11yToolkit-autocomplete-container') as HTMLElement
      if (!container) {
        const autocompleteValue = input.getAttribute('autocomplete')

        container = document.createElement('div')
        container.classList.add('a11yToolkit-autocomplete-container')
        container.style.position = 'relative'
        container.style.display = 'inline-block'
        if (input.parentNode) {
          input.parentNode.insertBefore(container, input)
        }
        container.appendChild(input)

        // input.style.outline = '2px solid red'
        addImportantStyle(input, 'outline', `2px solid red`)

        const span = document.createElement('span')
        span.className = 'a11yToolkit-autocomplete-indicator'
        span.style.position = 'absolute'
        span.style.padding = '2px'
        span.style.top = '0'
        span.style.left = '0'
        span.style.zIndex = '999'
        span.style.background = 'red'
        span.style.color = 'white'
        span.style.fontSize = '11px'

        if (!autocompleteValue) {
          span.innerText = 'No'
          console.error(`Input without autocomplete '${autocompleteValue}':`, input)
        } else if (!validAutocompleteValues.includes(autocompleteValue)) {
          span.innerText = '⚠️'
          console.error(`Input with invalid autocomplete '${autocompleteValue}':`, input)
        } else {
          span.innerText = autocompleteValue
        }

        container.appendChild(span)
      }
    }

    const annotateAndAttach = () => {
      visibleInputs.forEach((input) => processAutocompleteValues(input, autocompleteCounts))

      console.log(`${visibleInputs.length} elements with autocomplete attribute were found on this page.`)
      console.log('Count of each autocomplete:')
      Object.entries(autocompleteCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })

      visibleInputs.forEach((input) => highlightAutocomplete(input))
    }

    if (showAutoCompletes) {
      removeIndicators()
    } else {
      annotateAndAttach()
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
            args: [showAutoCompletes],
          },
          () => {
            setShowAutoCompletes(!showAutoCompletes)
          }
        )
      }
    })
  }

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Autocomplete')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={autoComplete} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
