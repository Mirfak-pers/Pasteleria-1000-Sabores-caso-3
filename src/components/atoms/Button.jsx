import React from 'react';

const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;