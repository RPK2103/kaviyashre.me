import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-background">
      <Container className="flex min-h-16 items-center justify-center py-4">
        <p className="text-center text-[13px] leading-snug text-muted-foreground sm:text-sm">
          © 2026 Kaviyashre R P. Designed and built with ❤️ by me.
        </p>
      </Container>
    </footer>
  );
}
