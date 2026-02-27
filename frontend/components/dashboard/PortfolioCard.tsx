'use client';

import Link from 'next/link';
import { Portfolio } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Globe,
  Lock,
  Pencil,
  Layers,
  BarChart2,
} from 'lucide-react';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const formattedDate = new Date(portfolio.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      {/* Gradient accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold text-lg truncate group-hover:text-indigo-600 transition-colors">
              {portfolio.title}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Updated {formattedDate}
            </p>
          </div>
          <Badge
            variant={portfolio.published ? 'default' : 'secondary'}
            className={
              portfolio.published
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0'
                : 'bg-gray-100 text-gray-600 border border-gray-200 shrink-0'
            }
          >
            {portfolio.published ? (
              <><Globe className="h-3 w-3 mr-1" />Live</>
            ) : (
              <><Lock className="h-3 w-3 mr-1" />Draft</>
            )}
          </Badge>
        </div>

        {/* Bio */}
        {portfolio.bio && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {portfolio.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5 text-gray-500 text-xs">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            {portfolio.projects?.length ?? 0} project{portfolio.projects?.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-purple-500" />
            {portfolio.viewCount ?? 0} views
          </span>
          {portfolio.theme && (
            <span className="flex items-center gap-1.5 capitalize">
              <span className="h-2 w-2 rounded-full bg-pink-400" />
              {portfolio.theme}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 text-xs transition-colors"
          >
            <Link href={`/portfolios/${portfolio.id}/edit`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50 text-xs transition-colors"
          >
            <Link href={`/portfolios/${portfolio.id}`} target="_blank">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
