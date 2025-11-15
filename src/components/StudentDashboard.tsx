'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GrainOverlay } from '@/components/grain-overlay';
import { StudentProfile, StudentUserProfile } from '@/types/profile';
import { useGetReportsByCode } from '@/lib/scoring';
import { 
  Activity,
  GraduationCap,
  TrendingUp,
  Calendar,
  FileText,
  School
} from 'lucide-react';

interface StudentDashboardProps {
  userId: string;
  studentProfile: StudentUserProfile;
  onRefresh: () => void;
}


export default function StudentDashboard({
  userId,
  studentProfile,
  onRefresh,
}: StudentDashboardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const student = studentProfile.studentProfile;

  // Normalize report code for querying
  const reportCode = student.reportCode ? student.reportCode.toUpperCase().trim() : null;
  
  // Get all reports with the student's report code
  const studentReports = useGetReportsByCode(reportCode);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  // Debug: Log report code and results
  useEffect(() => {
    if (reportCode) {
      console.log('[StudentDashboard] Report code:', reportCode);
      console.log('[StudentDashboard] Student profile:', student);
      console.log('[StudentDashboard] Reports found:', studentReports?.length || 0);
      if (studentReports && studentReports.length > 0) {
        console.log('[StudentDashboard] Report codes in results:', studentReports.map((r: any) => r.reportCode));
      }
    } else {
      console.warn('[StudentDashboard] No report code found in student profile');
    }
  }, [reportCode, studentReports, student]);

  // Transform Convex reports to local format
  type TestHistoryItem = {
    id: string;
    timestamp: number;
    domainResults: any[];
    overallSignal?: string;
    studentName: string;
    grade: string;
    reportCode: string;
    apiAnalysisResult?: any;
    subjectAssessments?: any[];
    questionnaireData?: any[];
  };

  const testHistory: TestHistoryItem[] = (studentReports || []).map((r: any) => ({
    id: r._id,
    timestamp: r.timestamp || r.completedAt || Date.now(),
    domainResults: r.domainResults || r.results || [],
    overallSignal: r.overallSignal,
    studentName: r.studentName,
    grade: r.grade,
    reportCode: r.reportCode,
    // API analysis data
    apiAnalysisResult: r.apiAnalysisResult,
    // Subject assessments (input data)
    subjectAssessments: r.subjectAssessments,
    // Questionnaire data (for LKG-Grade 2)
    questionnaireData: r.questionnaireData,
  }));


  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'green':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'yellow':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'red':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      {/* Animated Background */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-700 ${
        isLoaded ? 'opacity-40' : 'opacity-0'
      }`}>
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8"
            colorB="#e19136"
            speed={0.6}
            detail={0.7}
            blend={60}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={30}
            fineY={30}
          />
          <ChromaFlow
            baseColor="#0066ff"
            upColor="#0066ff"
            downColor="#d1d1d1"
            leftColor="#e19136"
            rightColor="#e19136"
            intensity={0.7}
            radius={1.5}
            momentum={20}
            maskType="alpha"
            opacity={0.95}
          />
        </Shader>
      </div>

      {/* Header */}
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">SproutSense</h1>
                <p className="text-xs text-muted-foreground">Student Dashboard</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative z-10 pt-32 pb-16 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="mx-auto max-w-7xl px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-light text-white mb-2">
              Welcome, {student.name}
            </h2>
            <div className="flex items-center gap-4 text-white/70">
              {student.school && (
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  <span>{student.school}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>{student.grade}</span>
              </div>
            </div>
          </div>

          {/* Assessment History */}
          {!reportCode ? (
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Report Code Found</h3>
                <p className="text-white/70">
                  Please contact your teacher to get your report code, or complete onboarding again.
                </p>
              </CardContent>
            </Card>
          ) : testHistory.length === 0 ? (
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
                <p className="text-white/70 mb-2">
                  Your teacher will upload assessment reports here
                </p>
                <p className="text-xs text-white/50 mt-4">
                  Report Code: {reportCode}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-white mb-4">Your Assessment Reports</h3>
              {testHistory.map((test, index) => (
                <motion.div
                  key={test.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">
                            Assessment Report
                          </CardTitle>
                          <CardDescription className="text-white/70">
                            {formatDate(test.timestamp)}
                          </CardDescription>
                        </div>
                        {test.overallSignal && (
                          <Badge className={getSignalColor(test.overallSignal)}>
                            {test.overallSignal.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Questionnaire Results (LKG-Grade 2) */}
                      {test.questionnaireData && test.questionnaireData.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Questionnaire Assessment</h4>
                          {test.questionnaireData.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-4 bg-background/30 rounded-lg border border-border/40"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white">{item.question}</span>
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  Score: {item.score}/5
                                </Badge>
                              </div>
                            </div>
                          ))}
                          
                          {/* API Analysis Results for Questionnaire */}
                          {test.apiAnalysisResult && (() => {
                            const apiData = test.apiAnalysisResult?.data?.data || test.apiAnalysisResult?.data;
                            if (!apiData) return null;

                            return (
                              <div className="mt-6 space-y-4">
                                {/* Strengths & Weaknesses */}
                                {(apiData.strengths || apiData.weaknesses) && (
                                  <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                    <h4 className="text-lg font-semibold text-white mb-3">Overall Analysis</h4>
                                    {apiData.strengths && apiData.strengths.length > 0 && (
                                      <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                                          <span className="font-semibold text-emerald-400">Strengths</span>
                                        </div>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                          {apiData.strengths.map((s: string, idx: number) => (
                                            <li key={idx}>{s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {apiData.weaknesses && apiData.weaknesses.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Activity className="h-4 w-4 text-amber-400" />
                                          <span className="font-semibold text-amber-400">Areas for Improvement</span>
                                        </div>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                          {apiData.weaknesses.map((w: string, idx: number) => (
                                            <li key={idx}>{w}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Skillsets */}
                                {apiData.skillsets && (
                                  <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                    <h4 className="text-lg font-semibold text-white mb-3">Skill Assessment</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {Object.entries(apiData.skillsets).map(([skill, score]: [string, any]) => (
                                        <div key={skill} className="p-3 bg-background/20 rounded border border-border/30">
                                          <div className="text-sm text-white/70 mb-1">
                                            {skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                          </div>
                                          <div className="text-lg font-semibold text-white">{score}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Learning Profile */}
                                {apiData.learningProfile && (
                                  <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                    <h4 className="text-lg font-semibold text-white mb-3">Learning Profile</h4>
                                    <div className="space-y-2 text-sm">
                                      {apiData.learningProfile.learning_style && (
                                        <div>
                                          <span className="text-white/60">Learning Style: </span>
                                          <span className="text-white">{apiData.learningProfile.learning_style}</span>
                                        </div>
                                      )}
                                      {apiData.learningProfile.preferred_pace && (
                                        <div>
                                          <span className="text-white/60">Preferred Pace: </span>
                                          <span className="text-white">{apiData.learningProfile.preferred_pace}</span>
                                        </div>
                                      )}
                                      {apiData.learningProfile.attention_span && (
                                        <div>
                                          <span className="text-white/60">Attention Span: </span>
                                          <span className="text-white">{apiData.learningProfile.attention_span}</span>
                                        </div>
                                      )}
                                      {apiData.learningProfile.motivation_factors && apiData.learningProfile.motivation_factors.length > 0 && (
                                        <div>
                                          <span className="text-white/60">Motivation Factors: </span>
                                          <span className="text-white">{apiData.learningProfile.motivation_factors.join(', ')}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Development Plan */}
                                {apiData.developmentPlan && (
                                  <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                    <h4 className="text-lg font-semibold text-white mb-3">Development Plan</h4>
                                    {apiData.developmentPlan.immediate_actions && 
                                     apiData.developmentPlan.immediate_actions.length > 0 && (
                                      <div className="mb-3">
                                        <span className="text-sm font-semibold text-white mb-2 block">Immediate Actions:</span>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                          {apiData.developmentPlan.immediate_actions.map((action: string, idx: number) => (
                                            <li key={idx}>{action}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {apiData.developmentPlan.short_term_goals && 
                                     apiData.developmentPlan.short_term_goals.length > 0 && (
                                      <div className="mb-3">
                                        <span className="text-sm font-semibold text-white mb-2 block">Short-term Goals:</span>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                          {apiData.developmentPlan.short_term_goals.map((goal: string, idx: number) => (
                                            <li key={idx}>{goal}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {apiData.developmentPlan.long_term_objectives && 
                                     apiData.developmentPlan.long_term_objectives.length > 0 && (
                                      <div>
                                        <span className="text-sm font-semibold text-white mb-2 block">Long-term Objectives:</span>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                          {apiData.developmentPlan.long_term_objectives.map((obj: string, idx: number) => (
                                            <li key={idx}>{obj}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Subject Recommendations */}
                                {apiData.subjectRecommendations && apiData.subjectRecommendations.length > 0 && (
                                  <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                    <h4 className="text-lg font-semibold text-white mb-3">Subject Recommendations</h4>
                                    <div className="space-y-2">
                                      {apiData.subjectRecommendations.map((rec: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-background/20 rounded border border-border/30">
                                          <div className="font-semibold text-white">{rec.subject}</div>
                                          {rec.focus_areas && rec.focus_areas.length > 0 && (
                                            <div className="text-sm text-white/70 mt-1">
                                              Focus: {rec.focus_areas.join(', ')}
                                            </div>
                                          )}
                                          {rec.priority && (
                                            <Badge className="mt-1 bg-primary/20 text-primary border-primary/30 text-xs">
                                              {rec.priority} Priority
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Subject Assessments & API Analysis Results (Grade 6+) */}
                      {test.subjectAssessments && test.subjectAssessments.length > 0 && (
                        <div className="space-y-4 mb-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Subject Performance</h4>
                          {test.subjectAssessments.map((subject: any, idx: number) => {
                            // Access nested data structure: apiAnalysisResult.data.data.subjectAnalysis
                            const apiAnalysisData = test.apiAnalysisResult?.data?.data || test.apiAnalysisResult?.data;
                            const apiSubject = apiAnalysisData?.subjectAnalysis?.find(
                              (s: any) => s.subjectName === subject.subjectName
                            );
                            return (
                              <div
                                key={idx}
                                className="p-4 bg-background/30 rounded-lg border border-border/40"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-semibold text-white text-lg">{subject.subjectName}</h5>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white/70">
                                      {subject.obtainedMarks}/{subject.totalMarks}
                                    </span>
                                    {apiSubject && (
                                      <Badge className="bg-primary/20 text-primary border-primary/30">
                                        {apiSubject.grade} ({apiSubject.percentage}%)
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Assessment Parameters */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                                  <div className="text-center p-2 bg-background/20 rounded">
                                    <div className="text-xs text-white/60 mb-1">Conceptual</div>
                                    <div className="text-sm font-semibold text-white">
                                      {subject.assessmentParameters.conceptualUnderstanding}/5
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-background/20 rounded">
                                    <div className="text-xs text-white/60 mb-1">Recall</div>
                                    <div className="text-sm font-semibold text-white">
                                      {subject.assessmentParameters.recall}/5
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-background/20 rounded">
                                    <div className="text-xs text-white/60 mb-1">Logic</div>
                                    <div className="text-sm font-semibold text-white">
                                      {subject.assessmentParameters.logicalReasoning}/5
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-background/20 rounded">
                                    <div className="text-xs text-white/60 mb-1">Bonus Q</div>
                                    <div className="text-sm font-semibold text-white">
                                      {subject.assessmentParameters.attemptsBonusQuestions}/5
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-background/20 rounded">
                                    <div className="text-xs text-white/60 mb-1">Effort</div>
                                    <div className="text-sm font-semibold text-white">
                                      {subject.assessmentParameters.effortNonConservative}/5
                                    </div>
                                  </div>
                                </div>

                                {/* API Analysis Feedback */}
                                {apiSubject && (
                                  <div className="mt-3 pt-3 border-t border-border/30">
                                    {apiSubject.strengths && apiSubject.strengths.length > 0 && (
                                      <div className="mb-2">
                                        <span className="text-xs font-semibold text-emerald-400">Strengths: </span>
                                        <span className="text-sm text-white/80">
                                          {apiSubject.strengths.join(', ')}
                                        </span>
                                      </div>
                                    )}
                                    {apiSubject.improvements && apiSubject.improvements.length > 0 && (
                                      <div>
                                        <span className="text-xs font-semibold text-amber-400">Areas to Improve: </span>
                                        <span className="text-sm text-white/80">
                                          {apiSubject.improvements.join(', ')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* API Analysis Results - Full Analytics */}
                      {test.apiAnalysisResult && (() => {
                        // Access nested data structure: apiAnalysisResult.data.data
                        const apiData = test.apiAnalysisResult?.data?.data || test.apiAnalysisResult?.data;
                        if (!apiData) return null;

                        return (
                          <div className="space-y-4">
                            {/* Overall Performance - Strengths & Improvement Areas */}
                            {apiData.overallPerformance && (
                              <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                <h4 className="text-lg font-semibold text-white mb-3">Overall Performance</h4>
                                
                                {apiData.overallPerformance.strengthAreas && apiData.overallPerformance.strengthAreas.length > 0 && (
                                  <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                                      <span className="font-semibold text-emerald-400">Strengths</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.overallPerformance.strengthAreas.map((s: string, idx: number) => (
                                        <li key={idx}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.overallPerformance.improvementAreas && apiData.overallPerformance.improvementAreas.length > 0 && (
                                  <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Activity className="h-4 w-4 text-amber-400" />
                                      <span className="font-semibold text-amber-400">Areas for Improvement</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.overallPerformance.improvementAreas.map((area: string, idx: number) => (
                                        <li key={idx}>{area}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.overallPerformance.totalPercentage !== undefined && (
                                  <div className="mt-3 pt-3 border-t border-border/30">
                                    <span className="text-sm font-semibold text-white">Overall Score: </span>
                                    <span className="text-lg font-bold text-primary">
                                      {apiData.overallPerformance.totalPercentage}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Career Guidance */}
                            {apiData.careerGuidance && (
                              <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                <h4 className="text-lg font-semibold text-white mb-3">Career Guidance</h4>
                                
                                {/* Top Career Recommendations */}
                                {apiData.careerGuidance.topRecommendations && apiData.careerGuidance.topRecommendations.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="text-sm font-semibold text-white/90 mb-2">Top Recommendations</h5>
                                    <div className="space-y-3">
                                      {apiData.careerGuidance.topRecommendations.map((career: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-background/20 rounded border border-border/30">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-white">{career.field}</span>
                                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                              {career.suitabilityScore}% Match
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-white/70 mb-2">{career.reasoning}</p>
                                          {career.futureProspects && career.futureProspects.length > 0 && (
                                            <div className="text-xs text-white/60 mb-1">
                                              <span className="font-medium">Future Roles: </span>
                                              {career.futureProspects.join(', ')}
                                            </div>
                                          )}
                                          {career.requiredSubjects && career.requiredSubjects.length > 0 && (
                                            <div className="text-xs text-white/60">
                                              <span className="font-medium">Required Subjects: </span>
                                              {career.requiredSubjects.join(', ')}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Stream Suggestions */}
                                {apiData.careerGuidance.streamSuggestions && apiData.careerGuidance.streamSuggestions.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="text-sm font-semibold text-white/90 mb-2">Stream Suggestions</h5>
                                    <div className="space-y-2">
                                      {apiData.careerGuidance.streamSuggestions.map((stream: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-background/20 rounded border border-border/30">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-white">{stream.stream}</span>
                                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                              {stream.suitability}% Suitability
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-white/70 mb-2">{stream.reasoning}</p>
                                          {stream.subjects && stream.subjects.length > 0 && (
                                            <div className="text-xs text-white/60">
                                              <span className="font-medium">Subjects: </span>
                                              {stream.subjects.join(', ')}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Skill Gaps */}
                                {apiData.careerGuidance.skillGaps && apiData.careerGuidance.skillGaps.length > 0 && (
                                  <div>
                                    <h5 className="text-sm font-semibold text-white/90 mb-2">Skill Gaps to Address</h5>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.careerGuidance.skillGaps.map((gap: string, idx: number) => (
                                        <li key={idx}>{gap}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Study Recommendations */}
                            {apiData.studyRecommendations && (
                              <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                <h4 className="text-lg font-semibold text-white mb-3">Study Recommendations</h4>
                                
                                {apiData.studyRecommendations.prioritySubjects && 
                                 apiData.studyRecommendations.prioritySubjects.length > 0 && (
                                  <div className="mb-3">
                                    <span className="text-sm font-semibold text-white">Priority Subjects: </span>
                                    <span className="text-sm text-white/80">
                                      {apiData.studyRecommendations.prioritySubjects.join(', ')}
                                    </span>
                                  </div>
                                )}

                                {apiData.studyRecommendations.improvementStrategies && 
                                 apiData.studyRecommendations.improvementStrategies.length > 0 && (
                                  <div className="mb-3">
                                    <span className="text-sm font-semibold text-white mb-2 block">Improvement Strategies:</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.studyRecommendations.improvementStrategies.map((strategy: string, idx: number) => (
                                        <li key={idx}>{strategy}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.studyRecommendations.resourceRecommendations && 
                                 apiData.studyRecommendations.resourceRecommendations.length > 0 && (
                                  <div>
                                    <span className="text-sm font-semibold text-white mb-2 block">Recommended Resources:</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.studyRecommendations.resourceRecommendations.map((resource: string, idx: number) => (
                                        <li key={idx}>{resource}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Study Plan */}
                            {apiData.overallPerformance?.studyPlan && (
                              <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                <h4 className="text-lg font-semibold text-white mb-3">Study Plan</h4>
                                
                                {apiData.overallPerformance.studyPlan.immediateActions && 
                                 apiData.overallPerformance.studyPlan.immediateActions.length > 0 && (
                                  <div className="mb-4">
                                    <span className="text-sm font-semibold text-white mb-2 block">Immediate Actions:</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.overallPerformance.studyPlan.immediateActions.map((action: string, idx: number) => (
                                        <li key={idx}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.overallPerformance.studyPlan.shortTermGoals && 
                                 apiData.overallPerformance.studyPlan.shortTermGoals.length > 0 && (
                                  <div className="mb-4">
                                    <span className="text-sm font-semibold text-white mb-2 block">Short-term Goals:</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.overallPerformance.studyPlan.shortTermGoals.map((goal: string, idx: number) => (
                                        <li key={idx}>{goal}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.overallPerformance.studyPlan.longTermGoals && 
                                 apiData.overallPerformance.studyPlan.longTermGoals.length > 0 && (
                                  <div className="mb-4">
                                    <span className="text-sm font-semibold text-white mb-2 block">Long-term Goals:</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80 ml-4">
                                      {apiData.overallPerformance.studyPlan.longTermGoals.map((goal: string, idx: number) => (
                                        <li key={idx}>{goal}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {apiData.overallPerformance.studyPlan.recommendedResources && 
                                 apiData.overallPerformance.studyPlan.recommendedResources.length > 0 && (
                                  <div>
                                    <span className="text-sm font-semibold text-white mb-2 block">Recommended Resources:</span>
                                    <div className="space-y-2">
                                      {apiData.overallPerformance.studyPlan.recommendedResources.map((resource: any, idx: number) => (
                                        <div key={idx} className="p-2 bg-background/20 rounded border border-border/30">
                                          <div className="font-medium text-white text-sm">{resource.title}</div>
                                          <div className="text-xs text-white/60 mt-1">{resource.description}</div>
                                          {resource.type && (
                                            <Badge className="mt-1 bg-primary/20 text-primary border-primary/30 text-xs">
                                              {resource.type}
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Overall Performance Career Recommendations */}
                            {apiData.overallPerformance?.careerRecommendations && 
                             apiData.overallPerformance.careerRecommendations.length > 0 && (
                              <div className="p-4 bg-background/30 rounded-lg border border-border/40">
                                <h4 className="text-lg font-semibold text-white mb-3">Career Recommendations</h4>
                                <div className="space-y-3">
                                  {apiData.overallPerformance.careerRecommendations.map((career: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-background/20 rounded border border-border/30">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-white">{career.field}</span>
                                        <Badge className="bg-primary/20 text-primary border-primary/30">
                                          {career.suitabilityScore}% Match
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-white/70 mb-2">{career.reasoning}</p>
                                      {career.futureProspects && career.futureProspects.length > 0 && (
                                        <div className="text-xs text-white/60 mb-1">
                                          <span className="font-medium">Future Roles: </span>
                                          {career.futureProspects.join(', ')}
                                        </div>
                                      )}
                                      {career.requiredSubjects && career.requiredSubjects.length > 0 && (
                                        <div className="text-xs text-white/60">
                                          <span className="font-medium">Required Subjects: </span>
                                          {career.requiredSubjects.join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Domain Results (from games or API) */}
                      {test.domainResults && test.domainResults.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Domain Analysis</h4>
                          {test.domainResults.map((domain: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-4 bg-background/30 rounded-lg border border-border/40"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {domain.emoji && <span className="text-2xl">{domain.emoji}</span>}
                                  <span className="font-semibold text-white">{domain.domain}</span>
                                </div>
                                {domain.signal && (
                                  <Badge className={getSignalColor(domain.signal)}>
                                    {domain.signal.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              {domain.feedback && (
                                <p className="text-sm text-white/70">{domain.feedback}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Fallback message if no data */}
                      {!test.questionnaireData && 
                       !test.subjectAssessments && 
                       !test.apiAnalysisResult && 
                       (!test.domainResults || test.domainResults.length === 0) && (
                        <p className="text-white/70">No assessment data available yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

