import React, { useState, useEffect } from 'react';
import { Upload, Search, Image as ImageIcon, Film, FileText, Wand2, MoreHorizontal } from 'lucide-react';
import { Asset, CountryCode } from '../types';
import { Button } from './ui/Button';
import { retrieveDashboardData, subscribeToStateChanges, updateAssetTags } from '../services/data';
import { generateAssetTags } from '../services/gemini';
import { cn } from '../utils/cn';

interface AssetsProps {
  country: CountryCode;
}

export const Assets: React.FC<AssetsProps> = ({ country }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setAssets(retrieveDashboardData(country).assets);
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  const handleGenerateTags = async (asset: Asset) => {
    setLoadingId(asset.id);
    const newTags = await generateAssetTags(asset.name);
    // Combine existing and new unique tags
    const updatedTags = Array.from(new Set([...asset.tags, ...newTags]));
    updateAssetTags(asset.id, updatedTags);
    setLoadingId(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Film size={24} className="text-pink-500" />;
      case 'document': return <FileText size={24} className="text-blue-500" />;
      default: return <ImageIcon size={24} className="text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Asset Manager</h1>
          <p className="text-sm text-gray-500">Centralized media library for {country === 'Global' ? 'all regions' : country}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Search size={16} className="mr-2" /> Search
          </Button>
          <Button>
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className={cn(
            "group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm",
            "hover:shadow-md transition-all"
          )}>
            <div className="aspect-square bg-gray-100 relative flex items-center justify-center overflow-hidden">
              {asset.type === 'image' ? (
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="p-4 rounded-full bg-white shadow-sm">{getIcon(asset.type)}</div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-gray-600 hover:text-gray-900 shadow-sm"><MoreHorizontal size={16} /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 truncate pr-2" title={asset.name}>{asset.name}</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{asset.type}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3 h-12 overflow-hidden content-start">
                {asset.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">#{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">{asset.uploadedAt}</span>
                <button
                  onClick={() => handleGenerateTags(asset)}
                  disabled={loadingId === asset.id}
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Wand2 size={12} className={cn("mr-1", loadingId === asset.id && "animate-spin")} />
                  {loadingId === asset.id ? 'Tagging...' : 'AI Tag'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};