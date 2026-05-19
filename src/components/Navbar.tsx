'use client';

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { signOut, useSession } from 'next-auth/react';

export default function AppNavbar() {
  const { data: session } = useSession();

  return (
    <Navbar fluid>
      <NavbarBrand href="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Clubs Scrapper
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="/" active>
          Home
        </NavbarLink>
        {session && <NavbarLink href="/scrape">Scrape</NavbarLink>}
        {session && <NavbarLink href="/clubs">Clubs</NavbarLink>}
        {session && <NavbarLink href="/leagues">Leagues</NavbarLink>}
        {session && <NavbarLink href="/scrapes">Scrape Runs</NavbarLink>}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Sign out ({session.user?.name})
          </button>
        ) : (
          <NavbarLink href="/login">Sign in</NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
