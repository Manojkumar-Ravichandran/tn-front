import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ChevronRight, ArrowRight, Calendar, Sparkles, Castle } from 'lucide-react';
import { getPublicTemples } from '../../features/temples/templeApi';
import SEO from '../../components/SEO';

const Home = () => {
  const { data: temples = [], isLoading } = useQuery({
    queryKey: ['public-temples'],
    queryFn: getPublicTemples
  });

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace('/api/v1', '');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        title="Heritage of Tamil Nadu, Digitally Reimagined"
        description="Explore thousands of ancient Hindu temples across Tamil Nadu. A community-driven initiative to document, preserve, and showcase the divine architectural marvels of Tamil Nadu's rich spiritual heritage."
        keywords="Tamil Nadu temple heritage, ancient temples, gopuram, Dravidian architecture, temple directory"
        canonical="/"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary-bg border border-border-theme text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles className="w-4 h-4" />
            Preserving History Together
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Heritage of <span className="text-primary italic">Tamil Nadu.</span> <br />
            Digitally Reimagined.
          </h1>
          <p className="text-lg md:text-xl text-foreground/40 font-medium max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Explore thousands of ancient temples across Tamil Nadu. A community-driven initiative
            to document, preserve, and showcase our divine architectural marvels to the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link
              to="/login"
              className="group flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Contributing
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/festivals"
              className="flex items-center gap-2.5 px-10 py-5 bg-secondary-bg border border-border-theme text-foreground rounded-[2rem] font-black text-sm hover:bg-secondary-bg/80 transition-all active:scale-95"
            >
              Explore Temples
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Temples Section */}
      <section className="py-24 border-t border-border-theme bg-secondary-bg/10 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-none mb-2">Featured Temples</h2>
              <p className="text-primary font-bold uppercase tracking-wide text-xs md:text-sm">Timeless wonders of architectural brilliance</p>
            </div>
            <Link to="/temples" className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors text-sm">
              View All Temples <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl h-[400px] bg-secondary-bg border border-border-theme animate-pulse"></div>
              ))
            ) : temples.length > 0 ? (
              temples.slice(0, 3).map((temple) => {
                const imageUrl = temple.images?.[0] ? `${API_URL}${temple.images[0]}` : '/placeholder-temple.jpg';
                return (
                  <Link key={temple._id} to={`/temples/${temple.slug}`} className="group relative rounded-3xl overflow-hidden h-[400px] border border-border-theme block">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    {/* Subtle Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90 pointer-events-none" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                      <span className="text-[10px] uppercase font-black tracking-[0.2em] text-primary mb-2">
                        {temple.district?.name || 'Tamil Nadu'}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight mb-3">
                        {temple.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        {temple.deity?.name ? `${temple.deity.name} Temple` : 'Temple Location'}
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full py-20 text-center border border-border-theme rounded-3xl bg-secondary-bg/20">
                <p className="text-foreground/40 font-bold">No temples featured at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Festivals Section */}
      <section className="py-24 border-t border-border-theme bg-secondary-bg/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <p className="text-primary font-black uppercase tracking-[0.15em] text-xs">Happening Now</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Today's Sacred Festivals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hardcoded festival cards based on UI design */}
            <div className="bg-background border border-border-theme rounded-[2rem] p-8 flex flex-col justify-between group transition-all hover:border-primary/50 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">Today</span>
                  <Sparkles className="w-5 h-5 text-primary opacity-60" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Panguni Uthiram</h3>
                <p className="text-foreground/60 text-sm font-medium leading-relaxed">
                  Celebrated in the month of Panguni, signifying the marriage of Lord Shiva and Goddess Parvati.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border-theme flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Castle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground/80">Majorly at Palani & Mylapore</span>
              </div>
            </div>

            <div className="bg-background border border-border-theme rounded-[2rem] p-8 flex flex-col justify-between group transition-all hover:border-primary/50 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-foreground/5 text-foreground/60 text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">Tomorrow</span>
                  <Calendar className="w-5 h-5 text-foreground/20" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Chithirai Thiruvizha</h3>
                <p className="text-foreground/60 text-sm font-medium leading-relaxed">
                  The grand celebration of Madurai, marking the celestial wedding of Meenakshi Amman.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border-theme flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Castle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground/80">Madurai District</span>
              </div>
            </div>

            <div className="bg-background border border-border-theme rounded-[2rem] p-8 flex flex-col justify-between group transition-all hover:border-primary/50 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-foreground/5 text-foreground/60 text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">Upcoming</span>
                  <MapPin className="w-5 h-5 text-foreground/20" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Aadi Perukku</h3>
                <p className="text-foreground/60 text-sm font-medium leading-relaxed">
                  Festival of prosperity, celebrating the monsoon season and rising water levels.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border-theme flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Castle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground/80">River Kaveri Banks</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;