'use client';

import type { LinkProps } from 'next/link';
import NextLink from 'next/link';

export default function Link(
  props: LinkProps & {
    children: React.ReactNode;
    className?: string;
    title?: string;
  },
) {
  const { children, className, onClick, title, ...rest } = props;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <NextLink
      {...rest}
      className={className}
      onClick={handleClick}
      title={title}
    >
      {children}
    </NextLink>
  );
}
