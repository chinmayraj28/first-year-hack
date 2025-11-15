'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save,
  Clock,
  BookOpen,
  Target,
  CheckCircle
} from "lucide-react";
import { Question } from '@/types';
import Link from 'next/link';

export default function CreateExamPage() {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'multiple-choice',
    difficulty: 'medium',
    maxMarks: 5,
    skillsAssessed: [],
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const subjects = ['Mathematics', 'English Literature', 'Science', 'History', 'Geography'];
  const availableSkills = [
    'equation_solving', 'pattern_recognition', 'logical_reasoning',
    'spatial_reasoning', 'theorem_application', 'proof_construction',
    'text_analysis', 'inference', 'vocabulary', 'creativity',
    'grammar', 'storytelling', 'problem_solving', 'mathematical_application',
    'scientific_reasoning', 'formula_application', 'observation', 'data_analysis'
  ];

  const addQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.correctAnswer) {
      alert('Please fill in the question text and correct answer');
      return;
    }

    const newQuestion: Partial<Question> = {
      ...currentQuestion,
      id: `q${Date.now()}`,
      subject,
      topic: currentQuestion.topic || 'General'
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      difficulty: 'medium',
      maxMarks: 5,
      skillsAssessed: [],
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSkillToggle = (skill: string) => {
    const skills = currentQuestion.skillsAssessed || [];
    if (skills.includes(skill)) {
      setCurrentQuestion({
        ...currentQuestion,
        skillsAssessed: skills.filter(s => s !== skill)
      });
    } else {
      setCurrentQuestion({
        ...currentQuestion,
        skillsAssessed: [...skills, skill]
      });
    }
  };

  const saveExam = () => {
    if (!examTitle || questions.length === 0) {
      alert('Please provide an exam title and add at least one question');
      return;
    }

    const totalMarks = questions.reduce((sum, q) => sum + (q.maxMarks || 0), 0);
    
    const exam = {
      id: `exam_${Date.now()}`,
      title: examTitle,
      description: examDescription,
      subject,
      duration,
      totalMarks,
      questions: questions as Question[],
      createdBy: 'teacher',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    console.log('Saving exam:', exam);
    alert('Exam created successfully! (In a real app, this would be saved to a database)');
    
    // Reset form
    setExamTitle('');
    setExamDescription('');
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create Exam</h1>
            <p className="text-gray-600 mt-2">
              Design a new examination with custom questions and assessments
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Exam Details */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              Basic information about the examination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g., Mathematics Midterm Exam"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                placeholder="Brief description of the exam content and objectives..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="15"
                  max="300"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <span>{questions.length} questions</span>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Target className="h-5 w-5 text-gray-500" />
                <span>{questions.reduce((sum, q) => sum + (q.maxMarks || 0), 0)} total marks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
            <CardDescription>
              Create a new question for the examination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <div>
              <Label htmlFor="questionText">Question Text</Label>
              <textarea
                id="questionText"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                placeholder="Enter the question text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
              />
            </div>

            {/* Question Settings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="questionType">Question Type</Label>
                <select
                  id="questionType"
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="fill-in-blank">Fill in Blank</option>
                </select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={currentQuestion.difficulty}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <Label htmlFor="maxMarks">Max Marks</Label>
                <Input
                  id="maxMarks"
                  type="number"
                  value={currentQuestion.maxMarks}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, maxMarks: Number(e.target.value)})}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={currentQuestion.topic || ''}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, topic: e.target.value})}
                  placeholder="e.g., Algebra"
                />
              </div>
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && (
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({...currentQuestion, options: newOptions});
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant={currentQuestion.correctAnswer === option ? "default" : "outline"}
                        onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: option})}
                      >
                        {currentQuestion.correctAnswer === option ? <CheckCircle className="h-4 w-4" /> : 'Set Correct'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Short Answer/Essay Correct Answer */}
            {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
              <div>
                <Label htmlFor="correctAnswer">
                  {currentQuestion.type === 'essay' ? 'Sample Answer/Keywords' : 'Correct Answer'}
                </Label>
                <textarea
                  id="correctAnswer"
                  value={currentQuestion.correctAnswer as string || ''}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                  placeholder={
                    currentQuestion.type === 'essay' 
                      ? "Provide a sample answer or key points..."
                      : "Enter the exact correct answer..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-20 resize-none"
                />
              </div>
            )}

            {/* Skills Assessment */}
            <div>
              <Label>Skills Assessed</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={(currentQuestion.skillsAssessed || []).includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question to Exam
            </Button>
          </CardContent>
        </Card>

        {/* Questions List */}
        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Exam Questions ({questions.length})</CardTitle>
              <CardDescription>
                Review and manage the questions in your exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">Question {index + 1}</h4>
                        <p className="text-gray-700 mt-1">{question.text}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge variant="outline">{question.difficulty}</Badge>
                        <Badge variant="outline">{question.maxMarks} marks</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {question.type === 'multiple-choice' && question.options && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">Options:</p>
                        <ul className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <li 
                              key={optIndex} 
                              className={`text-sm ${
                                option === question.correctAnswer 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-gray-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {option === question.correctAnswer && ' ✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {question.skillsAssessed && question.skillsAssessed.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {question.skillsAssessed.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Exam */}
        <Card>
          <CardHeader>
            <CardTitle>Save Exam</CardTitle>
            <CardDescription>
              Review the exam details and save when ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{duration} minutes</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold">{questions.reduce((sum, q) => sum + (q.maxMarks || 0), 0)}</div>
                <div className="text-sm text-gray-600">Total Marks</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <CheckCircle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="font-semibold">{subject}</div>
                <div className="text-sm text-gray-600">Subject</div>
              </div>
            </div>

            <Button onClick={saveExam} className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
