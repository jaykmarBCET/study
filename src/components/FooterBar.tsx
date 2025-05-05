'use client'
import Link from "next/link"

export default function FooterBar() {
    return (
        <div className="bg-black text-white p-4 mt-8">
            <div className="flex justify-center space-x-4">
                <Link href="/about" className="text-blue-500 hover:text-blue-700">
                    About
                </Link>
                <Link href="/contact" className="text-blue-500 hover:text-blue-700">
                    Contact
                </Link>
                <Link href="/privacy" className="text-blue-500 hover:text-blue-700">
                    Privacy Policy
                </Link>
            </div>
            <div className="mt-4 text-center text-sm">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
            </div>
        </div>
    );
}
