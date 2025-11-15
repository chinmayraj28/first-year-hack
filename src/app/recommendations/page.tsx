'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  TrendingUp,
  BookOpen,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Play,
  FileText,
  Video,
  PenTool
} from "lucide-react";
import { AnalysisEngine } from '@/lib/analysis';
import { 
  sampleStudents, 
  sampleQuestions, 
  getStudentAttempts,
  getStudentById 
} from '@/data/sampleData';
import { LearningRecommendation } from '@/types';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = () => {
      const student = getStudentById(selectedStudentId);
      if (!student) return;

      const attempts = getStudentAttempts(selectedStudentId);
      const skillsMatrix = AnalysisEngine.analyzeStudentPerformance(attempts, sampleQuestions);
      const subjectAnalyses = AnalysisEngine.analyzeBySubject(attempts, sampleQuestions);
      const competencyAreas = AnalysisEngine.identifyCompetencyAreas(skillsMatrix, attempts);
      
      const baseRecommendations = AnalysisEngine.generateRecommendations(competencyAreas, subjectAnalyses);
      
      // Enhanced recommendations with more detailed resources
      const enhancedRecommendations: LearningRecommendation[] = [
        ...baseRecommendations,
        // Mathematics recommendations
        {
          type: 'practice',
          priority: 'high',
          subject: 'Mathematics',
          topic: 'Algebra',
          description: 'Practice solving linear equations and factoring expressions',
          estimatedTime: 45,
          resources: [
            { type: 'video', title: 'Linear Equations Masterclass', url: '#' },
            { type: 'exercise', title: 'Equation Solving Practice Set' },
            { type: 'quiz', title: 'Algebra Skills Assessment' }
          ]
        },
        {
          type: 'review',
          priority: 'medium',
          subject: 'Mathematics',
          topic: 'Geometry',
          description: 'Review area and perimeter formulas for different shapes',
          estimatedTime: 30,
          resources: [
            { type: 'article', title: 'Geometry Formulas Quick Reference' },
            { type: 'exercise', title: 'Shape Properties Worksheet' }
          ]
        },
        // English recommendations
        {
          type: 'practice',
          priority: 'high',
          subject: 'English Literature',
          topic: 'Reading Comprehension',
          description: 'Improve reading comprehension and text analysis skills',
          estimatedTime: 60,
          resources: [
            { type: 'article', title: 'Reading Strategies Guide' },
            { type: 'exercise', title: 'Comprehension Practice Passages' },
            { type: 'video', title: 'Text Analysis Techniques' }
          ]
        },
        {
          type: 'advance',
          priority: 'medium',
          subject: 'English Literature',
          topic: 'Creative Writing',
          description: 'Explore advanced creative writing techniques',
          estimatedTime: 90,
          resources: [
            { type: 'video', title: 'Creative Writing Workshop' },
            { type: 'exercise', title: 'Story Writing Prompts' }
          ]
        },
        // Science recommendations
        {
          type: 'practice',
          priority: 'medium',
          subject: 'Science',
          topic: 'Physics',
          description: 'Practice force and motion calculations',
          estimatedTime: 40,
          resources: [
            { type: 'video', title: 'Newton\'s Laws Explained' },
            { type: 'exercise', title: 'Physics Problem Sets' },
            { type: 'quiz', title: 'Force and Motion Quiz' }
          ]
        },
        {
          type: 'review',
          priority: 'low',
          subject: 'Science',
          topic: 'Chemistry',
          description: 'Review chemical formulas and basic reactions',
          estimatedTime: 25,
          resources: [
            { type: 'article', title: 'Common Chemical Formulas' },
            { type: 'exercise', title: 'Formula Practice' }
          ]
        }
      ];

      setRecommendations(enhancedRecommendations);
      setLoading(false);
    };

    generateRecommendations();
  }, [selectedStudentId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'practice': return <PenTool className="h-5 w-5" />;
      case 'review': return <BookOpen className="h-5 w-5" />;
      case 'advance': return <TrendingUp className="h-5 w-5" />;
      case 'remediate': return <Target className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'exercise': return <PenTool className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const groupedRecommendations = recommendations.reduce((groups, rec) => {
    if (!groups[rec.subject]) {
      groups[rec.subject] = [];
    }
    groups[rec.subject].push(rec);
    return groups;
  }, {} as Record<string, LearningRecommendation[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedStudent = getStudentById(selectedStudentId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Learning Recommendations</h1>
            <p className="text-gray-600 mt-2">
              Personalized learning path for {selectedStudent?.name}
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

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {recommendations.filter(r => r.priority === 'medium').length}
                  </p>
                  <p className="text-sm text-gray-600">Medium Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {recommendations.reduce((sum, r) => sum + r.estimatedTime, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.keys(groupedRecommendations).length}
                  </p>
                  <p className="text-sm text-gray-600">Subjects Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations by Subject */}
        {Object.entries(groupedRecommendations).map(([subject, subjectRecommendations]) => (
          <Card key={subject}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                {subject}
              </CardTitle>
              <CardDescription>
                {subjectRecommendations.length} recommendations for this subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subjectRecommendations.map((recommendation, index) => (
                  <div 
                    key={index}
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold capitalize">
                            {recommendation.type} - {recommendation.topic}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <Badge 
                              className={getPriorityColor(recommendation.priority)}
                            >
                              {recommendation.priority} priority
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {recommendation.estimatedTime}m
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{recommendation.description}</p>

                    {/* Resources */}
                    {recommendation.resources && recommendation.resources.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-800">Recommended Resources:</h4>
                        <div className="space-y-2">
                          {recommendation.resources.map((resource, resourceIndex) => (
                            <div 
                              key={resourceIndex}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <div className="p-1 bg-white rounded">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{resource.title}</p>
                                <p className="text-xs text-gray-600 capitalize">{resource.type}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Learning Plan Summary */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-6 w-6" />
              Personalized Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">This Week's Focus</h3>
                <ul className="space-y-2 text-purple-100">
                  {recommendations
                    .filter(r => r.priority === 'high')
                    .slice(0, 3)
                    .map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {rec.topic} - {rec.estimatedTime} minutes
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Study Schedule Suggestion</h3>
                <div className="space-y-2 text-purple-100">
                  <p>• Monday-Wednesday: Focus on high priority items</p>
                  <p>• Thursday-Friday: Medium priority practice</p>
                  <p>• Weekend: Review and assessment</p>
                  <p>• Total weekly commitment: ~{Math.ceil(recommendations.reduce((sum, r) => sum + r.estimatedTime, 0) / 60)} hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Track Your Progress</CardTitle>
            <CardDescription>
              Monitor your improvement as you complete recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full">
                Mark Recommendation Complete
              </Button>
              <Link href="/analytics">
                <Button variant="outline" className="w-full">
                  View Progress Analytics
                </Button>
              </Link>
              <Link href="/exam">
                <Button variant="outline" className="w-full">
                  Take Practice Test
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
