import React, { useState } from 'react';
import {
  Upload,
  File,
  Image as ImageIcon,
  Trash2,
  Eye,
  Plus,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AttachmentEntity } from '../../types';

interface AttachmentsViewProps {
  attachments: AttachmentEntity[];
  onAddAttachment: (name: string, mimeType: string, data: string, isVision: boolean) => void;
  onDeleteAttachment: (id: string) => void;
}

export const AttachmentsView: React.FC<AttachmentsViewProps> = ({
  attachments,
  onAddAttachment,
  onDeleteAttachment
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isImage = file.type.startsWith('image/');

    reader.onload = (event) => {
      const data = event.target?.result as string;
      onAddAttachment(file.name, file.type, data, isImage);
    };

    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 select-none text-xs">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-zinc-300" />
          <span className="font-mono font-bold text-zinc-100">Project Attachments</span>
        </div>
        <label className="cursor-pointer px-2.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black font-semibold flex items-center gap-1.5 transition-colors shadow-sm text-xs">
          <Plus className="w-3.5 h-3.5" /> Upload Asset
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.json,.txt,.md,.pdf,.csv"
          />
        </label>
      </div>

      {/* Upload Zone / List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {attachments.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-zinc-600 mb-2" />
            <p className="font-medium text-zinc-300">No attachments in workspace context</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
              Upload UI mockups, architectural specifications, or database schemas for multimodal AI vision analysis.
            </p>
            <label className="mt-4 cursor-pointer px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium transition-colors">
              Select local file
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.json,.txt,.md,.pdf,.csv"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start justify-between group hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  {att.isVisionSupported ? (
                    <ImageIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  ) : (
                    <File className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-mono text-zinc-200 font-medium truncate max-w-[160px]">
                      {att.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-1">
                      <span>{(att.sizeBytes / 1024).toFixed(1)} KB</span>
                      {att.isVisionSupported && (
                        <span className="text-white bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700 font-semibold">
                          VISION
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteAttachment(att.id)}
                  className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
                  title="Remove attachment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-7 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>Multimodal Vision Context for Claude 3.5 & GPT-4o</span>
        <span>Local Encrypted Storage</span>
      </div>
    </div>
  );
};
