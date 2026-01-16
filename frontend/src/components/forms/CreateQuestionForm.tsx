'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/useQuestions';
import { QuestionType, QuestionTopic, QuestionDifficulty, IQuestionCreate, IQuestion } from '@/types/models';

interface CreateQuestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  initialData?: IQuestion;
}

export default function CreateQuestionForm({ open, onOpenChange, editMode = false, initialData }: CreateQuestionFormProps) {
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Form state
  const [questionText, setQuestionText] = useState(initialData?.questionText || '');
  const [questionType, setQuestionType] = useState<QuestionType>(initialData?.questionType || QuestionType.MULTIPLE_CHOICE);
  const [topic, setTopic] = useState<QuestionTopic>(initialData?.topic || QuestionTopic.GENETIC_ENGINEERING);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(initialData?.difficulty || QuestionDifficulty.MEDIUM);
  const [points, setPoints] = useState(initialData?.points || 1);

  // Type-specific state
  const [choices, setChoices] = useState(initialData?.choices || [{ text: '', isCorrect: false }]);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | string[]>(
    initialData?.correctAnswer ?? (initialData?.questionType === QuestionType.FILL_IN_BLANK ? [''] : true)
  );
  const [pairs, setPairs] = useState(initialData?.pairs || [{ left: '', right: '' }]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(
    Array.isArray(initialData?.correctAnswer) ? initialData.correctAnswer : [''] 
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseData: IQuestionCreate = {
      questionText,
      questionType,
      topic,
      difficulty,
      points,
    };

    // Add type-specific fields
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
      baseData.choices = choices;
    } else if (questionType === QuestionType.TRUE_FALSE) {
      baseData.correctAnswer = correctAnswer as boolean;
    } else if (questionType === QuestionType.MATCHING) {
      baseData.pairs = pairs;
    } else if (questionType === QuestionType.FILL_IN_BLANK) {
      baseData.correctAnswer = correctAnswers;
    }

    try {
      if (editMode && initialData) {
        await updateMutation.mutateAsync({ id: initialData._id, data: baseData });
      } else {
        await createMutation.mutateAsync(baseData);
      }
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setQuestionType(QuestionType.MULTIPLE_CHOICE);
    setTopic(QuestionTopic.GENETIC_ENGINEERING);
    setDifficulty(QuestionDifficulty.MEDIUM);
    setPoints(1);
    setChoices([{ text: '', isCorrect: false }]);
    setCorrectAnswer(true);
    setPairs([{ left: '', right: '' }]);
    setCorrectAnswers(['']);
  };

  const addOption = () => {
    setChoices([...choices, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, text: string) => {
    const newChoices = [...choices];
    newChoices[index].text = text;
    setChoices(newChoices);
  };

  const toggleCorrectOption = (index: number) => {
    const newChoices = [...choices];
    newChoices[index].isCorrect = !newChoices[index].isCorrect;
    setChoices(newChoices);
  };

  const addPair = () => {
    setPairs([...pairs, { left: '', right: '' }]);
  };

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  const updatePair = (index: number, side: 'left' | 'right', value: string) => {
    const newPairs = [...pairs];
    newPairs[index][side] = value;
    setPairs(newPairs);
  };

  const addCorrectAnswer = () => {
    setCorrectAnswers([...correctAnswers, '']);
  };

  const removeCorrectAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    const newAnswers = [...correctAnswers];
    newAnswers[index] = value;
    setCorrectAnswers(newAnswers);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <DialogTitle>{editMode ? 'Edit Question' : 'Create New Question'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Update the question details below.' : 'Add a new question to your question bank.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text *</Label>
            <Textarea
              id="questionText"
              placeholder="Enter your question..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              rows={3}
            />
          </div>

          {/* Type, Topic, Difficulty - Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionType">Question Type *</Label>
              <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                <SelectTrigger id="questionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                  <SelectItem value={QuestionType.MATCHING}>Matching</SelectItem>
                  <SelectItem value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</SelectItem>
                  <SelectItem value={QuestionType.SHORT_ANSWER}>Short Answer</SelectItem>
                  <SelectItem value={QuestionType.ESSAY}>Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuestionDifficulty)}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                  <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Select value={topic} onValueChange={(value) => setTopic(value as QuestionTopic)}>
                <SelectTrigger id="topic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={QuestionTopic.GENETIC_ENGINEERING}>Genetic Engineering</SelectItem>
                  <SelectItem value={QuestionTopic.RECOMBINANT_DNA_TECHNOLOGY}>Recombinant DNA Technology</SelectItem>
                  <SelectItem value={QuestionTopic.GEOLOGIC_TIMELINE}>Geologic Timeline</SelectItem>
                  <SelectItem value={QuestionTopic.MECHANISMS_OF_EVOLUTION}>Mechanisms of Evolution</SelectItem>
                  <SelectItem value={QuestionTopic.DESCENT_WITH_MODIFICATION}>Descent with Modification</SelectItem>
                  <SelectItem value={QuestionTopic.DEVELOPMENT_OF_EVOLUTIONARY_THOUGHT}>Development of Evolutionary Thought</SelectItem>
                  <SelectItem value={QuestionTopic.OTHERS}>Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="points">Points *</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              required
            />
          </div>

          {/* Type-specific fields */}
          {questionType === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
              {choices.map((option, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={() => toggleCorrectOption(index)}
                    className="mt-3"
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1"
                    required
                  />
                  {choices.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="mt-1"
                    >
                      <Trash2 className="w-4 h-4 text-dna-500" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-500">Check the box to mark correct answers (multiple can be correct)</p>
            </div>
          )}

          {questionType === QuestionType.TRUE_FALSE && (
            <div className="space-y-4 border-t pt-4">
              <Label>Correct Answer</Label>
              <RadioGroup value={correctAnswer.toString()} onValueChange={(v) => setCorrectAnswer(v === 'true')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="font-normal cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="font-normal cursor-pointer">False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {questionType === QuestionType.MATCHING && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Matching Pairs</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPair}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pair
                </Button>
              </div>
              {pairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Left side"
                    value={pair.left}
                    onChange={(e) => updatePair(index, 'left', e.target.value)}
                    required
                  />
                  <span className="text-slate-400">↔</span>
                  <Input
                    placeholder="Right side"
                    value={pair.right}
                    onChange={(e) => updatePair(index, 'right', e.target.value)}
                    required
                  />
                  {pairs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePair(index)}
                    >
                      <Trash2 className="w-4 h-4 text-dna-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {questionType === QuestionType.FILL_IN_BLANK && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Correct Answers</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCorrectAnswer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Answer
                </Button>
              </div>
              {correctAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Acceptable answer ${index + 1}`}
                    value={answer}
                    onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                    required
                  />
                  {correctAnswers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCorrectAnswer(index)}
                    >
                      <Trash2 className="w-4 h-4 text-dna-500" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-500">Add multiple acceptable answers (case-insensitive matching)</p>
            </div>
          )}

          {(questionType === QuestionType.SHORT_ANSWER || questionType === QuestionType.ESSAY) && (
            <div className="border-t pt-4">
              <p className="text-sm text-slate-500">
                This question type requires manual grading. Students will submit text responses.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-bio-600 hover:bg-bio-700">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Question' : 'Create Question'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
