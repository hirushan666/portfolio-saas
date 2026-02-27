// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Code, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { EmptyPortfolios } from "@/components/dashboard/EmptyPortfolios";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { Portfolio } from "@/types";

async function getUserPortfolios(userId: string): Promise<Portfolio[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolios/user/${userId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const portfolios = await getUserPortfolios(session.user.id);
  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Portfolio SaaS
              </span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-gray-900 text-sm font-medium">{user.name?.split(' ')[0]}</span>
                {user.githubUsername && (
                  <span className="text-gray-500 text-xs">@{user.githubUsername}</span>
                )}
              </div>
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  {user.name?.slice(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Portfolios
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {portfolios.length === 0
                ? "You haven't created any portfolios yet."
                : `You have ${portfolios.length} portfolio${portfolios.length > 1 ? "s" : ""}.`}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shadow-sm transition-all duration-200 hover:scale-105"
          >
            <Link href="/portfolios/new">
              <Plus className="mr-2 h-5 w-5" />
              Create Portfolio
            </Link>
          </Button>
        </div>

        {/* Portfolio Grid or Empty State */}
        {portfolios.length === 0 ? (
          <EmptyPortfolios />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
