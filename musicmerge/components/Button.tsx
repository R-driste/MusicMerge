"use client";
export function Button({ 
  children, 
  variant = "primary", 
  href, 
  color1,
  color2
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "secondary";
  href: string;
  color1?: string; //main
  color2?: string; //hover
}) {
  const baseStyles = "flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors md:w-[250px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px] font-bold text-base md:text-lg lg:text-xl";
  
  //default style
  const defaultStyles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "border border-gray-300 text-gray-900 hover:bg-gray-100"
  };

  //custom colors
  const customStyle = color1 ? {
    backgroundColor: variant === "primary" ? color1 : "transparent",
    color: variant === "primary" ? "white" : color1,
    borderColor: variant === "secondary" ? color1 : undefined,
    borderWidth: variant === "secondary" ? "1px" : undefined,
    borderStyle: variant === "secondary" ? "solid" : undefined,
  } : undefined;

  //inline hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (color2) {
      if (variant === "primary") {
        e.currentTarget.style.backgroundColor = color2;
      } else {
        e.currentTarget.style.backgroundColor = color2;
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (color1) {
      if (variant === "primary") {
        e.currentTarget.style.backgroundColor = color1;
      } else {
        e.currentTarget.style.backgroundColor = "transparent";
      }
    }
  };

  return (
    <a 
      href={href}
      className={`${baseStyles} ${!color1 ? defaultStyles[variant] : ""}`}
      style={customStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}