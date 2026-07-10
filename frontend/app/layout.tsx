"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("route53_token");
    const storedUser = localStorage.getItem("route53_user");

    if (!token && pathname !== "/login") {
      router.push("/login");
    } else {
      setUsername(storedUser);
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("route53_token");
    localStorage.removeItem("route53_user");
    router.push("/login");
  };

  if (pathname === "/login") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  if (isCheckingAuth) {
    return (
      <html lang="en">
        <body className="bg-[#f2f3f3] flex items-center justify-center h-screen">
          <div className="text-gray-500">Loading AWS Environment...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-[#f2f3f3] text-gray-900 font-sans antialiased flex h-screen overflow-hidden">
        
        <div className="w-56 bg-[#232f3e] text-gray-300 flex flex-col flex-shrink-0">
          <div className="p-4 flex items-center gap-2 text-white font-bold text-lg border-b border-gray-700">
            <span className="text-[#ff9900]">🌐</span> Route 53
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              DNS Management
            </div>
            <Link href="/" className="block px-4 py-2 text-white bg-[#161d26] border-l-2 border-[#ff9900]">
              Hosted zones
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-700 bg-[#1a232e]">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#0073bb] text-white flex items-center justify-center font-bold">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium truncate ml-2 flex-1">{username || "User"}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          
          <header className="bg-[#0f1b2a] text-white h-10 flex items-center justify-end px-4 text-sm flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-gray-300 font-medium">{username}@route53-clone</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-300 hover:text-red-400 ml-2 transition-colors font-medium"
                title="Sign out"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}