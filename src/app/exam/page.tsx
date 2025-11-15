'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Timer,
  Users,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { sampleExams, sampleStudents } from '@/data/sampleData';
import { Question, StudentAnswer, ExamAttempt } from '@/types';
import Link from 'next/link';

export default function ExamPage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeSpent, setTimeSpent] = useState<{ [questionId: string]: number }>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);

  const currentExam = sampleExams.find(exam => exam.id === selectedExam);
  const currentQuestion = currentExam?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (currentExam?.questions.length || 0) - 1;

  // Timer effect for tracking time spent on each question
  useEffect(() => {
    if (!examStarted || !currentQuestion || !questionStartTime) return;

    const interval = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - questionStartTime.getTime()) / 1000);
      setTimeSpent(prev => ({
        ...prev,
        [currentQuestion.id]: timeElapsed
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, currentQuestion, questionStartTime]);

  const handleStartExam = () => {
    setExamStarted(true);
    setStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion!.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (currentExam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(new Date());
    }
  };

  const calculateScore = () => {
    if (!currentExam) return 0;
    
    let totalScore = 0;
    
    currentExam.questions.forEach(question => {
      const studentAnswer = answers[question.id];
      if (studentAnswer && question.correctAnswer) {
        if (question.type === 'multiple-choice') {
          if (studentAnswer === question.correctAnswer) {
            totalScore += question.maxMarks;
          }
        } else if (question.type === 'short-answer') {
          if (studentAnswer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()) {
            totalScore += question.maxMarks;
          }
        } else {
          // For essay questions, give partial credit based on length and keywords
          const wordCount = studentAnswer.split(' ').length;
          if (wordCount >= 20) {
            totalScore += Math.floor(question.maxMarks * 0.7); // 70% for effort
          }
        }
      }
    });
    
    return totalScore;
  };

  const handleSubmitExam = () => {
    const score = calculateScore();
    const endTime = new Date();
    
    // Create exam attempt record
    const examAttempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      examId: selectedExam!,
      studentId: selectedStudent,
      startTime: startTime!.toISOString(),
      endTime: endTime.toISOString(),
      status: 'completed',
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        timeSpent: timeSpent[questionId] || 0
      })),
      totalScore: score,
      maxScore: currentExam?.totalMarks || 0
    };

    setExamResult({
      score,
      maxScore: currentExam?.totalMarks || 0,
      percentage: (score / (currentExam?.totalMarks || 1)) * 100,
      timeTaken: Math.floor((endTime.getTime() - startTime!.getTime()) / 1000 / 60),
      questionsAnswered: Object.keys(answers).length,
      totalQuestions: currentExam?.questions.length || 0
    });

    setExamCompleted(true);
  };

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Take Exam</h1>
              <p className="text-gray-600 mt-2">
                Select an exam to begin your assessment
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>

          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <select 
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                {sampleStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.grade}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Available Exams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleExams.filter(exam => exam.isActive).map(exam => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {exam.title}
                    <Badge variant="outline">{exam.subject}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span>{exam.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span>{exam.totalMarks} marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Subject: {exam.subject}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedExam(exam.id)}
                  >
                    Start Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h1 className="text-4xl font-bold text-gray-900">Exam Completed!</h1>
            <p className="text-gray-600">
              Great job! Here are your results for {currentExam?.title}
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600">
                  {examResult.percentage.toFixed(1)}%
                </div>
                <div className="text-gray-600 mt-2">
                  {examResult.score}/{examResult.maxScore} marks
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{examResult.timeTaken} minutes</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">
                    {examResult.questionsAnswered}/{examResult.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance Level</span>
                  <span className="font-semibold">
                    {examResult.percentage >= 80 ? 'Excellent' :
                     examResult.percentage >= 70 ? 'Good' :
                     examResult.percentage >= 60 ? 'Fair' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${examResult.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setSelectedExam(null);
                    setExamStarted(false);
                    setExamCompleted(false);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setTimeSpent({});
                  }}
                >
                  Take Another Exam
                </Button>
                <Link href="/analytics" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
              <CardDescription>
                Please review the exam details before beginning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{currentExam?.title}</h3>
                <p className="text-gray-600">{currentExam?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <Clock className="h-6 w-6 text-gray-600 mb-2" />
                  <div className="font-semibold">{currentExam?.duration} minutes</div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <BookOpen className="h-6 w-6 text-gray-600 mb-2" />
                  <div className="font-semibold">{currentExam?.questions.length} questions</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <AlertCircle className="h-5 w-5 text-yellow-600 inline mr-2" />
                <span className="text-yellow-800">
                  Make sure you have a stable internet connection and won't be interrupted.
                </span>
              </div>

              <Button onClick={handleStartExam} className="w-full">
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{currentExam?.title}</h1>
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {currentExam?.questions.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                Time on question: {timeSpent[currentQuestion?.id || ''] || 0}s
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / (currentExam?.questions.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        {currentQuestion && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    {currentQuestion.maxMarks} marks • {currentQuestion.difficulty} difficulty
                  </CardDescription>
                </div>
                <Badge variant="outline">{currentQuestion.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg">{currentQuestion.text}</div>

              {/* Answer Input */}
              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : currentQuestion.type === 'short-answer' ? (
                  <Input
                    placeholder="Enter your answer..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <textarea
                    placeholder="Write your detailed answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md resize-none"
                  />
                )}
              </div>

              {/* Skills Info */}
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-blue-800 mb-1">Skills Assessed:</div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.skillsAssessed.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="space-x-4">
                {!isLastQuestion ? (
                  <Button onClick={handleNextQuestion}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitExam} className="bg-green-600 hover:bg-green-700">
                    Submit Exam
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {currentExam?.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setQuestionStartTime(new Date());
                  }}
                  className={`
                    w-10 h-10 rounded border-2 text-sm font-medium transition-all
                    ${index === currentQuestionIndex 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : answers[currentExam.questions[index].id]
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
