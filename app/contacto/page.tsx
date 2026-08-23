import Header from "@/components/header";
import Footer from "@/components/footer";
import Contact from "@/components/contact";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactoPage() {
  const content = await getSiteContent();

  return (
    <main className="w-full overflow-hidden">
      <Header />
      <div className="pt-8 md:pt-12">
        <Contact
          email={content.contact.email}
          extraSocials={content.contact.extraSocials}
        />
      </div>
      <Footer />
    </main>
  );
}
