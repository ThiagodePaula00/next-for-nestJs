import Link from "next/link";

const currentYear = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="pb-16 text-center">
            <p>
                <span>
                    Copyright &copy; {currentYear} - <Link href='/'>The blog</Link>
                </span>
            </p>
        </footer>
    );
}