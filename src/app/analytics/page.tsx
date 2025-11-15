'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { AnalysisEngine } from '@/lib/analysis';
import { 
  sampleStudents, 
  sampleQuestions, 
  getStudentAttempts,
  getStudentById 
} from '@/data/sampleData';
import { StudentProfile, SkillAssessment, CompetencyArea } from '@/types';
import Link from 'next/link';

export default function Analytics() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
  const [studentProfile, setStudentProfile] = useState<Partial<StudentProfile> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateStudentProfile = () => {
      const student = getStudentById(selectedStudentId);
      if (!student) return;

      const attempts = getStudentAttempts(selectedStudentId);
      const skillsMatrix = AnalysisEngine.analyzeStudentPerformance(attempts, sampleQuestions);
      const subjectAnalyses = AnalysisEngine.analyzeBySubject(attempts, sampleQuestions);
      const competencyAreas = AnalysisEngine.identifyCompetencyAreas(skillsMatrix, attempts);
      const recommendations = AnalysisEngine.generateRecommendations(competencyAreas, subjectAnalyses);

      // Calculate overall performance
      const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0);
      const totalMaxScore = attempts.reduce((sum, attempt) => sum + attempt.maxScore, 0);
      const overallGPA = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 4.0 : 0;

      setStudentProfile({
        student,
        overallGPA,
        subjectAnalyses,
        skillsMatrix,
        recentExamAttempts: attempts
      });
      setLoading(false);
    };

    generateStudentProfile();
  }, [selectedStudentId]);

  const getSkillCategoryColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-green-100 text-green-800';
    if (proficiency >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSkillCategoryIcon = (proficiency: number) => {
    if (proficiency >= 80) return <CheckCircle className="h-4 w-4" />;
    if (proficiency >= 60) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  if (loading || !studentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Student Analytics</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive performance analysis for {studentProfile.student?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              {sampleStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {studentProfile.overallGPA?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Overall GPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {studentProfile.skillsMatrix?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Skills Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {studentProfile.subjectAnalyses?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {studentProfile.recentExamAttempts?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Exams Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment Matrix</CardTitle>
            <CardDescription>
              Detailed breakdown of skill proficiency across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentProfile.skillsMatrix?.map((skill) => (
                <div 
                  key={skill.skillName}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">
                      {skill.skillName.replace(/_/g, ' ')}
                    </h4>
                    {getSkillCategoryIcon(skill.proficiencyLevel)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Proficiency</span>
                      <span className="font-semibold">
                        {skill.proficiencyLevel.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.proficiencyLevel}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{skill.questionsCorrect}/{skill.questionsAttempted} correct</span>
                      <span>{skill.averageTimePerQuestion.toFixed(0)}s avg</span>
                    </div>
                    {skill.improvement !== 0 && (
                      <Badge 
                        variant="outline" 
                        className={skill.improvement > 0 ? 'text-green-600' : 'text-red-600'}
                      >
                        {skill.improvement > 0 ? '+' : ''}{skill.improvement.toFixed(1)}%
                        {skill.improvement > 0 ? <TrendingUp className="h-3 w-3 ml-1" /> : <TrendingDown className="h-3 w-3 ml-1" />}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Analysis</CardTitle>
            <CardDescription>
              Performance breakdown by subject and topic areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {studentProfile.subjectAnalyses?.map((subject) => (
                <div key={subject.subjectName} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{subject.subjectName}</h3>
                      <p className="text-gray-600">
                        Overall Score: <span className="font-semibold">{subject.overallScore.toFixed(1)}%</span>
                      </p>
                    </div>
                    <Badge 
                      className={subject.overallScore >= 80 ? 'bg-green-100 text-green-800' : 
                                subject.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                    >
                      {subject.overallScore >= 80 ? 'Excellent' : 
                       subject.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>

                  {/* Topic Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {subject.topicBreakdown.map((topic) => (
                      <div key={topic.topicName} className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">{topic.topicName}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-semibold">{topic.score.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${topic.score}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600">
                            {topic.questionsAttempted} questions • {Math.floor(topic.timeSpent / 60)}m {topic.timeSpent % 60}s spent
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths and Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {subject.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {subject.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {subject.recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded">
                      <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {subject.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-blue-700">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Exam Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam Performance</CardTitle>
            <CardDescription>
              Timeline of recent examination attempts and scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProfile.recentExamAttempts?.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Exam ID: {attempt.examId}</h4>
                    <p className="text-sm text-gray-600">
                      Completed on {new Date(attempt.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {attempt.totalScore}/{attempt.maxScore}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((attempt.totalScore || 0) / attempt.maxScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="ml-4">
                    <Badge 
                      className={
                        (attempt.totalScore || 0) / attempt.maxScore >= 0.8 ? 'bg-green-100 text-green-800' :
                        (attempt.totalScore || 0) / attempt.maxScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {(attempt.totalScore || 0) / attempt.maxScore >= 0.8 ? 'Excellent' :
                       (attempt.totalScore || 0) / attempt.maxScore >= 0.6 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
