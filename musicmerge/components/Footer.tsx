import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base">
              2025 Branham High School • reunitems@gmail.com • 408-540-4333
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm hover:text-brand-blue transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm hover:text-brand-blue transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm hover:text-brand-blue transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </footer>
  );
}