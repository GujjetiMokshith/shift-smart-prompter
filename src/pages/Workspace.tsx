
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EnhancedPrompt {
  id: string;
  original_prompt: string;
  enhanced_prompt: string;
  model_used: string;
  created_at: string;
}

interface UserProfile {
  plan_type: string;
  prompts_used: number;
}

const Workspace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<EnhancedPrompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoadData = async () => {
      try {
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            toast.error('Authentication error. Please sign in again.');
            navigate('/');
          }
          return;
        }

        if (!session?.user) {
          console.log('No authenticated user found, redirecting to home');
          if (isMounted) {
            toast.error('Please sign in to access the workspace');
            navigate('/');
          }
          return;
        }

        if (isMounted) {
          setUser(session.user);
          setAuthChecked(true);
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          toast.error('Failed to authenticate. Please try again.');
          navigate('/');
        }
      }
    };

    checkAuthAndLoadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed in workspace:', event, session?.user?.email);
      
      if (!session?.user && isMounted) {
        console.log('User signed out, redirecting to home');
        navigate('/');
        return;
      }

      if (session?.user && isMounted) {
        setUser(session.user);
        setAuthChecked(true);
        if (event === 'SIGNED_IN') {
          // Defer data fetching to prevent potential issues
          setTimeout(() => {
            if (isMounted) {
              fetchUserData(session.user.id);
            }
          }, 100);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan_type, prompts_used')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ 
              id: userId, 
              plan_type: 'free', 
              prompts_used: 0 
            });
          
          if (insertError) {
            console.error('Failed to create profile:', insertError);
            toast.error('Failed to initialize user profile');
          } else {
            setUserProfile({ plan_type: 'free', prompts_used: 0 });
          }
        } else {
          toast.error('Failed to load user profile');
        }
      } else {
        setUserProfile(profile);
      }

      // Fetch saved prompts
      const { data: prompts, error: promptsError } = await supabase
        .from('enhanced_prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (promptsError) {
        console.error('Prompts error:', promptsError);
        toast.error('Failed to load saved prompts');
      } else {
        setSavedPrompts(prompts || []);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('enhanced_prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      setSavedPrompts(prev => prev.filter(p => p.id !== promptId));
      if (activePrompt === promptId) {
        setActivePrompt(null);
      }
      toast.success('Prompt deleted successfully');
    } catch (error: any) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  const canCreateNewPrompt = () => {
    if (!userProfile) return false;
    if (userProfile.plan_type === 'free') {
      return userProfile.prompts_used < 5; // Free tier limit
    }
    return true; // Pro and Enterprise have unlimited
  };

  const getUsageInfo = () => {
    if (!userProfile) return '';
    if (userProfile.plan_type === 'free') {
      return `${userProfile.prompts_used}/5 prompts used today`;
    }
    return `${userProfile.prompts_used} prompts used`;
  };

  // Show loading state while checking authentication
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="loading-container">
            <div className="neo-blur p-8 rounded-2xl text-center">
              <div className="loading-spinner mb-4" />
              <p className="text-blue-400">Loading workspace...</p>
              <p className="text-sm text-white/50 mt-2">Authenticating and loading your data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-white/70 mb-6">Please sign in to access your workspace</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-800 hover:bg-blue-700"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 p-6 flex flex-col bg-[#030712]/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gradient-blue">Your Prompts</h2>
            <div className="text-xs text-white/50">
              {getUsageInfo()}
            </div>
          </div>
          
          <Button 
            className={`w-full bg-blue-800 hover:bg-blue-700 text-white mb-6 hover-glow ${
              !canCreateNewPrompt() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canCreateNewPrompt()}
            onClick={() => setActivePrompt(null)}
          >
            <Plus className="h-4 w-4 mr-2" /> New Enhancement
          </Button>

          {!canCreateNewPrompt() && userProfile?.plan_type === 'free' && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
              <p className="text-xs text-blue-400">
                Daily limit reached. Upgrade to Pro for unlimited enhancements.
              </p>
            </div>
          )}
          
          <div className="space-y-2 flex-1 overflow-y-auto prompt-chat-scrollbar">
            {savedPrompts.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No prompts yet</p>
                <p className="text-xs">Create your first enhancement</p>
              </div>
            ) : (
              savedPrompts.map(prompt => (
                <div
                  key={prompt.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    activePrompt === prompt.id 
                      ? "bg-blue-800/20 border border-blue-600/30" 
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                  onClick={() => setActivePrompt(prompt.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-3 w-3 text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-blue-400 font-medium">{prompt.model_used}</span>
                      </div>
                      <p className="text-sm text-white/90 line-clamp-2 mb-1">
                        {prompt.original_prompt.substring(0, 80)}...
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePrompt(prompt.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto h-full">
            <div className="bolt-card h-full overflow-hidden">
              <ChatContainer 
                activePromptId={activePrompt}
                onPromptSaved={(prompt) => {
                  setSavedPrompts(prev => [prompt, ...prev]);
                  setActivePrompt(prompt.id);
                  // Refresh user profile to update usage count
                  if (user) {
                    fetchUserData(user.id);
                  }
                }}
                userProfile={userProfile}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
