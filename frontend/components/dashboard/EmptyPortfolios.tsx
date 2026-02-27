import Link from 'next/link';
import { Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyPortfolios() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 px-6 text-center shadow-sm">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
        <FolderOpen className="h-10 w-10 text-indigo-600" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No portfolios yet
      </h2>
      <p className="text-gray-600 text-sm max-w-sm mb-8 leading-relaxed">
        Create your first portfolio and start showcasing your work to the world. It only takes a few minutes!
      </p>

      <Button
        asChild
        size="lg"
        className="shadow-sm transition-all duration-200 hover:scale-105"
      >
        <Link href="/portfolios/new">
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Portfolio
        </Link>
      </Button>
    </div>
  );
}
