import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

/* In-app paths go through React Router; anchors and external links stay plain links */
export default function Link({ href, ...props }: LinkProps) {
  if (href.startsWith("#") || /^[a-z]+:/i.test(href)) return <a href={href} {...props} />;
  return <RouterLink to={href} {...props} />;
}
