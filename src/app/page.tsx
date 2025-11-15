import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  ClipboardList,
  BarChart3,
  GraduationCap,
  Target,
  Clock
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            EduAnalytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Intelligent Student Performance Analysis Platform - Analyze answer scripts, 
            identify skill gaps, and provide personalized learning recommendations
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">AI-Powered Analysis</Badge>
            <Badge variant="secondary">Real-time Insights</Badge>
            <Badge variant="secondary">Personalized Learning</Badge>
            <Badge variant="secondary">Skill Assessment</Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-gray-600">Exams Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600">Skills Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Student Analytics
              </CardTitle>
              <CardDescription>
                View comprehensive performance analysis and skill assessments for individual students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/analytics">
                <Button className="w-full">
                  View Analytics Dashboard
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Performance trends • Skill mapping • Weakness identification
              </div>
            </CardContent>
          </Card>

          {/* Take Exam */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Take Exam
              </CardTitle>
              <CardDescription>
                Start a new examination session and contribute to your learning analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/exam">
                <Button className="w-full" variant="default">
                  Start New Exam
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Interactive questions • Auto-grading • Instant feedback
              </div>
            </CardContent>
          </Card>

          {/* Manage Students */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Student Management
              </CardTitle>
              <CardDescription>
                Manage student profiles and view class-wide performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/students">
                <Button className="w-full" variant="outline">
                  Manage Students
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Student profiles • Progress tracking • Class overview
              </div>
            </CardContent>
          </Card>

          {/* Subject Analysis */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                Subject Analysis
              </CardTitle>
              <CardDescription>
                Deep dive into performance by subject and topic areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/subjects">
                <Button className="w-full" variant="outline">
                  View Subject Analysis
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Topic-wise breakdown • Difficulty analysis • Content gaps
              </div>
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Learning Path
              </CardTitle>
              <CardDescription>
                AI-generated personalized learning recommendations and study plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/recommendations">
                <Button className="w-full" variant="outline">
                  View Recommendations
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Personalized plans • Skill development • Progress goals
              </div>
            </CardContent>
          </Card>

          {/* Exam Creation */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-red-600" />
                Create Exam
              </CardTitle>
              <CardDescription>
                Design new examinations with custom questions and skill assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/create-exam">
                <Button className="w-full" variant="outline">
                  Create New Exam
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                • Question builder • Skill mapping • Auto-scoring setup
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Platform Features</CardTitle>
            <CardDescription className="text-blue-100">
              Comprehensive tools for educational assessment and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">For Students:</h4>
                <ul className="text-sm space-y-1 text-blue-100">
                  <li>• Interactive exam interface</li>
                  <li>• Real-time performance feedback</li>
                  <li>• Personalized learning recommendations</li>
                  <li>• Skill development tracking</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">For Educators:</h4>
                <ul className="text-sm space-y-1 text-blue-100">
                  <li>• Detailed analytics dashboard</li>
                  <li>• Automated grading and assessment</li>
                  <li>• Class-wide performance insights</li>
                  <li>• Curriculum gap analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            EduAnalytics - Transforming Education Through Intelligent Assessment
          </p>
        </div>
      </div>
    </div>
  );
}
