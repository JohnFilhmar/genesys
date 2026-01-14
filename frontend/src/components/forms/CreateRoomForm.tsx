'use client';

import { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, CheckCircle2, Check } from 'lucide-react';
import { useCreateRoom } from '@/hooks/useRooms';
import { useQuestions } from '@/hooks/useQuestions';
import { IRoomCreate } from '@/types/models';

interface CreateRoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRoomForm({ open, onOpenChange }: CreateRoomFormProps) {
  const createMutation = useCreateRoom();
  const { data: questionsData, isLoading: loadingQuestions } = useQuestions({ limit: 100 }); // Fetch all questions
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxStudents, setMaxStudents] = useState(100);
  const [timeLimit, setTimeLimit] = useState(60); // Default 60 minutes
  const [showResultsImmediately, setShowResultsImmediately] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allQuestions = useMemo(() => questionsData?.data || [], [questionsData?.data]);

  // Filter questions by search - memoized to prevent infinite loops
  const filteredQuestions = useMemo(() => 
    allQuestions.filter(q => 
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ), [allQuestions, searchQuery]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: IRoomCreate = {
      title,
      description: description || undefined,
      questions: selectedQuestions,
      settings: {
        maxStudents,
        timeLimit,
        showResultsImmediately,
        shuffleQuestions,
      },
    };

    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMaxStudents(100);
    setTimeLimit(60);
    setShowResultsImmediately(false);
    setShuffleQuestions(false);
    setSelectedQuestions([]);
    setSearchQuery('');
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const selectAll = useCallback(() => {
    setSelectedQuestions(filteredQuestions.map(q => q._id));
  }, [filteredQuestions]);

  const deselectAll = useCallback(() => {
    setSelectedQuestions([]);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-bio-50 text-bio-600 border-bio-200';
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'hard': return 'bg-dna-50 text-dna-600 border-dna-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <DialogTitle className="text-2xl font-bold">Create New Room</DialogTitle>
          <DialogDescription className="text-base">
            Setup a new quiz room for your students. Select questions and configure settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-6 overflow-y-auto px-6 py-6 flex-1">
            {/* Basic Info */}
            <div className="space-y-4 bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Room Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cell Biology Quiz - Section A"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the quiz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-white resize-none"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">Room Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents" className="text-sm font-medium">Maximum Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min="1"
                    max="500"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(Number(e.target.value))}
                    className="bg-white"
                  />
                  <p className="text-xs text-slate-500">Set 0 for unlimited</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-medium">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="0"
                    max="240"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="bg-white"
                  />
                  <p className="text-xs text-slate-500">Set 0 for no time limit (max 4 hours)</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div 
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setShuffleQuestions(!shuffleQuestions)}
                >
                  <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border-2 transition-all ${
                    shuffleQuestions
                      ? 'bg-bio-600 border-bio-600'
                      : 'bg-white border-slate-300'
                  } flex items-center justify-center`}>
                    {shuffleQuestions && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="font-medium cursor-pointer text-sm">
                      Shuffle questions
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5">Randomize question order for each student</p>
                  </div>
                </div>

                <div 
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setShowResultsImmediately(!showResultsImmediately)}
                >
                  <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border-2 transition-all ${
                    showResultsImmediately
                      ? 'bg-bio-600 border-bio-600'
                      : 'bg-white border-slate-300'
                  } flex items-center justify-center`}>
                    {showResultsImmediately && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="font-medium cursor-pointer text-sm">
                      Show results immediately
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5">Display results right after student submission</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Selection */}
            <div className="space-y-4 bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">
                    Select Questions
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedQuestions.length} of {allQuestions.length} questions selected
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={selectAll}
                    disabled={loadingQuestions || filteredQuestions.length === 0}
                  >
                    Select All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={deselectAll}
                    disabled={selectedQuestions.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search questions by text or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>

              {/* Question List */}
              <div className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {loadingQuestions ? (
                    <div className="p-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-bio-500" />
                      <p className="text-sm text-slate-600 mt-3">Loading questions...</p>
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {searchQuery ? 'No questions found' : 'No questions available'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {searchQuery ? 'Try a different search term' : 'Create questions first in the Question Bank'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {filteredQuestions.map((question) => (
                        <div
                          key={question._id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                            selectedQuestions.includes(question._id) ? 'bg-bio-50 hover:bg-bio-100' : ''
                          }`}
                          onClick={() => toggleQuestion(question._id)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Custom checkbox - purely visual */}
                            <div className={`mt-1 w-4 h-4 shrink-0 rounded border-2 transition-all ${
                              selectedQuestions.includes(question._id)
                                ? 'bg-bio-600 border-bio-600'
                                : 'bg-white border-slate-300'
                            } flex items-center justify-center`}>
                              {selectedQuestions.includes(question._id) && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 line-clamp-2 mb-2">
                                {question.questionText}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded-md font-medium border ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                  {question.topic.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {question.points} {question.points === 1 ? 'point' : 'points'}
                                </span>
                              </div>
                            </div>
                            {selectedQuestions.includes(question._id) && (
                              <CheckCircle2 className="w-5 h-5 text-bio-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedQuestions.length === 0 && !loadingQuestions && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-amber-600 text-xs font-bold">!</span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">
                    Please select at least one question to create a room
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-white">
            <div className="flex items-center justify-between w-full gap-3">
              <p className="text-xs text-slate-600">
                {selectedQuestions.length > 0 && (
                  <span className="font-medium text-bio-600">
                    {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} ready
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  disabled={createMutation.isPending}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || selectedQuestions.length === 0} 
                  className="bg-bio-600 hover:bg-bio-700 min-w-[140px]"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Room'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
