
"use client";
import React from 'react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
     <nav className="bg-white px-6 md:px-20 py-4 h-[72px] grid grid-cols-3 border-b-2 border-gray-300 z-20 relative">
      <div className="flex items-center justify-start">
      </div>

      <div className="items-start justify-center pt-1 hidden md:flex">
        LOGO

      </div>

      <div className="flex items-center justify-end col-span-2 md:col-span-1">
        <div className="flex items-center justify-end">

            <div>
              <button >Ingresar</button>
            </div>

        </div>
      </div>
    </nav>
  );
}
