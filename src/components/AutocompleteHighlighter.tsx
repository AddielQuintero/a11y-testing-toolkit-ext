import { useState } from 'react'
import { BsKeyboardFill } from 'react-icons/bs'
import { BsKeyboard } from 'react-icons/bs'
import { CustomButton } from './common/Button'

export const AutocompleteHighlighter = () => {
  const [showAutoCompletes, setShowAutoCompletes] = useState(false)

  const codeToExecute = function(showAutoCompletes: boolean) {
    const validAutocompleteValues = [
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
      const indicators = document.querySelectorAll('.autocomplete-indicator')
      indicators.forEach((indicator) => {
        const container = indicator.parentElement
        if (container) {
          const input = container.querySelector('input')
          if (input) {
            container.before(input)
            input.style.outline = ''
          }
          container.remove()
        }
      })
    }

    const isVisible = (element: any) => {
      const isAriaHidden = (element: any) => element.getAttribute('aria-hidden') === 'true'
      const isDisplayNone = (style: any) => style.display === 'none'
      const isVisibilityHidden = (style: any) => style.visibility === 'hidden'
      const hasZeroSize = (element: any) => element.offsetWidth === 0 || element.offsetHeight === 0
      const style = window.getComputedStyle(element)
      return !(
        isAriaHidden(element) ||
        isDisplayNone(style) ||
        isVisibilityHidden(style) ||
        hasZeroSize(element)
      )
    }
    const autocompleteCounts = {}
    const inputs = document.querySelectorAll('input')
    const visibleInputs = [...inputs].filter(isVisible)

    const processAutocompleteValues = (input: any, autocompleteCounts: any) => {
      const autocompleteValue = input.getAttribute('autocomplete')
      autocompleteCounts[autocompleteValue] = (autocompleteCounts[autocompleteValue] || 0) + 1
    }

    const highlightAutocomplete = (input: any) => {
      const autocompleteValue = input.getAttribute('autocomplete')

      const container = document.createElement('div')
      container.style.position = 'relative'
      container.style.display = 'inline-block'
      input.parentNode.insertBefore(container, input)
      container.appendChild(input)

      input.style.outline = '2px solid red'

      const span = document.createElement('span')
      span.className = 'autocomplete-indicator'
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
    <CustomButton onClick={handleClick}>
      {showAutoCompletes ? (
        <BsKeyboardFill className="buttons__icons" />
      ) : (
        <BsKeyboard className="buttons__icons" />
      )}
    </CustomButton>
  )
}
