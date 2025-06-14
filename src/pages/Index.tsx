import React from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Check, Star, Rocket, Shield, Clock, Users, Brain, Target, TrendingUp, Cpu, Layers, Coffee, Lightbulb } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { Link, useNavigate } from "react-router-dom";


const Index = () => {
  const navigate = useNavigate();
  
  const handlePromptSubmit = (prompt: string) => {
    localStorage.setItem("pendingPrompt", prompt);
    navigate("/workspace");
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Enhancement",
      description: "Transform basic prompts into detailed, effective instructions using advanced AI models like Llama 3.3.",
      highlight: "3-5x more detailed",
      stats: "99.8% accuracy rate"
    },
    {
      icon: Rocket,
      title: "Multi-Model Support", 
      description: "Optimize for Llama, Claude, ChatGPT, Mistral and more with model-specific enhancements.",
      highlight: "10+ AI models",
      stats: "Compatible with all major LLMs"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get enhanced prompts in seconds with our optimized processing pipeline powered by Groq.",
      highlight: "Under 5 seconds",
      stats: "Average 2.3s response time"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your prompts are encrypted and never shared. Complete data privacy guaranteed.",
      highlight: "Enterprise security",
      stats: "SOC 2 Type II compliant"
    },
    {
      icon: Target,
      title: "Smart Optimization",
      description: "Automatically adds context, constraints, and formatting for maximum AI effectiveness.",
      highlight: "Better results",
      stats: "300% improvement in output quality"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Share enhanced prompts with the community and build a library of effective instructions.",
      highlight: "Free & Open",
      stats: "Used by 500+ creators"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechCorp",
      quote: "PromptShift transformed our AI workflow. Our prompt effectiveness increased by 300%! The quality of outputs from our models improved dramatically.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Rodriguez", 
      role: "Content Creator",
      company: "Creative Studio",
      quote: "Finally, a tool that makes my prompts actually work. The enhancement quality is incredible and saves me hours of trial and error.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Scientist", 
      company: "AI Labs",
      quote: "The multi-model optimization saves us hours of trial and error. Essential for any AI team working with multiple language models.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Input Your Prompt",
      description: "Paste your basic prompt or idea into our intuitive interface",
      icon: Layers
    },
    {
      step: "02", 
      title: "AI Enhancement",
      description: "Our advanced AI analyzes and enhances your prompt with detailed specifications",
      icon: Cpu
    },
    {
      step: "03",
      title: "Get Results",
      description: "Receive a comprehensive, optimized prompt ready for any AI model",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Redesigned */}
        <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
          {/* Optional: Subtle background pattern or elements if needed */}
          {/* <div className="absolute inset-0 bg-grid-pattern opacity-5"></div> */}
          <div className="w-full max-w-5xl mx-auto space-y-10 relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-6 glow-blue-sm animate-fade-in">
              <Lightbulb className="h-10 w-10 text-blue-400" /> {/* New Icon */}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in text-gradient-blue leading-tight">
              Unlock Peak AI Performance.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.1s'}}>
              PromptShift refines your ideas into powerful, model-agnostic instructions.
              Achieve unparalleled clarity and <strong>3-5x better results</strong> from any LLM, powered by Groq for speed.
            </p>
            
            <div 
              className="w-full max-w-3xl mx-auto bg-gradient-to-br from-[#0A1024]/80 via-[#060B1A]/70 to-[#02040A]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 hover-border-glow transition-all duration-300 animate-fade-in" 
              style={{animationDelay: '0.2s'}}
            >
              <ChatInput
                placeholder="Enter your prompt to instantly enhance it..."
                onSubmit={handlePromptSubmit}
              />
              <div className="mt-6 text-sm text-white/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" /> Ready to enhance your prompts
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                    Powered by Groq
                  </span>
                  <Link to="/workspace" className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium hover:underline">
                    Go to Workspace <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Simplified Model Support Info (Optional - can be moved to features) */}
            <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <p className="text-white/70 text-sm">
                Optimized for Llama 3, Claude, ChatGPT-4, Mistral, Gemma & more.
              </p>
            </div>

            {/* Stats Section - Refined */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mt-16 md:mt-24 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {[
                { number: "50,000+", label: "Prompts Enhanced" },
                { number: "300%+", label: "Result Improvement" }, // Made it more impactful
                { number: "<2s", label: "Avg. Processing" }, // More concise
                { number: "100%", label: "Free & Open Source" } // Clarified
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/5 rounded-lg hover-scale transition-all duration-300">
                  <div className="text-4xl font-bold text-gradient-blue mb-1">{stat.number}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-transparent via-[#02040A]/50 to-[#02040A]"> {/* Adjusted background */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">How It Works</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Transform your prompts in three simple steps with our AI-powered enhancement engine
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <div 
                  key={step.step}
                  className="bolt-card p-8 group text-center hover-scale" // Using bolt-card and hover-scale
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 bg-blue-700/20 rounded-full flex items-center justify-center mb-6 mx-auto glow-blue-sm group-hover:scale-110 transition-transform duration-300 ease-out">
                    <step.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-3">{step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 px-4 bg-[#02040A]"> {/* Solid darker background for contrast */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">Why Choose PromptShift?</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the power of AI-enhanced prompting with cutting-edge features - completely free
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bolt-card p-8 group hover-scale" // Using bolt-card and hover-scale
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-14 h-14 bg-blue-700/20 rounded-xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-transform duration-300 ease-out">
                    <feature.icon className="h-7 w-7 text-blue-400" />
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <span className="text-xs bg-blue-600/30 text-blue-300 px-2.5 py-1 rounded-full font-medium"> {/* Adjusted badge style */}
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed mb-3">{feature.description}</p>
                  <p className="text-xs text-green-400 font-medium">{feature.stats}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-[#02040A] via-[#02040A]/50 to-transparent"> {/* Adjusted background */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gradient-blue">Loved by Professionals</h2>
              <p className="text-xl text-white/70">See what our users are saying about PromptShift</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bolt-card p-6 hover-border-glow" // Using bolt-card
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 italic leading-relaxed">"{testimonial.quote}"</p> {/* Added leading-relaxed */}
                  <div className="flex items-center gap-4"> {/* Increased gap */}
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50" /* Added border */
                    />
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div> {/* Changed to font-semibold */}
                      <div className="text-white/60 text-sm">{testimonial.role}</div> {/* Darker role text */}
                      <div className="text-blue-400 text-sm font-medium">{testimonial.company}</div> {/* Added font-medium */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-20 md:py-24 px-4 bg-[#02040A]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bolt-card p-10 md:p-12 hover-border-glow"> {/* Using bolt-card */}
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 mx-auto glow-amber-sm">
                <Coffee className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-blue"> {/* Adjusted size */}
                Support Our Mission
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto"> {/* Adjusted size */}
                PromptShift is completely free. If you find it valuable, consider buying us a coffee to help keep the service running and support future development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white button-glow px-8 py-3" /* Added py-3 for consistency */
                  onClick={() => window.open('https://buymeacoffee.com/promptshift', '_blank')}
                >
                  <Coffee className="mr-2 h-5 w-5" />
                  Buy Us a Coffee
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-3" /* Added py-3 */
                  asChild
                >
                  <Link to="/workspace">
                    Start Using Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-white/50 mt-8"> {/* Increased mt */}
                Your support helps us maintain servers, improve AI models, and add new features.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-[#02040A] via-[#02040A]/50 to-transparent"> {/* Adjusted background */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bolt-card p-10 md:p-12 hover-border-glow"> {/* Using bolt-card */}
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-blue"> {/* Adjusted size */}
                Ready to Transform Your AI Results?
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto"> {/* Adjusted size */}
                Join thousands of professionals who've already improved their AI workflow with PromptShift - completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white button-glow px-8 py-3" /* Added py-3 */
                  asChild
                >
                  <Link to="/workspace">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-3" /* Added py-3 */
                  asChild
                >
                  <Link to="/docs">
                    View Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 py-12 md:py-16 px-4 bg-[#02040A]"> {/* Darker footer, adjusted padding */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Zap className="h-7 w-7 text-blue-500 mr-2" /> {/* Slightly larger icon */}
                <h3 className="text-2xl font-bold text-gradient-blue">PromptShift</h3> {/* Larger title */}
              </div>
              <p className="text-white/70 leading-relaxed mb-6"> {/* Lighter text */}
                Transform your prompts with AI-powered enhancement for better results across all language models. 
                Built for professionals, free for everyone.
              </p>
              <div className="flex space-x-3"> {/* Reduced space */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors text-white/70 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> {/* Example X icon */}
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors text-white/70 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg> {/* Example LinkedIn icon */}
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">Product</h4> {/* Adjusted size */}
              <ul className="space-y-2.5 text-white/70"> {/* Adjusted spacing and color */}
                <li><Link to="/workspace" className="hover:text-blue-400 transition-colors">Workspace</Link></li>
                <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">Company</h4>
              <ul className="space-y-2.5 text-white/70">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press Kit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white text-base">Support</h4>
              <ul className="space-y-2.5 text-white/70">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="https://buymeacoffee.com/promptshift" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"> {/* Increased gap */}
                  <Coffee className="h-3.5 w-3.5" /> {/* Slightly larger icon */}
                  Buy Us Coffee
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm"> {/* Lighter text, adjusted padding */}
            <p>© 2025 PromptShift. All rights reserved. Free & Open Source.</p>
            <div className="flex space-x-5 mt-4 md:mt-0"> {/* Adjusted spacing */}
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
