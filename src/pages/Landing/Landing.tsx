import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  SparklesIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

export const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const features = [
    {
      icon: <LockClosedIcon className="w-10 h-10" />,
      title: "Secure",
      description: "Bank-grade encryption",
    },
    {
      icon: <SparklesIcon className="w-10 h-10" />,
      title: "Fast",
      description: "Instant transfers",
    },
    {
      icon: <HandRaisedIcon className="w-10 h-10" />,
      title: "Simple",
      description: "Just tap & go",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-light tracking-wider text-text-primary">
              AURAPAY
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <a
              href="#features"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm tracking-wide"
            >
              FEATURES
            </a>
            <button
              onClick={handleGetStarted}
              className="bg-text-primary text-background px-8 py-3 text-sm tracking-wide hover:bg-text-secondary transition-colors"
            >
              GET STARTED
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-1 bg-text-primary mb-1"></div>
            <div className="w-6 h-1 bg-text-primary mb-1"></div>
            <div className="w-6 h-1 bg-text-primary"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-8 py-6 border-t border-border/20">
            <div className="flex flex-col space-y-6">
              <a
                href="#features"
                className="text-text-secondary hover:text-text-primary transition-colors text-sm tracking-wide"
              >
                FEATURES
              </a>
              <button
                onClick={handleGetStarted}
                className="bg-text-primary text-background px-8 py-3 text-sm tracking-wide hover:bg-text-secondary transition-colors text-left"
              >
                GET STARTED
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-light text-text-primary mb-8 leading-none tracking-tight">
            THE FUTURE
            <span className="block mt-2">OF MONEY</span>
          </h1>
          <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto tracking-wide">
            Send and receive money instantly. Secure. Simple. Fast.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-text-primary text-background px-12 py-4 text-lg tracking-wide hover:bg-text-secondary transition-all duration-300 hover:scale-105"
          >
            START NOW
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-light text-text-primary mb-6 tracking-wide">
              WHY AURAPAY?
            </h2>
            <p className="text-text-secondary text-lg tracking-wide max-w-2xl mx-auto">
              Experience the next generation of digital payments
            </p>
          </div>

          {/* New Features Layout */}
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12 md:gap-20`}
              >
                {/* Icon Section */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-text-primary/5 border border-text-primary/20 rounded-full flex items-center justify-center">
                      <div className="text-text-primary">{feature.icon}</div>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 w-32 h-32 border border-text-primary/10 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-6 py-2 bg-text-primary/10 border border-text-primary/20 rounded-full mb-6">
                    <span className="text-text-primary text-sm tracking-wide font-medium">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-4xl font-light text-text-primary mb-6 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-lg tracking-wide leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-text-primary mb-8 tracking-wide">
            READY TO BEGIN?
          </h2>
          <p className="text-text-secondary mb-12 tracking-wide">
            Join the revolution in digital payments
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-text-primary text-background px-16 py-4 text-lg tracking-wide hover:bg-text-secondary transition-all duration-300 hover:scale-105"
          >
            CREATE WALLET
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-16 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <span className="text-xl font-light tracking-wider text-text-primary">
                AURAPAY
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-text-secondary text-sm tracking-wide">
                &copy; 2024 AuraPay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
