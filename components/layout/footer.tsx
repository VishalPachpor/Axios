import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-4 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Single row layout with logo on left */}
        <div className="flex items-center justify-between">
          {/* Left - AXIOS Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-all duration-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 41 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.7054 17.7285L11.929 8.95214L9.2761 11.605L18.0047 20.3337L9.2761 29.0623L11.7275 31.5137L20.7054 22.5358L29.6832 31.5137L32.1346 29.0623L23.406 20.3337L32.1346 11.605L29.4817 8.95214L20.7054 17.7285Z"
                  fill="hsl(var(--primary))"
                />
                <path
                  d="M13.8881 6.81731L20.7054 -3.8147e-06L27.5227 6.81731L20.7054 13.6346L13.8881 6.81731Z"
                  fill="hsl(var(--primary))"
                />
                <path
                  d="M27.2001 20.3688L34.0174 13.5515L40.8347 20.3688L34.0174 27.1861L27.2001 20.3688Z"
                  fill="hsl(var(--primary))"
                />
                <path
                  d="M0 20.3688L6.81732 13.5515L13.6346 20.3688L6.81732 27.1861L0 20.3688Z"
                  fill="hsl(var(--primary))"
                />
                <path
                  d="M13.8881 33.8675L16.1566 31.599L20.8128 35.962L23.0468 33.6752L20.7591 31.4143L20.7054 27.0502L27.5227 33.8675L20.7054 40.6849L13.8881 33.8675Z"
                  fill="hsl(var(--primary))"
                />
              </svg>
              <span className="text-lg font-light tracking-wide">AXIOS</span>
            </Link>
          </div>

          {/* Right - Navigation Links and Social */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link
              href="/lend"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Lend
            </Link>
            <Link
              href="/borrow"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Borrow
            </Link>
            <Link
              href="/earn"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Earn
            </Link>
            <Link
              href="https://x.com/Axios_finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-accent"
              aria-label="Follow us on X (Twitter)"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://t.me/axiosfinance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-accent"
              aria-label="Join our Telegram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
