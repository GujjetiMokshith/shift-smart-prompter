import React from "react";
import { Star } from "lucide-react";
import AnimatedText from "@/components/ui/animated-text";

const SocialProofSection: React.FC = () => {
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

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <AnimatedText variant="gradient" className="text-4xl font-bold mb-4">
            Trusted by AI Engineers, SaaS Founders & Creators Worldwide
          </AnimatedText>
          <AnimatedText delay={300} className="text-xl text-white/70">
            See how thousands are streamlining their AI productivity
          </AnimatedText>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass border border-white/10 p-6 hover-border-glow transition-all duration-500 backdrop-blur-xl group hover:scale-105"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                ))}
              </div>
              
              <p className="text-white/80 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400/30 group-hover:border-blue-400/60 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                  <div className="text-blue-400 text-sm font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;