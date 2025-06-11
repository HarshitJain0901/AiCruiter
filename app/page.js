"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Timer, BarChart, BrainCircuit } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  const benefits = [
    {
      title: "Save Time",
      desc: "Automate initial screening interviews and focus on final candidates.",
      icon: <Timer className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Data-Driven Insights",
      desc: "Get detailed analytics and candidate comparisons based on interview responses.",
      icon: <BarChart className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Reduce Bias",
      desc: "Standardized interviews help eliminate unconscious bias in the hiring process.",
      icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
    },
  ];

  const steps = [
    {
      title: "Create Interview",
      desc: "Set up your job requirements and customize interview questions.",
      step: "1",
    },
    {
      title: "Share with Candidates",
      desc: "Send interview links to candidates to complete at their convenience.",
      step: "2",
    },
    {
      title: "Review Results",
      desc: "Get AI-analyzed results, transcripts, and candidate comparisons.",
      step: "3",
    },
  ];

  return (
    <div className="w-full bg-white text-black">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          AiCruiter
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="#how" className="hover:text-blue-600">
            How It Works
          </Link>
          <Link href="/auth" className="hover:text-blue-600">
            Login
          </Link>
        </nav>
        <Link href="/auth">
          <Button size="sm">Get Started</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-3 bg-gradient-to-br from-white to-gray-50 gap-10">
        {/* Text Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            AI-Powered{" "}
            <span className="text-blue-600">Interview Assistant</span> for
            Modern Recruiters
          </h1>
          <p className="text-gray-700 text-lg">
            Let our AI voice agent conduct candidate interviews while you focus
            on finding the perfect match. Save time, reduce bias, and improve
            your hiring process.
          </p>
          <div className="flex gap-4">
            <Link href="/auth">
              <Button> Create Interview </Button>
            </Link>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"> Watch Demo </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl h-96">
                <DialogTitle>
                  <VisuallyHidden>Watch Demo Video</VisuallyHidden>
                </DialogTitle>
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                  <p className="text-gray-600">Video demo will appear here.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-full lg:w-2/3 h-[24rem] md:h-[30rem] lg:h-[36rem]">
          <Image
            src="/image.png"
            alt="Interview Dashboard"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Streamline Your Hiring Process
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {benefits.map(({ title, desc, icon }) => (
            <div
              key={title}
              className="bg-white shadow rounded-2xl p-6 text-left flex flex-col items-center text-center"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-16 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-10">How AiCruiter Works</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {steps.map(({ title, desc, step }) => (
            <div
              key={step}
              className="bg-white shadow rounded-2xl p-6 text-left flex flex-col items-center text-center"
            >
              <div className="text-blue-600 text-2xl font-bold mb-2">
                {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Transform Your Hiring Process?
        </h2>
        <p className="text-gray-600 mb-6">
          Join hundreds of companies already using AiCruiter to find the best
          talent.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth">
            <Button>Get Started for Free</Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Watch Demo</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl h-96">
              <DialogTitle>
                <VisuallyHidden>Watch Demo Video</VisuallyHidden>
              </DialogTitle>
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-gray-600">Video demo will appear here.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 bg-gray-100 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AiCruiter. All rights reserved. <br />
        Created by{" "}
        <span className="text-blue-600 font-medium">Harshit Jain</span>
      </footer>
    </div>
  );
}
