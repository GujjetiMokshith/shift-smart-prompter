import React, { useRef, useEffect } from "react";
import { ArrowRight, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EnhancedFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('footer-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="border-t border-white/5 py-20 px-4 bg-gradient-to-br from-[#030712] via-[#001f54]/20 to-[#030712] relative overflow-hidden"
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/10 to-purple-900/10 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Newsletter Section */}
        <div className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-1000 newsletter-section">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stay Updated with PromptShift
          </h3>
          <p className="text-white/60 mb-6">Get the latest updates on AI optimization and new features</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
            />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 hover:scale-105 transition-all duration-300">
              Subscribe
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 opacity-0 translate-y-8 transition-all duration-1000 brand-section">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 hover:scale-110 transition-all duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PromptShift</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Transform your prompts with AI-powered enhancement for better results across all language models. 
              Built for professionals, free for everyone.
            </p>
            <div className="flex space-x-4">
              {['𝕏', 'in', 'gh'].map((icon, index) => (
                <div 
                  key={icon}
                  className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center hover:from-blue-600/30 hover:to-purple-600/30 cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-110"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-white/80 font-bold">{icon}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Links Sections */}
          {[
            {
              title: "Product",
              color: "blue",
              links: [
                { name: "Workspace", to: "/workspace" },
                { name: "Documentation", to: "/docs" },
                { name: "API Reference", to: "#" },
                { name: "Integrations", to: "#" }
              ]
            },
            {
              title: "Company", 
              color: "purple",
              links: [
                { name: "About", to: "/about" },
                { name: "Blog", to: "#" },
                { name: "Careers", to: "#" },
                { name: "Press Kit", to: "#" }
              ]
            },
            {
              title: "Support",
              color: "green", 
              links: [
                { name: "Help Center", to: "#" },
                { name: "Buy Us Coffee", to: "https://buymeacoffee.com/promptshift", external: true, icon: Coffee },
                { name: "Community", to: "#" },
                { name: "Status Page", to: "#" }
              ]
            }
          ].map((section, sectionIndex) => (
            <div 
              key={section.title}
              className="opacity-0 translate-y-8 transition-all duration-1000 links-section"
              style={{ animationDelay: `${sectionIndex * 0.2 + 0.3}s` }}
            >
              <h4 className="font-semibold mb-6 text-white flex items-center gap-2">
                <div className={`w-2 h-2 bg-${section.color}-400 rounded-full animate-pulse`}></div>
                {section.title}
              </h4>
              <ul className="space-y-4 text-white/60">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a 
                        href={link.to} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`hover:text-${section.color === 'green' && link.icon ? 'amber' : section.color}-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300 group`}
                      >
                        {link.icon ? <link.icon className="h-3 w-3" /> : <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        {link.name}
                      </a>
                    ) : (
                      <Link 
                        to={link.to} 
                        className={`hover:text-${section.color}-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300 group`}
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/50 opacity-0 translate-y-8 transition-all duration-1000 footer-bottom">
          <div className="flex items-center gap-2">
            <span>© 2025 PromptShift. All rights reserved.</span>
            <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20 animate-pulse">Free forever</span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors text-sm hover:scale-105 duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors text-sm hover:scale-105 duration-300">Terms of Service</Link>
            <a href="#" className="hover:text-blue-400 transition-colors text-sm hover:scale-105 duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default EnhancedFooter;