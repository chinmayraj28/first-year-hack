'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Users
} from "lucide-react";
import { AnalysisEngine } from '@/lib/analysis';
import { 
  sampleStudents, 
  sampleQuestions, 
  getStudentAttempts,
  sampleSubjects
} from '@/data/sampleData';
import { SubjectAnalysis } from '@/types';
import Link from 'next/link';

export default function SubjectsPage() {
  const [subjectData, setSubjectData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeSubjects = () => {
      const allSubjectData: any = {};

      // Analyze each subject across all students
      sampleSubjects.forEach(subject => {
        const subjectAnalyses: SubjectAnalysis[] = [];
        const studentPerformance: any[] = [];

        sampleStudents.forEach(student => {
          const attempts = getStudentAttempts(student.id);
          const subjectAnalysis = AnalysisEngine.analyzeBySubject(attempts, sampleQuestions);
          
          const relevantAnalysis = subjectAnalysis.find(analysis => 
            analysis.subjectName === subject.name
          );
          
          if (relevantAnalysis) {
            subjectAnalyses.push(relevantAnalysis);
            studentPerformance.push({
              studentName: student.name,
              score: relevantAnalysis.overallScore,
              strengths: relevantAnalysis.strengths,
              weaknesses: relevantAnalysis.weaknesses
            });
          }
        });

        // Calculate subject-wide statistics
        const totalStudents = studentPerformance.length;
        const averageScore = totalStudents > 0 
          ? studentPerformance.reduce((sum, p) => sum + p.score, 0) / totalStudents 
          : 0;
        
        const highPerformers = studentPerformance.filter(p => p.score >= 80).length;
        const needSupport = studentPerformance.filter(p => p.score < 60).length;

        // Aggregate topic performance
        const topicPerformance: any = {};
        subjectAnalyses.forEach(analysis => {
          analysis.topicBreakdown.forEach(topic => {
            if (!topicPerformance[topic.topicName]) {
              topicPerformance[topic.topicName] = {
                scores: [],
                totalQuestions: 0,
                totalTime: 0
              };
            }
            topicPerformance[topic.topicName].scores.push(topic.score);
            topicPerformance[topic.topicName].totalQuestions += topic.questionsAttempted;
            topicPerformance[topic.topicName].totalTime += topic.timeSpent;
          });
        });

        // Calculate topic averages
        Object.keys(topicPerformance).forEach(topicName => {
          const topic = topicPerformance[topicName];
          topic.averageScore = topic.scores.reduce((sum: number, score: number) => sum + score, 0) / topic.scores.length;
          topic.averageTime = topic.totalTime / topic.scores.length;
        });

        allSubjectData[subject.name] = {
          subject,
          totalStudents,
          averageScore,
          highPerformers,
          needSupport,
          studentPerformance,
          topicPerformance
        };
      });

      setSubjectData(allSubjectData);
      setLoading(false);
    };

    analyzeSubjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
            <h1 className="text-4xl font-bold text-gray-900">Subject Analysis</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive performance analysis across all subjects and topics
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.keys(subjectData).length}
                  </p>
                  <p className="text-sm text-gray-600">Total Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(subjectData).reduce((sum: number, data: any) => sum + data.averageScore, 0) / Object.keys(subjectData).length || 0}%
                  </p>
                  <p className="text-sm text-gray-600">Overall Average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(subjectData).reduce((sum: number, data: any) => sum + data.highPerformers, 0)}
                  </p>
                  <p className="text-sm text-gray-600">High Performers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(subjectData).reduce((sum: number, data: any) => sum + data.needSupport, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Need Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Cards */}
        <div className="space-y-8">
          {Object.entries(subjectData).map(([subjectName, data]: [string, any]) => (
            <Card key={subjectName}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{subjectName}</CardTitle>
                    <CardDescription>
                      {data.subject.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={
                      data.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                      data.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {data.averageScore.toFixed(1)}% Average
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-lg">{data.totalStudents}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-lg">{data.highPerformers}</div>
                    <div className="text-sm text-gray-600">High Performers</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded">
                    <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold text-lg">{data.needSupport}</div>
                    <div className="text-sm text-gray-600">Need Support</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-lg">{Object.keys(data.topicPerformance).length}</div>
                    <div className="text-sm text-gray-600">Topics</div>
                  </div>
                </div>

                {/* Performance Distribution */}
                <div>
                  <h4 className="font-semibold mb-3">Performance Distribution</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div className="flex h-full rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500"
                        style={{ 
                          width: `${(data.highPerformers / data.totalStudents) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="bg-yellow-500"
                        style={{ 
                          width: `${((data.totalStudents - data.highPerformers - data.needSupport) / data.totalStudents) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="bg-red-500"
                        style={{ 
                          width: `${(data.needSupport / data.totalStudents) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>High (80%+): {data.highPerformers}</span>
                    <span>Average (60-79%): {data.totalStudents - data.highPerformers - data.needSupport}</span>
                    <span>Low (&lt;60%): {data.needSupport}</span>
                  </div>
                </div>

                {/* Topic Performance Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Topic Performance Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data.topicPerformance).map(([topicName, topicData]: [string, any]) => (
                      <div key={topicName} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{topicName}</h5>
                          <Badge variant="outline">
                            {topicData.averageScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${topicData.averageScore}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 flex justify-between">
                          <span>{topicData.totalQuestions} questions</span>
                          <span>{Math.floor(topicData.averageTime / 60)}m avg time</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Performance in Subject */}
                <div>
                  <h4 className="font-semibold mb-3">Individual Student Performance</h4>
                  <div className="space-y-2">
                    {data.studentPerformance.map((student: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-sm text-gray-600">
                            {student.strengths.length > 0 && (
                              <span className="text-green-600">
                                Strengths: {student.strengths.join(', ')}
                              </span>
                            )}
                            {student.weaknesses.length > 0 && (
                              <span className="text-red-600 ml-4">
                                Weaknesses: {student.weaknesses.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{student.score.toFixed(1)}%</div>
                          <Badge 
                            className={
                              student.score >= 80 ? 'bg-green-100 text-green-800' :
                              student.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {student.score >= 80 ? 'Excellent' :
                             student.score >= 60 ? 'Good' : 'Needs Support'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>
              Based on the subject analysis, here are suggested next steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Review subjects with low average scores</li>
                  <li>• Provide additional support for struggling students</li>
                  <li>• Focus on weak topic areas</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Enhance teaching methods for average performers</li>
                  <li>• Create targeted practice materials</li>
                  <li>• Monitor progress regularly</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-green-800 mb-2">Opportunities</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Challenge high performers with advanced topics</li>
                  <li>• Peer tutoring programs</li>
                  <li>• Celebrate successful strategies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/analytics">
            <Button>View Student Analytics</Button>
          </Link>
          <Link href="/recommendations">
            <Button variant="outline">Generate Recommendations</Button>
          </Link>
          <Link href="/students">
            <Button variant="outline">Student Management</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
