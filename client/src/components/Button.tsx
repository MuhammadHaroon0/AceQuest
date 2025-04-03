import React, { FormEvent } from 'react';

interface ButtonProps {
  type?: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean
  onClickBtn?: (e: FormEvent) => Promise<void>
}

const Button: React.FC<ButtonProps> = ({ type = 'primary', children, disabled, onClickBtn }) => {
  const primaryStyles = `
    group relative overflow-hidden border-2 border-[#1ecdf8] px-8 py-3 text-[16px] font-semibold text-white rounded-2xl
  `;

  const primaryHover = `
    absolute inset-0 origin-left scale-x-0 transform bg-gradient-to-r from-[#1ECDF8] to-[#7acbe1] transition-transform duration-300 ease-in-out group-hover:scale-x-100 
  `;

  const secondaryStyles = `
    group relative overflow-hidden px-8 py-3 text-[14px] font-semibold text-white bg-transparent border-2 border-[#1ecdf8]
  `;

  const secondaryHover = `
    absolute inset-0 left-0 top-0 h-full w-full transform scale-100 bg-gradient-to-r from-[#1ECDF8] to-[#7acbe1] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100
  `;

  return (
    <button className={type === 'primary' ? primaryStyles : secondaryStyles} disabled={disabled} onClick={onClickBtn}>
      {type === 'primary' ? (
        <>
          <span className={primaryHover}></span>
          <span className="relative z-10">{children}</span>
        </>
      ) : (
        <>
          <span className={secondaryHover}></span>
          <span className="relative z-10">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
