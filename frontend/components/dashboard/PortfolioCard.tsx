'use client';

import Link from 'next/link';
import { Portfolio } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Globe,
  Lock,
  Pencil,
  Layers,
  BarChart2,
  Link2,
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

  const themeConfig = {
    minimal: {
      bar: 'bg-stone-300',
      badge: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: 'bg-stone-400',
      cardBg: 'bg-white',
      border: 'border-gray-200',
      textMain: 'text-gray-900',
      textMuted: 'text-gray-500',
      textBio: 'text-gray-600',
      titleHover: 'group-hover:text-indigo-600',
      icon1: 'text-indigo-500',
      icon2: 'text-purple-500',
      btnPrimary: '',
      btnSecondary: 'text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50',
    },
    midnight: {
      bar: 'bg-indigo-500',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: 'bg-indigo-400',
      cardBg: 'bg-slate-950',
      border: 'border-slate-800',
      textMain: 'text-slate-100',
      textMuted: 'text-slate-400',
      textBio: 'text-slate-300',
      titleHover: 'group-hover:text-indigo-400',
      icon1: 'text-indigo-400',
      icon2: 'text-purple-400',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      btnSecondary: 'bg-transparent text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800',
    },
    vibrant: {
      bar: 'bg-white/40',
      badge: 'bg-white/20 text-white border-white/30',
      icon: 'bg-white',
      cardBg: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500',
      border: 'border-purple-400/50',
      textMain: 'text-white',
      textMuted: 'text-pink-100/80',
      textBio: 'text-white/90',
      titleHover: 'group-hover:text-pink-200',
      icon1: 'text-pink-200',
      icon2: 'text-purple-200',
      btnPrimary: 'bg-white text-purple-600 hover:bg-pink-50',
      btnSecondary: 'bg-transparent text-white hover:text-pink-50 border-white/30 hover:bg-white/20',
    }
  };

  const currentTheme = themeConfig[portfolio.theme as keyof typeof themeConfig] || themeConfig.minimal;

  return (
    <div className={`group relative rounded-2xl border ${currentTheme.border} ${currentTheme.cardBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full`}>
      {/* Dynamic Theme accent top bar */}
      <div className={`h-1.5 w-full ${currentTheme.bar}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`${currentTheme.textMain} font-semibold text-lg truncate ${currentTheme.titleHover} transition-colors`}>
              {portfolio.title}
            </h3>
            <p className={`${currentTheme.textMuted} text-xs mt-0.5`}>
              Updated {formattedDate}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <Badge
              variant={portfolio.published ? 'default' : 'secondary'}
              className={
                portfolio.published
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 shadow-sm'
              }
            >
              {portfolio.published ? (
                <><Globe className="h-3 w-3 mr-1" />Live</>
              ) : (
                <><Lock className="h-3 w-3 mr-1" />Draft</>
              )}
            </Badge>

            {/* Theme Badge */}
            <Badge variant="outline" className={`capitalize shadow-sm ${currentTheme.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${currentTheme.icon}`} />
              {portfolio.theme || 'minimal'}
            </Badge>
          </div>
        </div>

        {/* Bio */}
        {portfolio.bio && (
          <p className={`${currentTheme.textBio} text-sm line-clamp-2 mb-3 leading-relaxed`}>
            {portfolio.bio}
          </p>
        )}

        {/* Public slug URL */}
        {portfolio.slug && (
          <div className={`flex items-center gap-1.5 mb-4 text-xs ${currentTheme.textMuted}`}>
            <Link2 className="h-3 w-3 shrink-0" />
            <span className="truncate font-mono">/portfolios/{portfolio.slug}</span>
          </div>
        )}

        {/* Stats */}
        <div className={`flex items-center gap-4 mb-5 ${currentTheme.textMuted} text-xs`}>
          <span className="flex items-center gap-1.5">
            <Layers className={`h-3.5 w-3.5 ${currentTheme.icon1}`} />
            {portfolio.projects?.length ?? 0} project{portfolio.projects?.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart2 className={`h-3.5 w-3.5 ${currentTheme.icon2}`} />
            {portfolio.viewCount ?? 0} views
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className={`flex-1 text-xs transition-colors ${currentTheme.btnPrimary}`}
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
            className={`flex-1 text-xs transition-colors ${currentTheme.btnSecondary}`}
          >
            <Link href={portfolio.slug ? `/portfolios/${portfolio.slug}` : `/portfolios/${portfolio.id}`} target="_blank">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
