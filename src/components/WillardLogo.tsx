import React from 'react';
import { branding } from '@/config/branding';

interface WillardLogoProps {
  size?: number;
  className?: string;
  variant?: 'primary' | 'secondary'; // Allow overriding which logo to use
  rounded?: boolean; // Whether to show in a rounded container
}

export const WillardLogo: React.FC<WillardLogoProps> = ({
  size = 80,
  className = '',
  variant,
  rounded = true,
}) => {
  // Determine which logo to use
  const logoUrl = variant
    ? (variant === 'secondary' ? branding.logos.secondary : branding.logos.primary)
    : (branding.logos.activeLogo === 'secondary' ? branding.logos.secondary : branding.logos.primary);

  if (rounded) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt="Willard Tigers"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Willard Tigers"
      className={className}
      style={{ width: size, height: size }}
    />
  );
};
