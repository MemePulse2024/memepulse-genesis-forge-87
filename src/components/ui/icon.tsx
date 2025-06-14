import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import * as icons from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = icons[name] as LucideIcon;
  return <IconComponent {...props} />;
};
