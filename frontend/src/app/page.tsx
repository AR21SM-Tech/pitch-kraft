
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail, Send, CheckCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Result {
  job: {
    role: string;
    description: string;
    skills: string[];
    experience: string;
  };
  links: string[];
  email: string;
}

export default function Home() {
  const [url, setUrl] = useState("https://jobs.lever.co/example/job-id");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-400 px-3 py-1 text-sm uppercase tracking-wider">
              AI Outreach Automation
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-500 tracking-tight"
          >
            PitchKraft
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-400 max-w-2xl mx-auto"
          >
            Turn any job URL into a hyper-personalized cold email in seconds.
          </motion.p>
        </header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex gap-2 p-2 bg-neutral-900/50 border border-neutral-800 rounded-full shadow-2xl backdrop-blur-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Job URL (e.g. Lever, Greenhouse, LinkedIn)"
              className="bg-transparent border-0 focus-visible:ring-0 text-lg px-6 h-14 rounded-full text-white placeholder:text-neutral-600"
            />
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading}
              className="h-14 rounded-full px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {loading ? "Crafting..." : "Generate"}
            </Button>
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-8 pb-20">
          <AnimatePresence>
            {results && results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-neutral-900 border-neutral-800 overflow-hidden shadow-2xl">
                  <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-white mb-2">{result.job.role}</CardTitle>
                        <CardDescription className="text-neutral-400 flex items-center gap-2">
                          <span className="bg-neutral-800 px-2 py-1 rounded text-xs">{result.job.experience}</span>
                          Looking for: {result.job.skills.slice(0, 5).join(", ")}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {result.links.length} Portfolio Matches
                      </Badge>
                    </div>
                  </CardHeader>
                  <Separator className="bg-neutral-800" />
                  <CardContent className="grid md:grid-cols-2 gap-8 p-6">
                    {/* Left: Email Editor */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-400" /> Generated Email
                        </h3>
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white" onClick={() => navigator.clipboard.writeText(result.email)}>
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        defaultValue={result.email}
                        className="h-[400px] bg-neutral-950/50 border-neutral-800 text-neutral-300 font-mono text-sm leading-relaxed p-4 resize-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Right: Context & Portfolio */}
                    <div className="space-y-6">
                      <div className="bg-neutral-950/30 p-4 rounded-xl border border-neutral-800/50">
                        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Portfolio Inclusions</h4>
                        <div className="space-y-2">
                          {result.links.map((link, i) => (
                            <a key={i} href={link} target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-2 group">
                              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                              {link}
                            </a>
                          ))}
                          {result.links.length === 0 && <span className="text-neutral-500 text-sm">No specific portfolio links matched.</span>}
                        </div>
                      </div>

                      <div className="bg-neutral-950/30 p-4 rounded-xl border border-neutral-800/50">
                        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Job Summary</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-6">
                          {result.job.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
