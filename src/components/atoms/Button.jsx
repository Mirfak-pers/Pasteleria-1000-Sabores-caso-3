const Button = ({ children, ...props}) => (
    <button {...props} className="btm btn-primary">{children}</button>
);

export default Button;