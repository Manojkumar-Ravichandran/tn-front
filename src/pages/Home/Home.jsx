import React from 'react';
import { Link } from 'react-router-dom';
import { Castle, MapPin, ChevronRight, Users, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle background glow */}
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

            <button className="flex items-center gap-2.5 px-10 py-5 bg-secondary-bg border border-border-theme text-foreground rounded-[2rem] font-black text-sm hover:bg-secondary-bg/80 transition-all active:scale-95">
              Explore Temples
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 border-t border-border-theme bg-secondary-bg/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-background border border-border-theme shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <Castle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Temple Directory</h3>
              <p className="text-foreground/40 font-medium leading-relaxed">
                Comprehensive database of Tamil Nadu temples with history, architecture, and festivals.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-background border border-border-theme shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Smart Mapping</h3>
              <p className="text-foreground/40 font-medium leading-relaxed">
                Integrated geographic tracking to help pilgrims find nearby temples and navigate easily.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-background border border-border-theme shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Contributor Portal</h3>
              <p className="text-foreground/40 font-medium leading-relaxed">
                Secure portal for history enthusiasts to submit photos, verify data, and earn heritage points.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;