'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagneticButton } from '@/components/magnetic-button';
import { GrainOverlay } from '@/components/grain-overlay';
import { UserType } from '@/types/profile';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  Users,
  GraduationCap,
  School,
  Hash,
  Copy,
  CheckCircle2,
  UserCheck,
  User
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  userId: string;
}

export interface OnboardingData {
  userType: UserType;
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  // Teacher fields
  teacherName?: string;
  // Student fields
  studentName?: string;
  reportCode?: string;
}

export default function OnboardingFlow({ onComplete, userId }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate total steps based on user type
  const getTotalSteps = () => {
    if (!data.userType) return 4; // Privacy, Terms, Disclaimer, User Type
    if (data.userType === 'teacher') return 5; // + Teacher Name
    if (data.userType === 'student') return 5; // + Name, Report Code
    return 4;
  };

  const totalSteps = getTotalSteps();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    // Reset step when user type changes
    if (data.userType && step === 4) {
      setStep(4); // Stay on step 4 (user type selection)
    }
  }, [data.userType]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data as OnboardingData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.acceptedPrivacy;
      case 2:
        return data.acceptedTerms;
      case 3:
        return data.acceptedDisclaimer;
      case 4:
        return !!data.userType;
      case 5:
        if (data.userType === 'teacher') {
          return data.teacherName && data.teacherName.trim().length > 0;
        }
        if (data.userType === 'student') {
          // Student: Name and Report Code
          if (!data.studentName || data.studentName.trim().length === 0) return false;
          if (!data.reportCode || data.reportCode.trim().length === 0) return false;
          return true;
        }
        return false;
      default:
        return true;
    }
  };

  const getStepIcon = () => {
    if (step <= 3) {
      switch (step) {
        case 1: return Shield;
        case 2: return FileText;
        case 3: return AlertTriangle;
        default: return Shield;
      }
    }
    if (step === 4) return UserCheck;
    if (data.userType === 'teacher') return Users;
    if (data.userType === 'student') return GraduationCap;
    return User;
  };

  const generateClassroomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const StepIcon = getStepIcon();

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden p-4 md:p-8">
      <GrainOverlay />
      
      {/* WebGL Background */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8"
            colorB="#e19136"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#0066ff"
            upColor="#0066ff"
            downColor="#d1d1d1"
            leftColor="#e19136"
            rightColor="#e19136"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl relative z-10 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-white/90">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-white/70">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-background/30 rounded-full h-2 overflow-hidden backdrop-blur-md">
            <motion.div
              className="bg-gradient-to-r from-primary via-primary/90 to-accent h-2 rounded-full shadow-lg shadow-primary/20"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border-2 border-primary/40">
                    <StepIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white font-light">
                      {step === 1 && 'Privacy Policy'}
                      {step === 2 && 'Terms of Use'}
                      {step === 3 && 'Important Disclaimer'}
                      {step === 4 && 'Select Your Role'}
                      {step === 5 && data.userType === 'teacher' && 'Teacher Information'}
                      {step === 5 && data.userType === 'student' && 'Enter Your Details'}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {step === 1 && 'Understanding how we protect your data'}
                      {step === 2 && 'Using SproutSense responsibly'}
                      {step === 3 && 'Understanding the limits of this tool'}
                      {step === 4 && 'Choose how you will use SproutSense'}
                      {step === 5 && data.userType === 'teacher' && 'Tell us about yourself'}
                      {step === 5 && data.userType === 'student' && 'Enter your name and report code'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Privacy Policy */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 max-h-64 overflow-y-auto backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Your Privacy Matters
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/90">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>All data is stored securely and privately</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>We never collect, transmit, or sell your data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>No tracking cookies or analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Student information stays private</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>You can delete all data anytime</span>
                        </li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedPrivacy || false}
                        onChange={(e) => setData({ ...data, acceptedPrivacy: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I understand and accept the privacy policy.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 2: Terms */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-5 max-h-64 overflow-y-auto backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        Terms of Use
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/90">
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>This tool is for educational screening only</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Free for educational use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Results are observational, not diagnostic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>We reserve the right to update the tool</span>
                        </li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedTerms || false}
                        onChange={(e) => setData({ ...data, acceptedTerms: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I agree to use SproutSense according to these terms and conditions.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 3: Disclaimer */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-5 backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Critical Disclaimer
                      </h4>
                      <div className="space-y-3 text-sm text-white/90">
                        <p className="font-medium text-white">
                          This is NOT a medical or diagnostic tool.
                        </p>
                        <p>
                          SproutSense is a screening tool that highlights patterns which MAY indicate
                          learning differences. It cannot diagnose conditions like dyslexia, ADHD, dyscalculia,
                          or any other learning or developmental disorder.
                        </p>
                        <p className="text-white font-medium">
                          If you have concerns, consult with educational professionals.
                        </p>
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedDisclaimer || false}
                        onChange={(e) => setData({ ...data, acceptedDisclaimer: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I understand this is not a diagnostic tool and will seek professional help if needed.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 4: User Type Selection */}
                {step === 4 && (
                  <div className="space-y-4">
                    <p className="text-white/70 text-center mb-6">
                      How will you be using SproutSense?
                    </p>
                    <div className="grid gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all border-2 backdrop-blur-sm ${
                            data.userType === 'teacher'
                              ? 'border-primary/50 bg-primary/20'
                              : 'border-border/30 bg-background/20 hover:border-primary/40 hover:bg-background/30'
                          }`}
                          onClick={() => setData({ ...data, userType: 'teacher' })}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1">Teacher</h3>
                                <p className="text-sm text-white/70">
                                  Upload reports, generate codes for students, and manage assessment data
                                </p>
                              </div>
                              {data.userType === 'teacher' && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all border-2 backdrop-blur-sm ${
                            data.userType === 'student'
                              ? 'border-primary/50 bg-primary/20'
                              : 'border-border/30 bg-background/20 hover:border-primary/40 hover:bg-background/30'
                          }`}
                          onClick={() => setData({ ...data, userType: 'student' })}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                                <GraduationCap className="h-6 w-6 text-accent" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1">Student</h3>
                                <p className="text-sm text-white/70">
                                  Enter your report code from your teacher to view your assessment reports
                                </p>
                              </div>
                              {data.userType === 'student' && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Step 5: Teacher Name or Student Name + Report Code */}
                {step === 5 && (
                  <div className="space-y-4">
                    {data.userType === 'teacher' && (
                      <div className="space-y-2">
                        <Label htmlFor="teacherName" className="text-lg text-white/90">
                          What is your name?
                        </Label>
                        <Input
                          id="teacherName"
                          placeholder="Enter your full name"
                          value={data.teacherName || ''}
                          onChange={(e) => setData({ ...data, teacherName: e.target.value })}
                          className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50"
                          autoFocus
                        />
                      </div>
                    )}
                    {data.userType === 'student' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="studentName" className="text-lg text-white/90">
                            What is your name?
                          </Label>
                          <Input
                            id="studentName"
                            placeholder="Enter your full name"
                            value={data.studentName || ''}
                            onChange={(e) => setData({ ...data, studentName: e.target.value })}
                            className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50"
                            autoFocus
                          />
                        </div>
                        <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 backdrop-blur-sm">
                          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Hash className="h-5 w-5 text-primary" />
                            Report Code
                          </h4>
                          <p className="text-sm text-white/90 mb-4">
                            Your teacher should have shared a unique report code with you. Enter it below to access your assessment report.
                          </p>
                          <div className="space-y-2">
                            <Label htmlFor="reportCode" className="text-sm text-white/90">
                              Enter your report code
                            </Label>
                            <Input
                              id="reportCode"
                              placeholder="Enter 8-character code"
                              value={data.reportCode || ''}
                              onChange={(e) => setData({ ...data, reportCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                              className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50 font-mono"
                              maxLength={8}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <MagneticButton
                      variant="secondary"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      ← Back
                    </MagneticButton>
                  )}
                  <MagneticButton
                    onClick={handleNext}
                    variant="primary"
                    disabled={!canProceed()}
                    className={`flex-1 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {step === totalSteps ? 'Complete Setup' : 'Continue →'}
                  </MagneticButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
