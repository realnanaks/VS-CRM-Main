
import React, { useState, useEffect } from 'react';
import { Plus, Layout, BarChart2, Code, Trash2, Save, Eye, Copy, CheckCircle2, GripVertical, MousePointerClick } from 'lucide-react';
import { Form, FormField, CountryCode } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addForm, updateForm, deleteForm, subscribeToStateChanges } from '../services/data';

interface FormsProps {
  country: CountryCode;
}

export const Forms: React.FC<FormsProps> = ({ country }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'analytics' | 'share'>('builder');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');

  // Builder State
  const [builderFields, setBuilderFields] = useState<FormField[]>([]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const update = () => {
        const data = retrieveDashboardData(country);
        setForms(data.forms);
        if (selectedForm) {
            const updated = data.forms.find(f => f.id === selectedForm.id);
            if (updated) setSelectedForm(updated);
        }
    };
    update();
    return subscribeToStateChanges(update);
  }, [country, selectedForm?.id]);

  const handleCreateForm = () => {
      if (!newFormName) return;
      const newForm: Form = {
          id: Date.now().toString(),
          name: newFormName,
          status: 'Draft',
          country: country === 'Global' ? 'US' : country,
          fields: [
              { id: 'f1', type: 'text', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
              { id: 'f2', type: 'email', label: 'Email Address', required: true, placeholder: 'jane@example.com' }
          ],
          submissions: 0,
          views: 0,
          conversionRate: 0
      };
      addForm(newForm);
      setNewFormName('');
      setIsCreateModalOpen(false);
      handleSelectForm(newForm);
  };

  const handleSelectForm = (form: Form) => {
      setSelectedForm(form);
      setBuilderFields(JSON.parse(JSON.stringify(form.fields)));
      setActiveTab('builder');
  };

  const handleAddField = (type: FormField['type']) => {
      const newField: FormField = {
          id: `field-${Date.now()}`,
          type,
          label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          required: false,
          placeholder: ''
      };
      setBuilderFields([...builderFields, newField]);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
      setBuilderFields(builderFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleRemoveField = (id: string) => {
      setBuilderFields(builderFields.filter(f => f.id !== id));
  };

  const handleSaveForm = () => {
      if (!selectedForm) return;
      updateForm({
          ...selectedForm,
          fields: builderFields,
          status: 'Active' // Auto activate on save for demo
      });
      alert('Form saved successfully!');
  };

  const handleDeleteForm = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this form?')) {
          deleteForm(id);
          if (selectedForm?.id === id) setSelectedForm(null);
      }
  };

  const copyEmbedCode = () => {
      const code = `<script src="https://cdn.visionaryspace.com/forms.js"></script>\n<div data-vs-form="${selectedForm?.id}"></div>`;
      navigator.clipboard.writeText(code);
      alert('Embed code copied to clipboard!');
  };

  // Render Helpers
  const renderFieldInput = (field: FormField) => {
      const baseClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white";
      switch (field.type) {
          case 'textarea': return <textarea className={`${baseClass} h-24 resize-none`} placeholder={field.placeholder} disabled />;
          case 'select': return (
              <select className={baseClass} disabled>
                  <option>Option 1</option>
                  <option>Option 2</option>
              </select>
          );
          default: return <input type={field.type} className={baseClass} placeholder={field.placeholder} disabled />;
      }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
       <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Capture Forms</h1>
          <p className="text-sm text-gray-500">Build high-converting forms and collect leads automatically.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Form
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Sidebar List */}
          <div className="w-64 flex flex-col gap-3 overflow-y-auto pr-2 shrink-0">
              {forms.map(form => (
                  <div 
                    key={form.id} 
                    onClick={() => handleSelectForm(form)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedForm?.id === form.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
                  >
                      <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">{form.name}</h3>
                          <button onClick={(e) => handleDeleteForm(form.id, e)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                      <div className="flex justify-between items-end">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${form.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>{form.status}</span>
                          <span className="text-xs text-gray-500">{form.submissions} leads</span>
                      </div>
                  </div>
              ))}
          </div>

          {/* Main Area */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {selectedForm ? (
                  <>
                    {/* Toolbar */}
                    <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between bg-gray-50/50">
                        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('builder')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'builder' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Builder</button>
                            <button onClick={() => setActiveTab('analytics')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Analytics</button>
                            <button onClick={() => setActiveTab('share')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'share' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Share</button>
                        </div>
                        {activeTab === 'builder' && (
                             <Button size="sm" onClick={handleSaveForm}>
                                 <Save size={14} className="mr-2"/> Save Changes
                             </Button>
                        )}
                    </div>

                    {/* Builder Tab */}
                    {activeTab === 'builder' && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Field Palette & Config */}
                            <div className="w-80 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add Fields</h4>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <button onClick={() => handleAddField('text')} className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">Text</button>
                                    <button onClick={() => handleAddField('email')} className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">Email</button>
                                    <button onClick={() => handleAddField('tel')} className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">Phone</button>
                                    <button onClick={() => handleAddField('textarea')} className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">Long Text</button>
                                    <button onClick={() => handleAddField('select')} className="flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">Dropdown</button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Field Configuration</h4>
                                    {builderFields.map((field, index) => (
                                        <div key={field.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-700 uppercase">{field.type}</span>
                                                <button onClick={() => handleRemoveField(field.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={12}/></button>
                                            </div>
                                            <div className="space-y-2">
                                                <input 
                                                    className="w-full text-sm border-b border-gray-200 py-1 focus:border-indigo-500 outline-none" 
                                                    value={field.label}
                                                    onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                                    placeholder="Field Label"
                                                />
                                                <input 
                                                    className="w-full text-xs border-b border-gray-200 py-1 focus:border-indigo-500 outline-none" 
                                                    value={field.placeholder || ''}
                                                    onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                                                    placeholder="Placeholder text..."
                                                />
                                                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="mr-2"
                                                        checked={field.required}
                                                        onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                                    />
                                                    Required Field
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Preview */}
                            <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative">
                                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
                                    <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}><Layout size={16}/></button>
                                    <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}><Layout size={14} className="rotate-90"/></button>
                                </div>

                                <div className={`bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col ${previewMode === 'mobile' ? 'w-[375px]' : 'w-[600px]'}`}>
                                    <div className="bg-indigo-600 p-6">
                                        <h2 className="text-white text-xl font-bold">{selectedForm.name}</h2>
                                        <p className="text-indigo-100 text-sm mt-1">Fill out the form below to get started.</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {builderFields.map(field => (
                                            <div key={field.id}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                {renderFieldInput(field)}
                                            </div>
                                        ))}
                                        <div className="pt-2">
                                            <button className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
                                        <p className="text-xs text-gray-400">Powered by Visionary Space</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Views</div>
                                    <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        {selectedForm.views} <Eye size={20} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Submissions</div>
                                    <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        {selectedForm.submissions} <MousePointerClick size={20} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Conversion Rate</div>
                                    <div className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
                                        {selectedForm.conversionRate}% <BarChart2 size={20} className="text-indigo-200" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                    <h3 className="font-semibold text-gray-900">Recent Submissions</h3>
                                </div>
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Code size={20} className="text-gray-400"/>
                                    </div>
                                    No submissions yet for this form.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Share Tab */}
                    {activeTab === 'share' && (
                        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50">
                             <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                 <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                     <CheckCircle2 size={32} className="text-emerald-500" />
                                 </div>
                                 <h2 className="text-xl font-bold text-gray-900 mb-2">Your form is ready!</h2>
                                 <p className="text-gray-500 mb-6">Copy the code below and paste it into your website's HTML to start collecting leads.</p>
                                 
                                 <div className="bg-slate-900 rounded-lg p-4 text-left relative group mb-6">
                                     <code className="text-slate-300 text-sm font-mono break-all">
                                         &lt;script src="https://cdn.visionaryspace.com/embed.js"&gt;&lt;/script&gt;<br/>
                                         &lt;div data-vs-form="{selectedForm.id}"&gt;&lt;/div&gt;
                                     </code>
                                     <button 
                                        onClick={copyEmbedCode}
                                        className="absolute top-2 right-2 p-2 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"
                                     >
                                         <Copy size={16} />
                                     </button>
                                 </div>

                                 <div className="flex justify-center gap-3">
                                     <Button variant="secondary">Preview Live Page</Button>
                                     <Button onClick={copyEmbedCode}>Copy Code</Button>
                                 </div>
                             </div>
                        </div>
                    )}

                  </>
              ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                      Select a form to edit or create a new one.
                  </div>
              )}
          </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Form">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
                  <input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Q4 Webinar Registration"
                      value={newFormName}
                      onChange={(e) => setNewFormName(e.target.value)}
                  />
              </div>
              <div className="flex justify-end pt-4">
                  <Button onClick={handleCreateForm} disabled={!newFormName}>Start Building</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};
