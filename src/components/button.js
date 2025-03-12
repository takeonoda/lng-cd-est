// src/components/Button.js
import React from 'react';

const Button = ({ onClick, children }) => {
  return (
    <button style={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

export default Button;
