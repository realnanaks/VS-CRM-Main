import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, Download, Share2, Loader2, Database, Code2, Tag, Cpu, Search, ShieldCheck, BarChart } from 'lucide-react';
import { cn } from '../utils/cn';

export const Infographics: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=800'
    ]);

    const phases = [
        { number: "1", title: "Synthetic Data Generation", goal: "Generating realistic but artificial data for 100,000 players and approximately 4 million interaction records to mimic real-world gambling patterns without compromising user privacy.", color: "indigo" },
        { number: "2", title: "Feature Engineering", goal: "Converting raw betting logs into meaningful behavioral indicators—such as a player's 'speed of play' or risk behaviors like 'loss chasing' (increasing stakes or deposit frequency to recover lost funds).", color: "blue" },
        { number: "3", title: "Heuristic Labeling", goal: "Creating a logic-based rule to define 'Success' for the model. We define a positive outcome (y=1) only when a player both claims an offer AND actively uses it, distinguishing genuine engagement from 'empty clicks'.", color: "cyan" },
        { number: "4", title: "Model Training", goal: "Training supervised machine learning algorithms (Logistic Regression, Random Forest, XGBoost) to recognize patterns in the data and predict which players are most likely to accept specific offers.", color: "violet" },
        { number: "5", title: "Explainable AI (XAI) Analysis", goal: "Using interpretability techniques to peer inside the 'black box' models, ensuring the decision logic is transparent and legally defensible.", color: "fuchsia" },
        { number: "6", title: "RG Filtering", goal: "Applying a 'Safety Net' rule that automatically blocks promotional offers if a player's behavior indicates a high risk of gambling harm.", color: "rose" },
        { number: "7", title: "Multi-Metric Evaluation", goal: "Rigorous testing of the system using both performance metrics (accuracy) and safety audits (ethical compliance) to ensure reliability.", color: "emerald" }
    ];

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Mock generation delay
        setTimeout(() => {
            setIsGenerating(false);
            // Add a mock image
            setGeneratedImages(prev => ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', ...prev]);
            setPrompt('');
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Infographics Studio</h1>
                    <p className="text-slate-500 mt-1">Generate stunning visual insights with AI.</p>
                </div>
            </div>

            {/* Generator Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <Wand2 size={24} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Create New Infographic</h3>
                            <p className="text-sm text-slate-500">Describe the data or concept you want to visualize.</p>
                        </div>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Create a funnel chart showing user conversion from 'Visitor' to 'Whale' with drop-off rates..."
                                className="w-full h-32 p-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className={cn(
                                    "absolute bottom-4 right-4 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all",
                                    isGenerating || !prompt
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                )}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon size={16} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-slate-400" />
                    Recent Creations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedImages.map((img, idx) => (
                        <div key={idx} className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                <img src={img} alt={`Infographic ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-white rounded-full text-slate-700 hover:text-indigo-600 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2 bg-white rounded-full text-slate-700 hover:text-indigo-600 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-900">Infographic #{generatedImages.length - idx}</span>
                                    <span className="text-xs text-slate-500">Just now</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Advanced AI Workflow Infographic */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Dissecting the Advanced AI Workflow</h2>
                    <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                        A structured, responsible, and verifiable process for developing sophisticated AI models, incorporating synthetic data, automated labeling, and ethical compliance.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-indigo-100 hidden md:block"></div>

                    <div className="space-y-8">
                        <WorkflowStep
                            number="1"
                            title="Synthetic Data Generation"
                            icon={Database}
                            color="indigo"
                            description="Create entirely artificial (but statistically representative) datasets that mirror real data properties without private info."
                            details={[
                                "Enables privacy-safe auditing and explanation.",
                                "Techniques: VAEs, GANs."
                            ]}
                        />
                        <WorkflowStep
                            number="2"
                            title="Feature Engineering"
                            icon={Code2}
                            color="blue"
                            description="Transform raw data into 'features' that allow the model to learn patterns effectively."
                            details={[
                                "Domain knowledge turns raw data into inputs.",
                                "Examples: One-hot encoding, scaling, financial stability scores."
                            ]}
                        />
                        <WorkflowStep
                            number="3"
                            title="Heuristic Labeling"
                            icon={Tag}
                            color="cyan"
                            description="Automatically assign labels using predefined 'rules of thumb' or business logic."
                            details={[
                                "Trades precision for speed and scale.",
                                "Useful for bootstrapping models or real-time fraud detection."
                            ]}
                        />
                        <WorkflowStep
                            number="4"
                            title="Model Training"
                            icon={Cpu}
                            color="violet"
                            description="Expose the model to labeled data and iteratively adjust weights to minimize error."
                            details={[
                                "Core learning phase (forward/backward pass).",
                                "Output: Trained model ready for testing."
                            ]}
                        />
                        <WorkflowStep
                            number="5"
                            title="Explainable AI (XAI)"
                            icon={Search}
                            color="fuchsia"
                            description="Make 'black box' AI decisions understandable and interpretable to humans."
                            details={[
                                "Crucial for trust, auditing, and debugging.",
                                "Techniques: SHAP, LIME."
                            ]}
                        />
                        <WorkflowStep
                            number="6"
                            title="RG Filtering Ethical Layer"
                            icon={ShieldCheck}
                            color="rose"
                            description="Safety and compliance filter to ensure outputs adhere to ethical and legal standards."
                            details={[
                                "Guardrail against toxic, biased, or illegal outputs.",
                                "Ensures Fairness, Accountability, and Transparency (FAT)."
                            ]}
                        />
                        <WorkflowStep
                            number="7"
                            title="Multi-Metric Evaluation"
                            icon={BarChart}
                            color="emerald"
                            description="Assess performance using diverse metrics beyond simple accuracy."
                            details={[
                                "Traditional: Accuracy, Precision, Recall.",
                                "Modern: Robustness, stability, Fairness Metrics."
                            ]}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100">
                    <ConceptCard title="Role of SHAP in XAI" desc="Game theory concept used to explain individual model predictions." />
                    <ConceptCard title="Why Synthetic Data?" desc="Crucial for privacy-preserving training and auditing." />
                    <ConceptCard title="Fairness Metrics" desc="Measures to audit models for bias and ensure ethical deployment." />
                    <ConceptCard title="Feature Extraction" desc="Techniques like PCA and t-SNE to reduce complexity." />
                </div>
            </div>

            {/* Research Pipeline Summary (Circular Layout) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-8 overflow-hidden">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">7-Phase Research Pipeline Summary</h2>
                    <p className="text-slate-500 text-sm mt-1">A comprehensive framework for ethical and effective AI model development.</p>
                </div>

                <div className="relative w-full max-w-3xl aspect-square mx-auto">
                    {/* Central Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0">
                        <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center mx-auto mb-2 animate-pulse">
                            <Database className="text-indigo-600 w-12 h-12" />
                        </div>
                        <h3 className="text-lg font-bold text-indigo-900">ML Development<br />Cycle</h3>
                    </div>

                    {/* Connecting Ring */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border-2 border-dashed border-slate-200 -z-10"></div>

                    {/* Connectors (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                        <defs>
                            <marker id="arrowhead" markerWidth="4" markerHeight="2.5" refX="3.5" refY="1.25" orient="auto">
                                <polygon points="0 0, 4 1.25, 0 2.5" fill="#6366f1" />
                            </marker>
                        </defs>
                        {/* Solid Arcs connecting phases */}
                        {phases.map((_, index) => {
                            const angleStep = (2 * Math.PI) / 7;
                            // Increased offset to 0.35 to ensure arrow starts/ends outside the card
                            const angleStart = -Math.PI / 2 + (index * angleStep) + 0.35;
                            const angleEnd = -Math.PI / 2 + (((index + 1) % 7) * angleStep) - 0.35;

                            const x1 = 50 + 40 * Math.cos(angleStart);
                            const y1 = 50 + 40 * Math.sin(angleStart);
                            const x2 = 50 + 40 * Math.cos(angleEnd);
                            const y2 = 50 + 40 * Math.sin(angleEnd);

                            return (
                                <path
                                    key={`connector-${index}`}
                                    d={`M ${x1} ${y1} A 40 40 0 0 1 ${x2} ${y2}`}
                                    fill="none"
                                    stroke="#6366f1" // Indigo-500
                                    strokeWidth="0.4" // Reduced stroke width for elegance
                                    markerEnd="url(#arrowhead)"
                                    className="opacity-80"
                                />
                            );
                        })}
                    </svg>

                    {/* Phases */}
                    {phases.map((phase, index) => {
                        // Calculate position on the circle
                        // Start from top (-90 degrees or -PI/2)
                        const angle = -Math.PI / 2 + (index * (2 * Math.PI) / 7);
                        // Radius as percentage of container size
                        const radius = 40; // 40% from center
                        const left = 50 + radius * Math.cos(angle);
                        const top = 50 + radius * Math.sin(angle);

                        return (
                            <div
                                key={index}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                                style={{ left: `${left}%`, top: `${top}%` }}
                            >
                                <PipelineOval {...phase} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Phase Breakdown (Static List) */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mt-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Detailed Phase Breakdown</h2>
                    <p className="text-slate-500 mt-2">Full descriptions of each stage in the ML Development Cycle.</p>
                </div>
                <div className="space-y-6 max-w-3xl mx-auto">
                    {phases.map((phase, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors bg-slate-50/50">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm",
                                {
                                    "bg-indigo-600": phase.color === "indigo",
                                    "bg-blue-600": phase.color === "blue",
                                    "bg-cyan-600": phase.color === "cyan",
                                    "bg-violet-600": phase.color === "violet",
                                    "bg-fuchsia-600": phase.color === "fuchsia",
                                    "bg-rose-600": phase.color === "rose",
                                    "bg-emerald-600": phase.color === "emerald",
                                }
                            )}>
                                {phase.number}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{phase.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{phase.goal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

const PipelineOval = ({ number, title, goal, color }: any) => {
    const colorClasses: any = {
        indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        cyan: "bg-cyan-50 border-cyan-200 text-cyan-900",
        violet: "bg-violet-50 border-violet-200 text-violet-900",
        fuchsia: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
        rose: "bg-rose-50 border-rose-200 text-rose-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    };

    const badgeClasses: any = {
        indigo: "bg-indigo-600",
        blue: "bg-blue-600",
        cyan: "bg-cyan-600",
        violet: "bg-violet-600",
        fuchsia: "bg-fuchsia-600",
        rose: "bg-rose-600",
        emerald: "bg-emerald-600",
    };

    return (
        <div className="flex flex-col items-center text-center w-32 group">
            <div className={cn(
                "relative w-full px-3 py-4 rounded-2xl border-2 transition-all duration-300 bg-white flex flex-col items-center justify-center shadow-md z-10 group-hover:z-50 group-hover:scale-125 group-hover:shadow-xl",
                colorClasses[color].replace('bg-', 'border-')
            )}>
                <div className={cn(
                    "absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white",
                    badgeClasses[color]
                )}>
                    {number}
                </div>
                <h3 className={cn("text-xs font-bold mb-1 leading-tight px-1 mt-2", colorClasses[color].split(" ")[2])}>{title}</h3>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                    <div className="overflow-hidden">
                        <p className="text-slate-500 text-[10px] mt-1 leading-tight px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{goal}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WorkflowStep = ({ number, title, icon: Icon, description, details, color }: any) => {
    const colorClasses: any = {
        indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
        blue: "bg-blue-100 text-blue-600 border-blue-200",
        cyan: "bg-cyan-100 text-cyan-600 border-cyan-200",
        violet: "bg-violet-100 text-violet-600 border-violet-200",
        fuchsia: "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200",
        rose: "bg-rose-100 text-rose-600 border-rose-200",
        emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    };

    return (
        <div className="relative flex gap-6 md:pl-8">
            <div className={cn(
                "hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full items-center justify-center border-4 border-white shadow-sm z-10",
                colorClasses[color]
            )}>
                <span className="text-xl font-bold">{number}</span>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className={cn("md:hidden w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", colorClasses[color])}>
                        {number}
                    </div>
                    <Icon className={cn("w-6 h-6", colorClasses[color].split(" ")[1])} />
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-slate-600 mb-4">{description}</p>
                <ul className="space-y-1">
                    {details.map((detail: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-500 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ConceptCard = ({ title, desc }: { title: string, desc: string }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h4 className="font-semibold text-indigo-900 mb-1">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

const SparklesIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);
