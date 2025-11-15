'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface QuestionnaireItem {
  question: string;
  score: number; // 1-5
}

interface QuestionnaireFormProps {
  studentName: string;
  grade: string;
  onSubmit: (data: { questionnaireData: QuestionnaireItem[] }) => void;
  onCancel: () => void;
}

const DEFAULT_QUESTIONS = [
  'How well does the student follow instructions?',
  'How engaged is the student during activities?',
  'How well does the student interact with peers?',
  'How well does the student express themselves?',
  'How well does the student demonstrate fine motor skills?',
];

export default function QuestionnaireForm({
  studentName,
  grade,
  onSubmit,
  onCancel,
}: QuestionnaireFormProps) {
  const [questions, setQuestions] = useState<QuestionnaireItem[]>(
    DEFAULT_QUESTIONS.map(q => ({ question: q, score: 3 }))
  );

  const addQuestion = () => {
    setQuestions([...questions, { question: '', score: 3 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: 'question' | 'score', value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = () => {
    // Validate all questions are filled
    if (questions.some(q => !q.question.trim() || q.score < 1 || q.score > 5)) {
      alert('Please fill in all questions and ensure scores are between 1-5');
      return;
    }
    onSubmit({ questionnaireData: questions });
  };

  return (
    <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
      <CardHeader>
        <CardTitle className="text-white">Questionnaire Assessment (LKG - Grade 2)</CardTitle>
        <CardDescription className="text-white/70">
          Rate each aspect on a scale of 1-5 for {studentName} ({grade})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((item, index) => (
          <div key={index} className="space-y-2 p-4 bg-background/30 rounded-lg border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/90">Question {index + 1}</Label>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  className="text-white/70 hover:text-white h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              placeholder="Enter question"
              value={item.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              className="bg-background/30 border-border/40 text-white placeholder:text-white/50 mb-2"
            />
            <div className="flex items-center gap-4">
              <Label className="text-white/70 text-sm">Score (1-5):</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <Button
                    key={score}
                    type="button"
                    variant={item.score === score ? 'default' : 'outline'}
                    onClick={() => updateQuestion(index, 'score', score)}
                    className={`h-8 w-8 p-0 ${
                      item.score === score
                        ? 'bg-primary text-white'
                        : 'text-white/70 border-border/40 hover:bg-primary/20'
                    }`}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full text-white/70 border-border/40 hover:bg-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white hover:bg-primary/90"
          >
            Submit Assessment
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 text-white/70 border-border/40 hover:bg-primary/20"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

