
import React from 'react';

export default function Footer() {
  return (

<footer className="mx-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8" aria-labelledby="footer-heading">
    <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
        <p className="text-sm/6 text-gray-600 max-md:text-center">
            ©
            2024
            
            <a href="https://learnwithsumit.com/">Learn with Sumit</a>. All rights reserved.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm/6 text-gray-500 md:justify-end">
            <a href="https://learnwithsumit.com/privacy-policy">Privacy policy</a>
            <div className="h-4 w-px bg-gray-200"></div>
            <a href="https://learnwithsumit.com/terms">Terms</a>
        </div>
    </div>
</footer>
  );
}
