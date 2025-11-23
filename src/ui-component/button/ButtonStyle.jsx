import React from 'react';

const ButtonStyle = ({ children, onClick, bg, color, hover, width, height,mt,mb }) => {
  // Mengatur state untuk hover effect
  const [isHovered, setIsHovered] = React.useState(false);

  // Mendefinisikan gaya untuk button
  const styles = {
    button: {
      marginTop:mt,
      marginBottom: mb,
      width: width,
      height: height,
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
      backgroundColor: hover
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
      {children}
    </button>
  );
};

export default ButtonStyle;
