import React, { useState, useEffect } from 'react';
import { Plus, Target, Gift, Calendar, Trash2, MousePointerClick } from 'lucide-react';
import { Promotion, CountryCode } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addPromotion, deletePromotion, subscribeToStateChanges } from '../services/data';

interface PromotionsProps {
  country: CountryCode;
}

export const Promotions: React.FC<PromotionsProps> = ({ country }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const update = () => setPromotions(retrieveDashboardData(country).promotions);
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qualification, setQualification] = useState('');
  const [reward, setReward] = useState('');
  const [requiresOptIn, setRequiresOptIn] = useState(true);
  const [status, setStatus] = useState<'Draft' | 'Active' | 'Expired'>('Draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = () => {
    if (!name || !qualification || !reward) return;

    const newPromo: Promotion = {
      id: Date.now().toString(),
      name,
      description,
      qualificationCriteria: qualification,
      reward,
      requiresOptIn,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      country: country === 'Global' ? 'US' : country
    };

    addPromotion(newPromo);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setQualification('');
    setReward('');
    setRequiresOptIn(true);
    setStatus('Draft');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id: string) => {
    deletePromotion(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions {country !== 'Global' && `(${country})`}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage offers, qualification criteria, and rewards.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Promotion
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <div key={promo.id} className="group relative flex flex-col justify-between rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(promo.status)}`}>
                  {promo.status}
                </div>
                <div className="flex items-center gap-2">
                    {promo.requiresOptIn && (
                        <span className="inline-flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100" title="Opt-in Required">
                            <MousePointerClick size={12} className="mr-1" /> Opt-in
                        </span>
                    )}
                    <button onClick={() => handleDelete(promo.id)} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{promo.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{promo.description}</p>

              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs uppercase mb-1">
                    <Target size={14} />
                    Qualification
                  </div>
                  <p className="text-sm text-gray-700">{promo.qualificationCriteria}</p>
                </div>

                <div className="rounded-lg bg-purple-50/50 p-3 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-800 font-semibold text-xs uppercase mb-1">
                    <Gift size={14} />
                    Reward
                  </div>
                  <p className="text-sm text-gray-700">{promo.reward}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 rounded-b-xl border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
               <div className="flex items-center gap-1">
                 <Calendar size={14} />
                 {promo.startDate ? (
                   <span>{promo.startDate} {promo.endDate ? ` — ${promo.endDate}` : ''}</span>
                 ) : (
                   <span>No dates set</span>
                 )}
               </div>
               <span className="font-medium bg-gray-200 px-1.5 py-0.5 rounded text-[10px]">{promo.country}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promotion">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Reload Bonus"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description (Internal)</label>
             <input
               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
               value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary of the promo..."
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                  value={status} onChange={e => setStatus(e.target.value as any)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
             </div>
             <div className="flex items-center pt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={requiresOptIn}
                    onChange={e => setRequiresOptIn(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-900 font-medium">Requires User Opt-in</span>
                </label>
             </div>
          </div>

          <div className="pt-2">
             <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Target size={16} className="text-blue-600" />
                Qualification Criteria (What users must do)
             </label>
             <textarea
               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-20 resize-none"
               value={qualification} onChange={e => setQualification(e.target.value)}
               placeholder="e.g. Deposit $50 or more..."
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Gift size={16} className="text-purple-600" />
                Reward (What users get)
             </label>
             <textarea
               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-20 resize-none"
               value={reward} onChange={e => setReward(e.target.value)}
               placeholder="e.g. 50 Free Spins on Starburst..."
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
               <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
               <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
             <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button onClick={handleCreate} disabled={!name || !qualification || !reward}>Save Promotion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};