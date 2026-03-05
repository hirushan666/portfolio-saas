// app/portfolios/[id]/edit/page.tsx
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Portfolio } from "@/types";
import { PortfolioEditor } from "./PortfolioEditor";

async function getPortfolio(id: string): Promise<Portfolio | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolios/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) notFound();

  // Security: only the owner can edit
  if (portfolio.userId !== session.user.id) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
          <p className="text-gray-500 mt-1">
            Make changes to your portfolio. Updates are saved immediately.
          </p>
        </div>
        <PortfolioEditor portfolio={portfolio} userId={session.user.id!} />
      </div>
    </div>
  );
}
