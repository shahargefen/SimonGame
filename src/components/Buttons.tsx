import React from "react";

interface ColorButtonProps {
  color: string;
  onClick: () => void;
  flash?: boolean;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, onClick, flash }) => {
  return (
    <div
      onClick={onClick}
      className={`colorButton ${color} ${flash ? "flash" : ""}`}
    ></div>
  );
};

export default ColorButton;