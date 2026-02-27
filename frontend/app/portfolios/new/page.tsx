// app/portfolios/new/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PortfolioBuilder } from "./PortfolioBuilder";

export default async function NewPortfolioPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Pass necessary initial data to the client component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center bg-white/60 p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-gray-900">Create Portfolio</h1>
          <p className="text-gray-500 mt-2">Let's build your developer portfolio in 3 easy steps.</p>
        </div>
        
        <PortfolioBuilder user={session.user} />
      </div>
    </div>
  );
}
