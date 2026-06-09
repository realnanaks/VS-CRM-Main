import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, Image as ImageIcon, Loader2 } from 'lucide-react';
import { mockContentScores, mockSubjectLines, mockSendTimes } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function ContentIntelligence() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Wednesday');

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Content Intelligence</h1>
        <p className="text-slate-500 mt-1">AI-powered content analysis and optimization</p>
      </div>

      {/* Content Analyzer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Content Scoring</h2>
        <textarea
          className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Paste your content here to analyze..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing}
            disabled={!content.trim()}
            className="gap-2"
          >
            <Sparkles size={18} />
            Analyze Content
          </Button>
        </div>

        {showResults && (
          <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - mockContentScores.overall / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">{mockContentScores.overall}</div>
                    <div className="text-xs text-slate-500">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(mockContentScores).filter(([key]) => key !== 'overall' && key !== 'suggestions').map(([key, value]) => (
                <div key={key} className={cn("rounded-lg p-4", getScoreBg(value as number))}>
                  <p className="text-xs text-slate-600 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className={cn("text-2xl font-bold", getScoreColor(value as number))}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Sparkles size={18} />
                AI Suggestions
              </h3>
              <ul className="space-y-2">
                {mockContentScores.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Subject Line Optimizer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Subject Line Optimizer</h2>
        <div className="space-y-4">
          {mockSubjectLines.map((line, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Original</span>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getScoreBg(line.score), getScoreColor(line.score))}>
                  Score: {line.score}
                </span>
              </div>
              <p className="text-slate-900 mb-4">{line.original}</p>
              
              <div className="flex items-center justify-between mb-3 pt-3 border-t border-slate-200">
                <span className="text-sm font-medium text-emerald-600">AI Improved</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  Score: {line.improvedScore} (+{line.improvedScore - line.score})
                </span>
              </div>
              <p className="text-slate-900 font-medium">{line.improved}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Send Time */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={24} />
          Optimal Send Time Predictor
        </h2>
        <p className="text-slate-500 text-sm mb-6">AI predicts the best time to send content based on historical engagement</p>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {mockSendTimes.map((day) => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                selectedDay === day.day
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {day.day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {mockSendTimes.find(d => d.day === selectedDay)?.times.map((time) => (
            <div
              key={time.hour}
              className={cn(
                "rounded-lg p-4 border-2 transition-all cursor-pointer",
                time.engagement >= 75
                  ? "border-emerald-500 bg-emerald-50"
                  : time.engagement >= 60
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-slate-200 bg-slate-50"
              )}
            >
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {time.hour}:00
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      time.engagement >= 75 ? "bg-emerald-500" : time.engagement >= 60 ? "bg-yellow-500" : "bg-slate-400"
                    )}
                    style={{ width: `${time.engagement}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600">{time.engagement}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            <strong>💡 Best Time:</strong> {selectedDay} at 14:00 (82% predicted engagement)
          </p>
        </div>
      </div>

      {/* Visual Content Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ImageIcon size={24} />
          Visual Content Analysis
        </h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer">
          <ImageIcon size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">Upload an image to analyze</p>
          <p className="text-sm text-slate-400">AI will check brand compliance and predict engagement</p>
        </div>
      </div>
    </div>
  );
}
