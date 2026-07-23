import Link from "next/link"
import { Leaf, Sparkles, PhoneCall } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { HeroSection } from "./components/home/HeroSection"
import {
  HeroAnimation,
  CategoryCardAnimation,
  FadeItemAnimation,
  CTAAnimation,
} from "./components/home/HomeAnimations"

export default async function HomePage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  return (
    <div>
      <HeroSection />

      <section className="px-6 md:px-10 py-16 bg-surface">
        <h2 className="font-serif text-2xl md:text-3xl text-primary text-center mb-10">
          Nos univers
        </h2>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((cat, i) => (
              <CategoryCardAnimation key={cat.id} delay={i * 0.08}>
                <Link
                  href={`/boutique?categorie=${cat.slug}`}
                  className="block rounded-2xl border border-border bg-background p-5 text-center hover:border-accent transition-colors"
                >
                  <Leaf size={20} className="mx-auto mb-3 text-sage" />
                  <h3 className="font-medium text-sm text-foreground">
                    {cat.name}
                  </h3>
                </Link>
              </CategoryCardAnimation>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-foreground/50">
            Nos univers arrivent très bientôt.
          </p>
        )}
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Sans compte requis", desc: "Commandez en quelques secondes" },
            { title: "Contact rapide", desc: "Nous vous rappelons pour finaliser" },
            { title: "Sélection soignée", desc: "Des produits choisis avec attention" },
          ].map((item, i) => (
            <FadeItemAnimation key={item.title} delay={i * 0.1}>
              <h4 className="font-serif text-lg text-primary mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-foreground/60">{item.desc}</p>
            </FadeItemAnimation>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <CTAAnimation>
          <PhoneCall size={22} className="mx-auto mb-4 text-accent" />
          <h3 className="font-serif text-2xl md:text-3xl mb-3">
            Une question avant de commander ?
          </h3>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            Parcourez nos produits et laissez-nous vos coordonnées,
            nous vous recontactons rapidement.
          </p>
          <Link
            href="/boutique"
            className="inline-block bg-accent text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            Voir la boutique
          </Link>
        </CTAAnimation>
      </section>
    </div>
  )
}