'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GrainOverlay } from '@/components/grain-overlay';
import { MagneticButton } from '@/components/magnetic-button';
import { TeacherProfile } from '@/types/profile';
import { useSaveReport, useGetTeacherReports } from '@/lib/scoring';
import { isQuestionnaireGrade, isMarksAssessmentGrade } from '@/lib/grade-utils';
import QuestionnaireForm from '@/components/forms/QuestionnaireForm';
import MarksAssessmentForm from '@/components/forms/MarksAssessmentForm';
import { 
  Activity,
  FileText,
  Hash,
  Copy,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

interface TeacherDashboardProps {
  userId: string;
  teacherProfile: TeacherProfile;
  onRefresh: () => void;
}

interface Report {
  id: string;
  reportCode: string;
  studentName: string;
  grade: string;
  timestamp: number;
  studentId?: string;
  hasQuestionnaire?: boolean;
  hasMarksAssessment?: boolean;
}

type FormStep = 'initial' | 'questionnaire' | 'marks';

export default function TeacherDashboard({
  userId,
  teacherProfile,
  onRefresh,
}: TeacherDashboardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('initial');
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Convex hooks
  const saveReport = useSaveReport();
  const teacherReports = useGetTeacherReports(userId);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  // Transform Convex reports to local Report format
  const reports: Report[] = (teacherReports || []).map((r: any) => ({
    id: r._id,
    reportCode: r.reportCode,
    studentName: r.studentName || 'Unknown',
    grade: r.grade || '',
    timestamp: r.timestamp || r.completedAt || Date.now(),
    studentId: r.studentId,
    hasQuestionnaire: !!r.questionnaireData && r.questionnaireData.length > 0,
    hasMarksAssessment: !!r.subjectAssessments && r.subjectAssessments.length > 0,
  }));

  const handleInitialSubmit = () => {
    if (!studentName.trim() || !grade.trim()) {
      alert('Please fill in student name and grade');
      return;
    }

    const normalizedGrade = grade.trim();
    if (isQuestionnaireGrade(normalizedGrade)) {
      setFormStep('questionnaire');
    } else if (isMarksAssessmentGrade(normalizedGrade)) {
      setFormStep('marks');
    } else {
      alert('Please enter a valid grade. Supported: LKG, UKG, 1st-2nd Grade, or 6th-12th Grade');
    }
  };

  const handleQuestionnaireSubmit = async (data: { questionnaireData: any[] }) => {
    try {
      await saveReport({
        teacherId: userId,
        studentName: studentName.trim(),
        grade: grade.trim(),
        questionnaireData: data.questionnaireData,
      });

      resetForm();
      onRefresh();
    } catch (error: any) {
      alert(`Failed to save report: ${error.message || 'Unknown error'}`);
    }
  };

  const handleMarksAssessmentSubmit = async (data: { 
    subjectAssessments: any[]; 
    apiAnalysisResult: any;
  }) => {
    try {
      console.log('[TeacherDashboard] Saving report with data:', {
        studentName: studentName.trim(),
        grade: grade.trim(),
        hasSubjectAssessments: !!data.subjectAssessments,
        hasApiResult: !!data.apiAnalysisResult,
        apiResult: data.apiAnalysisResult,
      });

      // Extract display data from API response (handle different response structures)
      const apiResult = data.apiAnalysisResult;
      const domainResults = apiResult?.domainResults || apiResult?.data?.domainResults || apiResult?.analysis?.domainResults || [];
      const results = apiResult?.results || apiResult?.data?.results || apiResult?.analysis?.results || [];
      const overallSignal = apiResult?.overallSignal || apiResult?.data?.overallSignal || apiResult?.analysis?.overallSignal;

      // Save the full API response and extract display data
      await saveReport({
        teacherId: userId,
        studentName: studentName.trim(),
        grade: grade.trim(),
        subjectAssessments: data.subjectAssessments,
        apiAnalysisResult: data.apiAnalysisResult, // Store full API response
        domainResults,
        results,
        overallSignal,
      });

      console.log('[TeacherDashboard] Report saved successfully');
      resetForm();
      onRefresh();
    } catch (error: any) {
      console.error('[TeacherDashboard] Failed to save report:', error);
      alert(`Failed to save report: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormStep('initial');
    setStudentName('');
    setGrade('');
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
                <p className="text-xs text-muted-foreground">Teacher Dashboard</p>
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
              Welcome, {teacherProfile.name}
            </h2>
            <p className="text-white/70">
              Create assessments and generate codes for your students
            </p>
          </div>

          {/* Initial Form */}
          {formStep === 'initial' && (
            <>
              <Card className="mb-8 border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Create Student Assessment</CardTitle>
                  <CardDescription className="text-white/70">
                    Enter student details to begin assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="text-white/90">
                        Student Name *
                      </Label>
                      <Input
                        id="studentName"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="bg-background/30 border-border/40 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-white/90">
                        Grade *
                      </Label>
                      <Input
                        id="grade"
                        placeholder="e.g., LKG, 1st Grade, 6th Grade, 8th Grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="bg-background/30 border-border/40 text-white placeholder:text-white/50"
                      />
                      <p className="text-xs text-white/60">
                        LKG-Grade 2: Questionnaire | Grade 6+: Marks & Assessment
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <MagneticButton
                      onClick={handleInitialSubmit}
                      variant="primary"
                      disabled={!studentName.trim() || !grade.trim()}
                    >
                      Continue
                    </MagneticButton>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Questionnaire Form */}
          {formStep === 'questionnaire' && (
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={resetForm}
                className="mb-4 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Back
              </Button>
              <QuestionnaireForm
                studentName={studentName}
                grade={grade}
                onSubmit={handleQuestionnaireSubmit}
                onCancel={resetForm}
              />
            </div>
          )}

          {/* Marks Assessment Form */}
          {formStep === 'marks' && (
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={resetForm}
                className="mb-4 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Back
              </Button>
              <MarksAssessmentForm
                studentName={studentName}
                grade={grade}
                onSubmit={handleMarksAssessmentSubmit}
                onCancel={resetForm}
              />
            </div>
          )}

          {/* Reports Grid */}
          {reports.length === 0 ? (
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
                <p className="text-white/70 mb-6">
                  Create your first assessment to generate a code for a student
                </p>
                <MagneticButton
                  onClick={() => setFormStep('initial')}
                  variant="primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Assessment
                </MagneticButton>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl hover:border-primary/40 transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white mb-1">{report.studentName}</CardTitle>
                          <CardDescription className="text-white/70">
                            {report.grade}
                          </CardDescription>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {report.hasQuestionnaire ? 'Questionnaire' : report.hasMarksAssessment ? 'Marks Assessment' : 'Report'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Report Code */}
                      <div className="space-y-2">
                        <Label className="text-white/70 text-sm">Report Code</Label>
                        <div className="flex items-center gap-2 p-3 bg-background/30 rounded-lg border border-border/40">
                          <Hash className="h-5 w-5 text-primary" />
                          <code className="flex-1 text-lg font-mono font-bold text-white">
                            {report.reportCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(report.reportCode)}
                            className="text-white/70 hover:text-white"
                          >
                            {copiedCode === report.reportCode ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-white/60">
                          Share this code with the student to access their report
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <span className="text-xs text-white/60">
                          {report.studentId ? (
                            <span className="text-primary">Linked to student</span>
                          ) : (
                            <span className="text-white/50">Pending student registration</span>
                          )}
                        </span>
                      </div>
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

