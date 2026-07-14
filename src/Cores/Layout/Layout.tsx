import FooterCpn from "@src/Cores/Layout/FooterCpn";
import MenuBar from "@src/Cores/Layout/MenuBarTopCpn";
import { ScrollTcd, ScrollTopTcd } from "@src/Cores/ShareComponents";

export default function Layout({ children }: any) {
  return (
    <ScrollTcd className="tcd-body">
      <header className="tcd-header">
        <MenuBar></MenuBar>
      </header>
      <main className="tcd-main">{children}</main>
      <footer className="tcd-footer">
        <FooterCpn></FooterCpn>
      </footer>
      <ScrollTopTcd />
    </ScrollTcd>
  );
}
