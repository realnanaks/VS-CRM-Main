import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreHorizontal, Plus, Check, BrainCircuit, Upload, Download, User, Mail, Building } from 'lucide-react';
import { Contact, CountryCode } from '../types';
import { Button } from './ui/Button';
import { retrieveDashboardData, addContact, importContacts, subscribeToStateChanges, updateContact } from '../services/data';
import { predictLeadScore } from '../services/gemini';
import { Modal } from './ui/Modal';
import { cn } from '../utils/cn';

interface ContactsProps {
  country: CountryCode;
}

export const Contacts: React.FC<ContactsProps> = ({ country }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Lead' | 'Customer' | 'Churned'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Contact State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newStatus, setNewStatus] = useState<'Lead' | 'Customer' | 'Churned'>('Lead');

  useEffect(() => {
    const update = () => setContacts(retrieveDashboardData(country).contacts);
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePredictScore = async (contact: Contact) => {
    const { score, reason } = await predictLeadScore(contact);
    updateContact({ ...contact, score, scoreReason: reason });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 ring-emerald-500/30 bg-emerald-50';
    if (score >= 50) return 'text-amber-600 ring-amber-500/30 bg-amber-50';
    return 'text-red-600 ring-red-500/30 bg-red-50';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateContact = () => {
    if (!newName || !newEmail) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      company: newCompany || 'N/A',
      status: newStatus,
      lastContact: 'Just now',
      avatar: `https://picsum.photos/40/40?random=${Date.now()}`,
      country: country === 'Global' ? 'US' : country,
      score: 50,
      scoreReason: 'New contact added manually.'
    };

    addContact(newContact);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewCompany('');
    setNewStatus('Lead');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      // Simple CSV Parsing logic
      const lines = text.split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

      // Find indices
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const companyIdx = headers.findIndex(h => h.includes('company'));
      const statusIdx = headers.findIndex(h => h.includes('status'));

      const newContacts: Contact[] = [];

      // Start from 1 to skip headers
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',').map(c => c.trim());

        // Basic validation: must have at least a name or email
        if (!cols[nameIdx] && !cols[emailIdx]) continue;

        const newContact: Contact = {
          id: `imported-${Date.now()}-${i}`,
          name: nameIdx > -1 ? cols[nameIdx] : 'Unknown',
          email: emailIdx > -1 ? cols[emailIdx] : '',
          company: companyIdx > -1 ? cols[companyIdx] : 'N/A',
          status: statusIdx > -1 && ['Lead', 'Customer', 'Churned'].includes(cols[statusIdx])
            ? cols[statusIdx] as any
            : 'Lead',
          lastContact: 'Just now',
          avatar: `https://picsum.photos/40/40?random=${Date.now() + i}`,
          country: country === 'Global' ? 'US' : country,
          score: 50, // Default score
          scoreReason: 'Newly imported contact'
        };

        newContacts.push(newContact);
      }

      if (newContacts.length > 0) {
        importContacts(newContacts);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert(`Successfully imported ${newContacts.length} contacts.`);
      } else {
        alert("Failed to parse CSV. Please ensure headers include Name, Email, and Company.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts {country !== 'Global' && `(${country})`}</h1>
          <p className="text-sm text-gray-500">Manage leads and customers across your regions.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button variant="secondary" onClick={handleImportClick}>
            <Upload size={16} className="mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100 z-10 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full rounded-lg border-none bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative" ref={filterRef}>
          <Button
            variant={statusFilter === 'All' ? "secondary" : "primary"}
            className="flex"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-2" />
            Filter
            {statusFilter !== 'All' && (
              <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-xs">
                {statusFilter}
              </span>
            )}
          </Button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg z-20">
              {(['All', 'Lead', 'Customer', 'Churned'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsFilterOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    statusFilter === status ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span>{status}</span>
                  {statusFilter === status && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Contact</th>
                <th className="px-6 py-4 font-medium">Region</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-gray-400">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 group relative">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-1",
                        getScoreColor(contact.score)
                      )}>
                        {contact.score}
                      </div>
                      <button
                        onClick={() => handlePredictScore(contact)}
                        className="p-1 text-gray-300 hover:text-indigo-600 transition-colors"
                        title="Recalculate Score with AI"
                      >
                        <BrainCircuit size={16} />
                      </button>
                      {contact.scoreReason && (
                        <div className="absolute left-10 top-0 z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {contact.scoreReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      contact.status === 'Customer' && "bg-emerald-100 text-emerald-800",
                      contact.status === 'Lead' && "bg-blue-100 text-blue-800",
                      contact.status === 'Churned' && "bg-gray-100 text-gray-800"
                    )}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{contact.lastContact}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {contact.country}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No contacts found for this region.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Contact">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Jane Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="jane@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <div className="relative">
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Acme Corp"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <option value="Lead">Lead</option>
              <option value="Customer">Customer</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateContact} disabled={!newName || !newEmail}>Add Contact</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};