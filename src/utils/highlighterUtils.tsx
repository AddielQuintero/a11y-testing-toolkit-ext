export const removeIndicators = () => {
  const indicators = document.querySelectorAll('.tabindex-indicator')
  indicators.forEach((indicator) => indicator.remove())
}

export const isVisible = (element: HTMLElement) => {
  const isAriaHidden = (element: HTMLElement) => element.getAttribute('aria-hidden') === 'true'
  const isDisplayNone = (style: CSSStyleDeclaration) => style.display === 'none'
  const isVisibilityHidden = (style: CSSStyleDeclaration) => style.visibility === 'hidden'
  const hasZeroSize = (element: HTMLElement) => element.offsetWidth === 0 || element.offsetHeight === 0
  const style = window.getComputedStyle(element)
  return !(isAriaHidden(element) || isDisplayNone(style) || isVisibilityHidden(style) || hasZeroSize(element))
}

export const highlightElement = (element: HTMLInputElement, label: string, color: string) => {
  const positionStyle = window.getComputedStyle(element).position

  if (positionStyle === 'static') {
    element.style.position = 'relative'
  }

  element.style.outline = '2px solid red'

  const labelElement = document.createElement('span')
  labelElement.className = 'LandMarks-indicator'
  labelElement.innerText = label
  labelElement.style.position = 'absolute'
  labelElement.style.padding = '2px'
  labelElement.style.top = '0'
  labelElement.style.left = '0'
  labelElement.style.zIndex = '999'
  labelElement.style.background = color
  labelElement.style.color = 'white'

  element.prepend(labelElement)
  return labelElement
}
