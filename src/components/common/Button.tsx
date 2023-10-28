type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const CustomButton = (props: ButtonProps): JSX.Element => {
  return (
    <button
      type={props.type}
      role={props.role}
      style={props.style}
      className={props.className}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
