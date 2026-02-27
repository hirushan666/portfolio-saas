'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title="Sign Out"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline ml-2">Sign Out</span>
    </Button>
  );
}
