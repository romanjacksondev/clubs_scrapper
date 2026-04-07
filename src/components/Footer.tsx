import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from 'flowbite-react';

export default function AppFooter() {
  return (
    <Footer container>
      <FooterDivider />
      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <FooterCopyright href="/" by="Clubs Scrapper" year={2026} />
        <FooterLinkGroup className="mt-3 sm:mt-0">
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
        </FooterLinkGroup>
      </div>
    </Footer>
  );
}
