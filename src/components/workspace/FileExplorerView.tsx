import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  Plus,
  Trash2,
  Edit2,
  Search,
  Download,
  ChevronRight,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { ProjectFileEntity, GitFileStatus } from '../../types';

interface FileExplorerViewProps {
  files: ProjectFileEntity[];
  activeFilePath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newPath: string) => void;
  onDownloadZip: () => void;
}

export const FileExplorerView: React.FC<FileExplorerViewProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onDownloadZip
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Filter files by search query
  const filteredFiles = files.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.js')) {
      return <FileCode className="w-3.5 h-3.5 text-zinc-300 shrink-0" />;
    }
    if (fileName.endsWith('.json') || fileName.endsWith('.css') || fileName.endsWith('.html')) {
      return <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  };

  const getGitStatusPill = (status: GitFileStatus) => {
    if (status === 'MODIFIED') {
      return <span className="text-[9px] font-mono text-amber-400 font-bold">M</span>;
    }
    if (status === 'UNTRACKED') {
      return <span className="text-[9px] font-mono text-emerald-400 font-bold">U</span>;
    }
    return null;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    onCreateFile(newFilePath.trim());
    setNewFilePath('');
    setIsCreatingNew(false);
  };

  const handleRenameSubmit = (fileId: string) => {
    if (!renameValue.trim()) {
      setEditingFileId(null);
      return;
    }
    onRenameFile(fileId, renameValue.trim());
    setEditingFileId(null);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 border-r border-zinc-800/80 font-mono text-xs select-none">
      {/* Top File Tree Controls */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Files ({files.length})
          </span>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Create new file"
            id="btn-add-workspace-file"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search files */}
        <div className="relative">
          <Search className="w-3 h-3 text-zinc-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-400 text-[11px] focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Inline New File Creator */}
        {isCreatingNew && (
          <form onSubmit={handleCreateSubmit} className="flex items-center gap-1 mt-2">
            <input
              type="text"
              value={newFilePath}
              onChange={(e) => setNewFilePath(e.target.value)}
              placeholder="e.g. components/Card.tsx"
              autoFocus
              className="flex-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white text-[11px] focus:outline-none"
            />
            <button type="submit" className="p-1 text-emerald-400 hover:bg-zinc-800 rounded">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="p-1 text-zinc-400 hover:bg-zinc-800 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* File Items List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {filteredFiles.map((file) => {
          const isActive = file.path === activeFilePath;
          const isEditing = editingFileId === file.id;

          if (isEditing) {
            return (
              <div key={file.id} className="flex items-center gap-1 px-2 py-1 bg-zinc-900 rounded-lg">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  className="flex-1 px-1 py-0.5 bg-zinc-950 border border-zinc-700 text-white text-[11px] rounded focus:outline-none"
                />
                <button
                  onClick={() => handleRenameSubmit(file.id)}
                  className="text-emerald-400 hover:text-emerald-300 p-0.5"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setEditingFileId(null)}
                  className="text-zinc-400 hover:text-zinc-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.path)}
              className={`w-full group flex items-center justify-between px-2 py-1.5 rounded-lg text-left cursor-pointer transition-colors ${
                isActive
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {getFileIcon(file.name)}
                <span className="truncate text-[11px]">{file.path}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {getGitStatusPill(file.gitStatus)}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(file.id);
                    setRenameValue(file.path);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-white transition-opacity"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete ${file.path}?`)) {
                      onDeleteFile(file.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-red-400 transition-opacity"
                  title="Delete file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Export Action */}
      <div className="p-3 border-t border-zinc-800/80">
        <button
          onClick={onDownloadZip}
          className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          id="btn-explorer-download-zip"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export ZIP Archive</span>
        </button>
      </div>
    </div>
  );
};
