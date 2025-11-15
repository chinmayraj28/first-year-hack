'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Award,
  Clock,
  BookOpen,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { sampleStudents, getStudentAttempts, sampleQuestions } from '@/data/sampleData';
import { AnalysisEngine } from '@/lib/analysis';
import Link from 'next/link';

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Calculate student statistics
  const studentStats = sampleStudents.map(student => {
    const attempts = getStudentAttempts(student.id);
    const skillsMatrix = AnalysisEngine.analyzeStudentPerformance(attempts, sampleQuestions);
    const subjectAnalyses = AnalysisEngine.analyzeBySubject(attempts, sampleQuestions);
    
    const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0);
    const totalMaxScore = attempts.reduce((sum, attempt) => sum + attempt.maxScore, 0);
    const averageScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    
    const strongSkills = skillsMatrix.filter(skill => skill.proficiencyLevel >= 80).length;
    const weakSkills = skillsMatrix.filter(skill => skill.proficiencyLevel < 60).length;
    
    return {
      ...student,
      attempts: attempts.length,
      averageScore,
      strongSkills,
      weakSkills,
      recentActivity: attempts.length > 0 ? new Date(attempts[attempts.length - 1].startTime) : null
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-2">
              Overview of all students and their performance metrics
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Class Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{sampleStudents.length}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
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
                    {(studentStats.reduce((sum, s) => sum + s.averageScore, 0) / studentStats.length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Class Average</p>
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
                    {studentStats.filter(s => s.averageScore >= 80).length}
                  </p>
                  <p className="text-sm text-gray-600">High Performers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {studentStats.filter(s => s.averageScore < 60).length}
                  </p>
                  <p className="text-sm text-gray-600">Need Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Overview</CardTitle>
            <CardDescription>
              Click on a student to view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentStats.map((student) => (
                <div 
                  key={student.id}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{student.name}</h3>
                        <Badge variant="outline">{student.grade}</Badge>
                        <Badge 
                          className={
                            student.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                            student.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {student.averageScore >= 80 ? 'Excellent' :
                           student.averageScore >= 60 ? 'Good' : 'Needs Support'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <Award className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <div className="font-semibold text-lg">{student.averageScore.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">Average Score</div>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded">
                          <BookOpen className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="font-semibold text-lg">{student.attempts}</div>
                          <div className="text-xs text-gray-600">Exams Taken</div>
                        </div>

                        <div className="text-center p-3 bg-purple-50 rounded">
                          <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                          <div className="font-semibold text-lg">{student.strongSkills}</div>
                          <div className="text-xs text-gray-600">Strong Skills</div>
                        </div>

                        <div className="text-center p-3 bg-orange-50 rounded">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <div className="font-semibold text-lg">{student.weakSkills}</div>
                          <div className="text-xs text-gray-600">Weak Areas</div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded">
                          <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="font-semibold text-sm">
                            {student.recentActivity ? 
                              student.recentActivity.toLocaleDateString() : 'Never'}
                          </div>
                          <div className="text-xs text-gray-600">Last Active</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Email: {student.email}
                        </div>
                        <Link href={`/analytics?student=${student.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Performance Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <span className="text-sm text-gray-600">{student.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          student.averageScore >= 80 ? 'bg-green-500' :
                          student.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>
              Overview of how students are performing across different skill levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-800 mb-2">
                  {studentStats.filter(s => s.averageScore >= 80).length}
                </div>
                <div className="text-green-700 font-medium mb-1">High Performers</div>
                <div className="text-sm text-green-600">80% and above</div>
                <div className="mt-4 space-y-1">
                  {studentStats
                    .filter(s => s.averageScore >= 80)
                    .map(s => (
                      <div key={s.id} className="text-sm text-green-700">
                        {s.name} ({s.averageScore.toFixed(1)}%)
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-800 mb-2">
                  {studentStats.filter(s => s.averageScore >= 60 && s.averageScore < 80).length}
                </div>
                <div className="text-yellow-700 font-medium mb-1">Average Performers</div>
                <div className="text-sm text-yellow-600">60-79%</div>
                <div className="mt-4 space-y-1">
                  {studentStats
                    .filter(s => s.averageScore >= 60 && s.averageScore < 80)
                    .map(s => (
                      <div key={s.id} className="text-sm text-yellow-700">
                        {s.name} ({s.averageScore.toFixed(1)}%)
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="text-center p-6 bg-red-50 rounded-lg">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-red-800 mb-2">
                  {studentStats.filter(s => s.averageScore < 60).length}
                </div>
                <div className="text-red-700 font-medium mb-1">Need Support</div>
                <div className="text-sm text-red-600">Below 60%</div>
                <div className="mt-4 space-y-1">
                  {studentStats
                    .filter(s => s.averageScore < 60)
                    .map(s => (
                      <div key={s.id} className="text-sm text-red-700">
                        {s.name} ({s.averageScore.toFixed(1)}%)
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/analytics">
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </Link>
              <Link href="/exam">
                <Button variant="outline" className="w-full">
                  Start New Assessment
                </Button>
              </Link>
              <Link href="/recommendations">
                <Button variant="outline" className="w-full">
                  Generate Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
