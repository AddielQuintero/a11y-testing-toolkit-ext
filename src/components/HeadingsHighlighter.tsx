import { useState } from 'react'
import { CustomButton } from './common/Button'
import headingIcon from '../assets/headingsIcon.svg'

interface HeadingsProps {
  setTooltipText: (tooltipText: string) => void
}

export const HeadingsHighlighter = ({ setTooltipText }: HeadingsProps) => {
  const [showHeadings, setShowHeadings] = useState<boolean>(false)

  const handleClick = () => {
    setShowHeadings(!showHeadings)
  }

  const iconClass = showHeadings ? 'svg-active' : 'svg-default'

  return (
    <CustomButton
      onMouseEnter={() => setTooltipText('Headings')}
      onMouseLeave={() => setTooltipText('')}
      onClick={handleClick}
      className={iconClass}
    >
      <img src={headingIcon} className="svg-icon" alt="Heading Icon" />
    </CustomButton>
  )
}
