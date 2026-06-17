'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-accent text-accent-foreground',
    'hover:opacity-90 active:scale-[0.98]',
    'shadow-sm',
  ].join(' '),
  outline: [
    'border border-accent text-accent bg-transparent',
    'hover:bg-accent/10 active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'text-foreground-secondary bg-transparent',
    'hover:text-foreground hover:bg-border-subtle active:scale-[0.98]',
  ].join(' '),
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-full',
  md: 'h-11 px-6 text-sm rounded-full',
  lg: 'h-12 px-8 text-base rounded-full',
};

const baseClasses = [
  'inline-flex items-center justify-center gap-2 font-medium',
  'transition-all duration-200 cursor-pointer select-none',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ');

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
