// src/components/Input.js
import React from 'react';

const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      style={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

const styles = {
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  }
};

export default Input;
