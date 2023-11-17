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

    const removeIndicators = () => {
      const highlightedElements = document.querySelectorAll('.a11yToolkit-highlighted')
      highlightedElements.forEach((element: any) => {
        element.style.outline = ''
        element.classList.remove('a11yToolkit-highlighted')

        const span = element.previousSibling
        if (span && span.classList.contains('a11yToolkit-autocomplete-indicator')) {
          span.remove()
        }
      })
    }

    const isVisible = (element: any) => {
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

    const processAutocompleteValues = (input: any, autocompleteCounts: Record<string, number>) => {
      const autocompleteValue = input.getAttribute('autocomplete')
      if (autocompleteValue !== null) {
        autocompleteCounts[autocompleteValue] = (autocompleteCounts[autocompleteValue] || 0) + 1
      }
    }

    const highlightAutocomplete = (element: any) => {
      let highlightedElement = element.classList.contains('a11yToolkit-highlighted')
      if (!highlightedElement) {
        const autocompleteValue = element.getAttribute('autocomplete')

        element.classList.add('a11yToolkit-highlighted')
        element.style.cssText += `outline: 2px solid red !important;`

        const span = document.createElement('span')
        span.className = 'a11yToolkit-autocomplete-indicator'
        span.style.position = 'relative'
        span.style.padding = '2px'
        span.style.zIndex = '999'
        span.style.background = 'red'
        span.style.color = 'white'
        // span.style.fontSize = '11px'

        if (!autocompleteValue) {
          span.innerText = 'No'
          console.error(`Input without autocomplete '${autocompleteValue}':`, element)
        } else if (!validAutocompleteValues.includes(autocompleteValue)) {
          span.innerText = '⚠️'
          console.error(`Input with invalid autocomplete '${autocompleteValue}':`, element)
        } else {
          span.innerText = autocompleteValue
        }

        element.insertAdjacentElement('beforebegin', span)
      }
    }

    const annotateAndAttach = () => {
      visibleInputs.forEach((element) => processAutocompleteValues(element, autocompleteCounts))

      console.log(`${visibleInputs.length} elements with autocomplete attribute were found on this page.`)
      console.log('Count of each autocomplete:')
      Object.entries(autocompleteCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })

      visibleInputs.forEach((element) => highlightAutocomplete(element))
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
