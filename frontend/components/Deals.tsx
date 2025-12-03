
import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, DollarSign, Calendar, User, Briefcase, TrendingUp, BrainCircuit, Loader2 } from 'lucide-react';
import { Deal, CountryCode, DealStage } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addDeal, updateDeal, deleteDeal, subscribeToStateChanges } from '../services/data';
import { analyzeDealProbability } from '../services/gemini';
import { cn } from '../utils/cn';

interface DealsProps {
    country: CountryCode;
}

const STAGES: DealStage[] = ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const Deals: React.FC<DealsProps> = ({ country }) => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // AI Analysis State
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
    const [analysisModalDeal, setAnalysisModalDeal] = useState<Deal | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0);
    const [contactName, setContactName] = useState('');
    const [stage, setStage] = useState<DealStage>('Discovery');
    const [closeDate, setCloseDate] = useState('');

    // Drag and Drop State
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

    useEffect(() => {
        const update = () => setDeals(retrieveDashboardData(country).deals);
        update();
        return subscribeToStateChanges(update);
    }, [country]);

    const getBaseProbability = (s: DealStage) => {
        switch (s) {
            case 'Discovery': return 20;
            case 'Qualified': return 40;
            case 'Proposal': return 60;
            case 'Negotiation': return 80;
            case 'Closed Won': return 100;
            default: return 0;
        }
    };

    const performAIAnalysis = async (deal: Deal) => {
        setAnalyzingIds(prev => new Set(prev).add(deal.id));
        try {
            const result = await analyzeDealProbability(deal);

            const updatedDeal: Deal = {
                ...deal,
                probability: result.score, // Update the main probability field with AI prediction
                aiAnalysis: {
                    score: result.score,
                    reasoning: result.reasoning,
                    lastUpdated: new Date().toISOString()
                }
            };

            updateDeal(updatedDeal);

            // If the modal is open for this deal, update the view
            if (analysisModalDeal?.id === deal.id) {
                setAnalysisModalDeal(updatedDeal);
            }
        } catch (err) {
            console.error("AI Analysis failed", err);
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(deal.id);
                return next;
            });
        }
    };

    const handleCreateDeal = () => {
        if (!title || !value) return;

        const baseProb = getBaseProbability(stage);

        const newDeal: Deal = {
            id: Date.now().toString(),
            title,
            value,
            stage,
            probability: baseProb,
            expectedCloseDate: closeDate || new Date().toISOString().split('T')[0],
            contactName: contactName || 'Unknown Contact',
            country: country === 'Global' ? 'US' : country
        };

        addDeal(newDeal);
        setIsModalOpen(false);
        resetForm();

        // Automatically trigger AI analysis on creation
        performAIAnalysis(newDeal);
    };

    const resetForm = () => {
        setTitle('');
        setValue(0);
        setContactName('');
        setStage('Discovery');
        setCloseDate('');
    };

    // AI Analysis Handler (Manual Trigger)
    const handleAnalyzeDeal = (deal: Deal, e: React.MouseEvent) => {
        e.stopPropagation();

        // If already analyzed, just open the modal to show results
        if (deal.aiAnalysis) {
            setAnalysisModalDeal(deal);
            return;
        }

        // Otherwise, trigger analysis
        performAIAnalysis(deal);
    };

    // Drag Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedDealId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
        e.preventDefault();
        if (!draggedDealId) return;

        const deal = deals.find(d => d.id === draggedDealId);
        if (deal && deal.stage !== targetStage) {
            const baseProb = getBaseProbability(targetStage);

            const updatedDeal: Deal = {
                ...deal,
                stage: targetStage,
                probability: baseProb // Set default first
            };
            updateDeal(updatedDeal);

            // Automatically trigger AI analysis on stage change to refine probability
            performAIAnalysis(updatedDeal);
        }
        setDraggedDealId(null);
    };

    const calculateStageTotal = (stage: DealStage) => {
        return deals.filter(d => d.stage === stage).reduce((acc, curr) => acc + curr.value, 0);
    };

    const calculateTotalPipeline = () => {
        return deals.filter(d => d.stage !== 'Closed Lost').reduce((acc, curr) => acc + curr.value, 0);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline {country !== 'Global' && `(${country})`}</h1>
                    <p className="text-sm text-gray-500">
                        Total Forecast Value: <span className="font-bold text-emerald-600">${calculateTotalPipeline().toLocaleString()}</span>
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Deal
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full gap-4 pb-4 min-w-max">
                    {STAGES.map(stage => (
                        <div
                            key={stage}
                            className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-gray-200/60 max-h-full"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            {/* Column Header */}
                            <div className={cn(
                                "p-3 border-b border-gray-100 rounded-t-xl",
                                stage === 'Closed Won' ? 'bg-emerald-50/50' : stage === 'Closed Lost' ? 'bg-red-50/50' : 'bg-gray-50/50'
                            )}>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage}</h3>
                                    <span className="text-xs text-gray-500 font-medium">{deals.filter(d => d.stage === stage).length}</span>
                                </div>
                                <div className="text-xs font-bold text-gray-900">
                                    ${calculateStageTotal(stage).toLocaleString()}
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
                                {deals.filter(d => d.stage === stage).map(deal => (
                                    <div
                                        key={deal.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, deal.id)}
                                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all group relative"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900 text-sm leading-tight pr-6">{deal.title}</h4>
                                            <div className="absolute top-4 right-3 flex gap-1">
                                                <button
                                                    onClick={(e) => handleAnalyzeDeal(deal, e)}
                                                    className={cn(
                                                        "p-1 rounded-md transition-colors",
                                                        deal.aiAnalysis ? 'text-indigo-600 bg-indigo-50' : 'text-gray-300 hover:text-indigo-600 hover:bg-indigo-50'
                                                    )}
                                                    title="AI Deal Probability"
                                                >
                                                    {analyzingIds.has(deal.id) ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <BrainCircuit size={14} />
                                                    )}
                                                </button>
                                                <button onClick={() => deleteDeal(deal.id)} className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 mb-3">
                                            ${deal.value.toLocaleString()}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Briefcase size={12} />
                                                <span className="truncate">{deal.contactName}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                {deal.aiAnalysis ? (
                                                    <span className={cn(
                                                        "flex items-center gap-1 font-bold",
                                                        deal.aiAnalysis.score >= 70 ? 'text-emerald-600' : deal.aiAnalysis.score >= 40 ? 'text-amber-600' : 'text-red-600'
                                                    )}>
                                                        <BrainCircuit size={10} /> {deal.probability}%
                                                    </span>
                                                ) : (
                                                    <span className={cn(
                                                        "font-medium",
                                                        deal.probability > 75 ? 'text-emerald-600' : deal.probability > 40 ? 'text-amber-600' : 'text-gray-400'
                                                    )}>
                                                        {deal.probability}% Prob.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Deal Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Deal">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Enterprise License - Acme Corp"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                            <input
                                type="number"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                value={closeDate}
                                onChange={(e) => setCloseDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact / Company</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. John Doe"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none"
                            value={stage}
                            onChange={(e) => setStage(e.target.value as DealStage)}
                        >
                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleCreateDeal} disabled={!title || !value}>Create Deal</Button>
                    </div>
                </div>
            </Modal>

            {/* AI Analysis Insight Modal */}
            <Modal isOpen={!!analysisModalDeal} onClose={() => setAnalysisModalDeal(null)} title="AI Deal Insights">
                {analysisModalDeal && analysisModalDeal.aiAnalysis && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <div className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold border-4",
                                analysisModalDeal.aiAnalysis.score >= 70 ? 'border-emerald-200 bg-emerald-100 text-emerald-700' :
                                    analysisModalDeal.aiAnalysis.score >= 40 ? 'border-amber-200 bg-amber-100 text-amber-700' :
                                        'border-red-200 bg-red-100 text-red-700'
                            )}>
                                {analysisModalDeal.aiAnalysis.score}%
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Win Probability</h3>
                                <p className="text-sm text-gray-600">Predicted based on stage, historical data, and deal value.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                <BrainCircuit size={16} className="text-indigo-600" /> AI Reasoning
                            </h4>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 leading-relaxed text-sm">
                                {analysisModalDeal.aiAnalysis.reasoning}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button variant="secondary" onClick={() => setAnalysisModalDeal(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
