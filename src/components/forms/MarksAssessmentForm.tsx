'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, X, Loader2 } from 'lucide-react';
import { analyzeAdvancedAssessment, AdvancedAnalysisRequest } from '@/lib/api-client';

interface SubjectAssessment {
  subjectName: string;
  obtainedMarks: number;
  totalMarks: number;
  assessmentParameters: {
    conceptualUnderstanding: number;
    recall: number;
    logicalReasoning: number;
    attemptsBonusQuestions: number;
    effortNonConservative: number;
  };
}

interface MarksAssessmentFormProps {
  studentName: string;
  grade: string;
  onSubmit: (data: { subjectAssessments: SubjectAssessment[]; apiAnalysisResult: any }) => void;
  onCancel: () => void;
}

const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English'];

export default function MarksAssessmentForm({
  studentName,
  grade,
  onSubmit,
  onCancel,
}: MarksAssessmentFormProps) {
  const [subjects, setSubjects] = useState<SubjectAssessment[]>(
    DEFAULT_SUBJECTS.map(subj => ({
      subjectName: subj,
      obtainedMarks: 0,
      totalMarks: 100,
      assessmentParameters: {
        conceptualUnderstanding: 3,
        recall: 3,
        logicalReasoning: 3,
        attemptsBonusQuestions: 3,
        effortNonConservative: 3,
      },
    }))
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        subjectName: '',
        obtainedMarks: 0,
        totalMarks: 100,
        assessmentParameters: {
          conceptualUnderstanding: 3,
          recall: 3,
          logicalReasoning: 3,
          attemptsBonusQuestions: 3,
          effortNonConservative: 3,
        },
      },
    ]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: string, value: any) => {
    const updated = [...subjects];
    if (field.startsWith('param.')) {
      const paramField = field.replace('param.', '');
      updated[index] = {
        ...updated[index],
        assessmentParameters: {
          ...updated[index].assessmentParameters,
          [paramField]: value,
        },
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setSubjects(updated);
  };

  const handleSubmit = async () => {
    // Validate
    if (subjects.length === 0) {
      alert('Please add at least one subject');
      return;
    }

    if (subjects.some(s => !s.subjectName.trim() || s.obtainedMarks < 0 || s.totalMarks <= 0)) {
      alert('Please fill in all subject details correctly');
      return;
    }

    if (subjects.some(s => 
      s.assessmentParameters.conceptualUnderstanding < 1 || s.assessmentParameters.conceptualUnderstanding > 5 ||
      s.assessmentParameters.recall < 1 || s.assessmentParameters.recall > 5 ||
      s.assessmentParameters.logicalReasoning < 1 || s.assessmentParameters.logicalReasoning > 5 ||
      s.assessmentParameters.attemptsBonusQuestions < 1 || s.assessmentParameters.attemptsBonusQuestions > 5 ||
      s.assessmentParameters.effortNonConservative < 1 || s.assessmentParameters.effortNonConservative > 5
    )) {
      alert('All assessment parameters must be between 1-5');
      return;
    }

    setIsAnalyzing(true);
    try {
      const apiRequest: AdvancedAnalysisRequest = {
        studentName,
        grade,
        subjectAssessments: subjects.map(s => ({
          subjectName: s.subjectName,
          obtainedMarks: s.obtainedMarks,
          totalMarks: s.totalMarks,
          assessmentParameters: {
            conceptualUnderstanding: s.assessmentParameters.conceptualUnderstanding,
            recall: s.assessmentParameters.recall,
            logicalReasoning: s.assessmentParameters.logicalReasoning,
            attemptsBonusQuestions: s.assessmentParameters.attemptsBonusQuestions,
            effortNonConservative: s.assessmentParameters.effortNonConservative,
          },
        })),
      };

      const result = await analyzeAdvancedAssessment(apiRequest);
      
      console.log('[MarksAssessmentForm] API result:', result);
      
      if (!result.success) {
        console.warn('[MarksAssessmentForm] API failed, but saving report anyway:', result.error);
        // Still save the report with the input data, even if API fails
        onSubmit({ subjectAssessments: subjects, apiAnalysisResult: { error: result.error, success: false } });
        alert(`API Analysis failed: ${result.error}. Report saved with input data.`);
        return;
      }

      // API succeeded - save with full response
      console.log('[MarksAssessmentForm] API succeeded, saving with response:', result.data);
      onSubmit({ subjectAssessments: subjects, apiAnalysisResult: result.data });
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert(`Error during analysis: ${error.message}. Saving report without analysis.`);
      onSubmit({ subjectAssessments: subjects, apiAnalysisResult: null });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
      <CardHeader>
        <CardTitle className="text-white">Marks & Assessment (Grade 6+)</CardTitle>
        <CardDescription className="text-white/70">
          Enter marks and rate 5 factors (1-5 scale) for {studentName} ({grade})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subjects.map((subject, index) => (
          <div key={index} className="space-y-4 p-4 bg-background/30 rounded-lg border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/90">Subject {index + 1}</Label>
              {subjects.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubject(index)}
                  className="text-white/70 hover:text-white h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Subject Name *</Label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={subject.subjectName}
                  onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
                  className="bg-background/30 border-border/40 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Obtained Marks *</Label>
                <Input
                  type="number"
                  min="0"
                  max={subject.totalMarks}
                  value={subject.obtainedMarks === 0 ? '' : subject.obtainedMarks}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty string for clearing
                    if (inputValue === '') {
                      updateSubject(index, 'obtainedMarks', 0);
                      return;
                    }
                    const numValue = parseFloat(inputValue);
                    // Check if it's a valid number
                    if (isNaN(numValue)) {
                      return; // Don't update if invalid
                    }
                    // Ensure non-negative and not more than total marks
                    if (numValue < 0) {
                      return; // Don't allow negative
                    }
                    const clampedValue = Math.min(numValue, subject.totalMarks);
                    updateSubject(index, 'obtainedMarks', clampedValue);
                  }}
                  onKeyDown={(e) => {
                    // Prevent negative sign, 'e', 'E', and '+' keys
                    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  className="bg-background/30 border-border/40 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 text-sm">Total Marks *</Label>
                <Input
                  type="number"
                  min="1"
                  value={subject.totalMarks}
                  onChange={(e) => updateSubject(index, 'totalMarks', parseFloat(e.target.value) || 100)}
                  className="bg-background/30 border-border/40 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/30">
              <Label className="text-white/70 text-sm">Assessment Parameters (Rate 1-5)</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'conceptualUnderstanding', label: 'Conceptual Understanding' },
                  { key: 'recall', label: 'Recall' },
                  { key: 'logicalReasoning', label: 'Logical Reasoning' },
                  { key: 'attemptsBonusQuestions', label: 'Attempts Bonus Questions' },
                  { key: 'effortNonConservative', label: 'Effort (Non-Conservative)' },
                ].map((param) => (
                  <div key={param.key} className="space-y-1">
                    <Label className="text-white/60 text-xs">{param.label}</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <Button
                          key={score}
                          type="button"
                          variant={subject.assessmentParameters[param.key as keyof typeof subject.assessmentParameters] === score ? 'default' : 'outline'}
                          onClick={() => updateSubject(index, `param.${param.key}`, score)}
                          className={`h-7 w-7 p-0 text-xs ${
                            subject.assessmentParameters[param.key as keyof typeof subject.assessmentParameters] === score
                              ? 'bg-primary text-white'
                              : 'text-white/70 border-border/40 hover:bg-primary/20'
                          }`}
                        >
                          {score}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addSubject}
          className="w-full text-white/70 border-border/40 hover:bg-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Submit & Analyze'
            )}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isAnalyzing}
            className="flex-1 text-white/70 border-border/40 hover:bg-primary/20 disabled:opacity-50"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

