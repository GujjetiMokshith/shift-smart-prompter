
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

interface CustomInstruction {
  id: string;
  title: string;
  instructions: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CustomInstructions: React.FC = () => {
  const [instructions, setInstructions] = useState<CustomInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newInstruction, setNewInstruction] = useState({
    title: '',
    instructions: ''
  });

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('custom_instructions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstructions(data || []);
    } catch (error) {
      console.error('Error loading custom instructions:', error);
      toast.error('Failed to load custom instructions');
    } finally {
      setLoading(false);
    }
  };

  const createInstruction = async () => {
    if (!newInstruction.title.trim() || !newInstruction.instructions.trim()) {
      toast.error('Please fill in both title and instructions');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('custom_instructions')
        .insert({
          user_id: user.id,
          title: newInstruction.title,
          instructions: newInstruction.instructions,
          is_active: true
        });

      if (error) throw error;

      toast.success('Custom instruction created successfully');
      setNewInstruction({ title: '', instructions: '' });
      setShowCreateDialog(false);
      loadInstructions();
    } catch (error) {
      console.error('Error creating instruction:', error);
      toast.error('Failed to create custom instruction');
    }
  };

  const updateInstruction = async (id: string, updates: Partial<CustomInstruction>) => {
    try {
      const { error } = await supabase
        .from('custom_instructions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Instruction updated successfully');
      loadInstructions();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating instruction:', error);
      toast.error('Failed to update instruction');
    }
  };

  const deleteInstruction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_instructions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Instruction deleted successfully');
      loadInstructions();
    } catch (error) {
      console.error('Error deleting instruction:', error);
      toast.error('Failed to delete instruction');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await updateInstruction(id, { is_active: isActive });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Custom Instructions</h2>
          <p className="text-white/70">
            Create personalized instructions to enhance your AI interactions
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Instruction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#050A14] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Create Custom Instruction</DialogTitle>
              <DialogDescription className="text-white/70">
                Add a new custom instruction to personalize your AI experience
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Writing Style, Code Review, etc."
                  value={newInstruction.title}
                  onChange={(e) => setNewInstruction(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-[#060B16] border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-white">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Describe how the AI should behave or respond..."
                  value={newInstruction.instructions}
                  onChange={(e) => setNewInstruction(prev => ({ ...prev, instructions: e.target.value }))}
                  className="bg-[#060B16] border-white/10 text-white min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateDialog(false)}
                  className="text-white/70 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createInstruction}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {instructions.length === 0 ? (
        <Card className="bolt-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-white/70 text-center mb-4">
              No custom instructions yet. Create your first one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {instructions.map((instruction) => (
            <Card key={instruction.id} className="bolt-card hover-border-glow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    {editingId === instruction.id ? (
                      <Input
                        value={instruction.title}
                        onChange={(e) => setInstructions(prev => 
                          prev.map(inst => 
                            inst.id === instruction.id 
                              ? { ...inst, title: e.target.value }
                              : inst
                          )
                        )}
                        className="bg-[#060B16] border-white/10 text-white"
                      />
                    ) : (
                      <CardTitle className="text-white">{instruction.title}</CardTitle>
                    )}
                    <CardDescription className="text-white/50">
                      Created {new Date(instruction.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={instruction.is_active}
                    onCheckedChange={(checked) => toggleActive(instruction.id, checked)}
                  />
                  
                  {editingId === instruction.id ? (
                    <Button
                      size="sm"
                      onClick={() => updateInstruction(instruction.id, instruction)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(instruction.id)}
                      className="text-white/70 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteInstruction(instruction.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {editingId === instruction.id ? (
                  <Textarea
                    value={instruction.instructions}
                    onChange={(e) => setInstructions(prev => 
                      prev.map(inst => 
                        inst.id === instruction.id 
                          ? { ...inst, instructions: e.target.value }
                          : inst
                      )
                    )}
                    className="bg-[#060B16] border-white/10 text-white min-h-[100px]"
                  />
                ) : (
                  <p className="text-white/90 whitespace-pre-wrap">
                    {instruction.instructions}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomInstructions;
