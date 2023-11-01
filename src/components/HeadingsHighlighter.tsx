import { useState } from 'react'
import { CustomButton } from './common/Button'
import headingIcon from '../assets/headingsIcon.svg'

export const HeadingsHighlighter = () => {
  const [showHeadings, setShowHeadings] = useState<boolean>(false)

  const handleClick = () => {
    setShowHeadings(!showHeadings)
  }

  const iconClass = showHeadings ? 'svg-active' : 'svg-default'

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={headingIcon} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
