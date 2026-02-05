import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: '1rem', background: '#222', color: '#fff', textAlign: 'center', marginTop: 'auto' }}>
      <span>&copy; {new Date().getFullYear()} Clubs Scrapper</span>
    </footer>
  );
}
