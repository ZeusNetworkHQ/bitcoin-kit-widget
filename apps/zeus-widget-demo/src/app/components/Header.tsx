import Button from "./Button";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full py-12 lg:py-16">
      <img
        src="/branding/logo-primary.svg"
        alt="ZeusStack Logo"
        className="h-20"
      />
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={process.env.NEXT_PUBLIC_DOCS_LINK}
      >
        <Button label="View Docs" />
      </a>
    </header>
  );
}
