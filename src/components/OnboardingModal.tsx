
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({
    experience_level: '',
    primary_use_case: '',
    preferred_models: [] as string[],
    goals: '',
    company_size: '',
    industry: '',
    specific_needs: ''
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('onboarding_responses')
        .insert({
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Welcome! Your preferences have been saved.');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding responses:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const toggleModel = (model: string) => {
    setResponses(prev => ({
      ...prev,
      preferred_models: prev.preferred_models.includes(model)
        ? prev.preferred_models.filter(m => m !== model)
        : [...prev.preferred_models, model]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] bg-[#050A14] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Welcome to PromptShift!
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Let's personalize your experience. This will only take a few minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= currentStep ? 'bg-blue-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Experience & Goals */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tell us about yourself</h3>
              
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-white">
                  How experienced are you with AI tools?
                </Label>
                <Select onValueChange={(value) => updateResponse('experience_level', value)}>
                  <SelectTrigger className="bg-[#060B16] border-white/10">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - New to AI tools</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Very experienced</SelectItem>
                    <SelectItem value="expert">Expert - AI professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="use_case" className="text-white">
                  What's your primary use case?
                </Label>
                <Select onValueChange={(value) => updateResponse('primary_use_case', value)}>
                  <SelectTrigger className="bg-[#060B16] border-white/10">
                    <SelectValue placeholder="Select your primary use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_creation">Content Creation</SelectItem>
                    <SelectItem value="programming">Programming & Development</SelectItem>
                    <SelectItem value="research">Research & Analysis</SelectItem>
                    <SelectItem value="business">Business & Strategy</SelectItem>
                    <SelectItem value="education">Education & Learning</SelectItem>
                    <SelectItem value="creative">Creative Projects</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals" className="text-white">
                  What are your main goals? (Optional)
                </Label>
                <Textarea
                  id="goals"
                  placeholder="Tell us what you hope to achieve..."
                  value={responses.goals}
                  onChange={(e) => updateResponse('goals', e.target.value)}
                  className="bg-[#060B16] border-white/10 text-white"
                />
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Your preferences</h3>
              
              <div className="space-y-2">
                <Label className="text-white">Which AI models interest you most?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'chatgpt', label: 'ChatGPT (OpenAI)' },
                    { id: 'claude', label: 'Claude (Anthropic)' },
                    { id: 'llama', label: 'Llama (Meta)' },
                    { id: 'mistral', label: 'Mistral AI' }
                  ].map((model) => (
                    <div key={model.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={model.id}
                        checked={responses.preferred_models.includes(model.id)}
                        onCheckedChange={() => toggleModel(model.id)}
                      />
                      <Label htmlFor={model.id} className="text-white/90">
                        {model.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_size" className="text-white">
                  Company/Team size (Optional)
                </Label>
                <Select onValueChange={(value) => updateResponse('company_size', value)}>
                  <SelectTrigger className="bg-[#060B16] border-white/10">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual/Freelancer</SelectItem>
                    <SelectItem value="small">Small team (2-10)</SelectItem>
                    <SelectItem value="medium">Medium company (11-100)</SelectItem>
                    <SelectItem value="large">Large company (100+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Final Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Almost done!</h3>
              
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-white">
                  Industry (Optional)
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Education..."
                  value={responses.industry}
                  onChange={(e) => updateResponse('industry', e.target.value)}
                  className="bg-[#060B16] border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specific_needs" className="text-white">
                  Any specific needs or challenges? (Optional)
                </Label>
                <Textarea
                  id="specific_needs"
                  placeholder="Tell us about any specific requirements..."
                  value={responses.specific_needs}
                  onChange={(e) => updateResponse('specific_needs', e.target.value)}
                  className="bg-[#060B16] border-white/10 text-white"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="text-white/70 hover:text-white"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Saving...' : currentStep === 3 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
