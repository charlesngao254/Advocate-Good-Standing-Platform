import type { ReactNode } from "react";

type IconProps = { className?: string };

function Icon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={["h-5 w-5", className ?? ""].join(" ")}
    >
      {children}
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </Icon>
  );
}

export function IconFile(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M7 3h7l3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.7" />
    </Icon>
  );
}

export function IconBadgeCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 2 9.6 4.1 6.5 3.7 5.8 6.8 3.3 8.7 4.8 11.5 3.3 14.3 5.8 16.2l.7 3.1 3.1-.4L12 22l2.4-2.1 3.1.4.7-3.1 2.5-1.9-1.5-2.8 1.5-2.8-2.5-1.9-.7-3.1-3.1.4L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m8.6 12.2 2.2 2.2 4.6-4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </Icon>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19 12a7.4 7.4 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.8 7.8 0 0 0-1.7-1L14.5 3h-5L9 6.1a7.8 7.8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2L1 13.5l2 3.4 2.4-1a7.8 7.8 0 0 0 1.7 1L9.5 21h5l.5-3.1a7.8 7.8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3.5 7.5A3.5 3.5 0 0 1 7 4h3l2 2h5A3.5 3.5 0 0 1 20.5 9.5v9A3.5 3.5 0 0 1 17 22H7A3.5 3.5 0 0 1 3.5 18.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4.5 21V6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 8h2M8 12h2M8 16h2M14 8h2M14 12h2M14 16h2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 21v-4a1.5 1.5 0 0 1 1.5-1.5h0A1.5 1.5 0 0 1 13.5 17v4" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function IconGavel(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M9.2 6.4 12 3.6l3 3-2.8 2.8-3-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4.2 11.4 7 8.6l3 3-2.8 2.8-3-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 10 14 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13.2 12.2 20 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 18h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconSearchCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M20 20l-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m8.5 11.5 1.8 1.8 3.6-3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconInbox(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 4h16v10l-3 3H7l-3-3V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 14h5l1.5 2h3L15 14h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconScroll(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M7 3h10a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H9.5A2.5 2.5 0 0 1 7 18.5V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7 18.5A2.5 2.5 0 0 0 9.5 21" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8h7M10 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

