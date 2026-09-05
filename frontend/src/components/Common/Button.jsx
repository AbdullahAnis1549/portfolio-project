
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
    };

    return (
        <button className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
