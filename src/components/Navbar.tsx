'use client';

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

export default function AppNavbar() {
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
        <NavbarLink href="/scrape">Scrape</NavbarLink>
        <NavbarLink href="/clubs">Clubs</NavbarLink>
        <NavbarLink href="/leagues">Leagues</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
