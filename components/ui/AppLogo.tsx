import Image, { type StaticImageData } from 'next/image';

import logo from '../../logo.png';

type AppLogoProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizeClassName?: string;
  priority?: boolean;
  source?: StaticImageData;
};

export function AppLogo({
  alt = 'IT Quest logo',
  className = '',
  imageClassName = 'object-cover',
  sizeClassName = 'w-32 h-32',
  priority = false,
  source = logo
}: AppLogoProps) {
  return (
    <div className={`relative overflow-hidden ${sizeClassName} ${className}`.trim()}>
      <Image alt={alt} className={imageClassName} fill priority={priority} sizes="(max-width: 768px) 96px, 128px" src={source} />
    </div>
  );
}