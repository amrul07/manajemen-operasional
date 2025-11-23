import React from 'react';

const CustomButton = ({ label, onClick, bg, color, hover,colorHover }) => {
  // Mengatur state untuk hover effect
  const [isHovered, setIsHovered] = React.useState(false);

  // Mendefinisikan gaya untuk button
  const styles = {
    button: {
      width: '32px',
      height: '32px',
      // padding: '8px',
      // paddingX: 6,
      // paddingy: 40,
      backgroundColor: bg,
      border: 'none',
      borderRadius: '5px',
      color: color,
      // padding: "10px 20px",
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      textAlign: 'center',
      fontFamily: `'Poppins', sans-serif`
    },
    buttonHover: {
      backgroundColor: hover,
      color: '#fff'
    }
  };

  return (
    <button
      style={{
        ...styles.button,
        ...(isHovered ? styles.buttonHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </button>
  );
};

export default CustomButton;
