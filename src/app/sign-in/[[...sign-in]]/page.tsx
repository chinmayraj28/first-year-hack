"use client";

import { SignIn } from "@clerk/nextjs";
import { Shader, ChromaFlow, Swirl } from "shaders/react";
import { GrainOverlay } from "@/components/grain-overlay";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      
      {/* WebGL Background */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
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

      {/* Content */}
      <div
        className={`relative z-10 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border-2 border-primary/40">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-light text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-white/70">
            Sign in to SproutSense Assessment Platform
          </p>
        </div>

        <div className="backdrop-blur-2xl bg-card/80 border-2 border-border/30 rounded-3xl p-4 shadow-2xl">
          <style dangerouslySetInnerHTML={{__html: `
            .cl-socialButtonsBlockButtonText {
              color: #FFFFFF !important;
            }
            .cl-socialButtonsBlockButton {
              color: #FFFFFF !important;
            }
            .cl-socialButtonsBlockButton:hover {
              color: #FFFFFF !important;
            }
            .cl-socialButtonsBlockButtonText__google {
              color: #FFFFFF !important;
            }
            .cl-socialButtonsBlockButtonText__google * {
              color: #FFFFFF !important;
            }
          `}} />
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-xl transition-all duration-200 rounded-xl h-11 shadow-lg",
                socialButtonsBlockButtonText: "!text-white font-medium text-sm",
                dividerLine: "bg-border/40",
                dividerText: "text-white/60 text-xs font-medium",
                formButtonPrimary: 
                  "bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-11 shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02]",
                formFieldInput: 
                  "bg-background/30 border-border/40 text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary backdrop-blur-md h-11 transition-all duration-200 placeholder:text-white/50",
                formFieldLabel: "text-white/90 font-medium text-sm mb-1.5",
                footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors",
                footerActionText: "text-white/70 text-sm",
                identityPreviewText: "text-white/95",
                identityPreviewEditButton: "text-primary hover:text-primary/80 transition-colors",
                formResendCodeLink: "text-primary hover:text-primary/80 font-medium transition-colors",
                otpCodeFieldInput: 
                  "bg-background/30 border-border/40 text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary",
                formFieldInputShowPasswordButton: "text-white/70 hover:text-white transition-colors",
                formFieldAction: "text-primary hover:text-primary/80 font-medium text-sm transition-colors",
                identityPreviewEditButtonIcon: "text-primary",
                formFieldErrorText: "text-red-400 text-sm",
                formFieldSuccessText: "text-green-400 text-sm",
                formFieldWarningText: "text-yellow-400 text-sm",
                alertText: "text-white/90",
                formHeaderTitle: "text-white",
                formHeaderSubtitle: "text-white/80",
              },
              variables: {
                colorPrimary: "#5B8DEF",
                colorBackground: "rgba(26, 26, 26, 0.3)",
                colorInputBackground: "rgba(255, 255, 255, 0.03)",
                colorInputText: "#FFFFFF",
                colorText: "#FFFFFF",
                colorTextSecondary: "#E0E0E0",
                colorDanger: "#EF4444",
                colorSuccess: "#10B981",
                colorWarning: "#F59E0B",
                borderRadius: "0.75rem",
                fontSize: "14px",
              },
            }}
          />
        </div>

        <p className="text-center text-sm text-white/50 mt-6 font-light">
          Professional early learning assessment platform
        </p>
      </div>
    </div>
  );
}
