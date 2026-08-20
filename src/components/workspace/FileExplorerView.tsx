import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Search,
  ChevronRight,
  ChevronDown,
  FolderPlus
} from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface FileExplorerViewProps {
  files: ProjectFileEntity[];
  activeFilePath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onCreateFolder: (folderPath: string) => void;
  onDeleteFile: (path: string) => void;
  onDuplicateFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

interface TreeNode {
  name: string;
  fullPath: string;
  isFolder: boolean;
  file?: ProjectFileEntity;
  children: { [key: string]: TreeNode };
}

export const FileExplorerView: React.FC<FileExplorerViewProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onDuplicateFile,
  onRenameFile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [newFileInputOpen, setNewFileInputOpen] = useState(false);
  const [newFolderNameInputOpen, setNewFolderNameInputOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [contextMenuFile, setContextMenuFile] = useState<ProjectFileEntity | null>(null);
  const [renameTarget, setRenameTarget] = useState<ProjectFileEntity | null>(null);
  const [renameVal, setRenameVal] = useState('');

  // Build tree
  const tree = useMemo(() => {
    const root: TreeNode = {
      name: '',
      fullPath: '',
      isFolder: true,
      children: {}
    };

    const filteredFiles = files.filter((f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    for (const file of filteredFiles) {
      const parts = file.path.split('/');
      let curr = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (!curr.children[part]) {
          curr.children[part] = {
            name: part,
            fullPath: currentPath,
            isFolder: !isLast,
            file: isLast ? file : undefined,
            children: {}
          };
        }
        curr = curr.children[part];
      }
    }

    return root;
  }, [files, searchQuery]);

  const toggleFolder = (path: string) => {
    setCollapsedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.js')) {
      return <FileCode className="w-4 h-4 text-zinc-200 flex-shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-zinc-300 flex-shrink-0" />;
    }
    if (fileName.endsWith('.md')) {
      return <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />;
    }
    return <FileCode className="w-4 h-4 text-zinc-500 flex-shrink-0" />;
  };

  const handleCreateNewFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onCreateFile(inputVal.trim());
      setInputVal('');
      setNewFileInputOpen(false);
    }
  };

  const handleCreateNewFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onCreateFolder(inputVal.trim());
      setInputVal('');
      setNewFolderNameInputOpen(false);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTarget && renameVal.trim() && renameVal.trim() !== renameTarget.path) {
      onRenameFile(renameTarget.path, renameVal.trim());
      setRenameTarget(null);
      setRenameVal('');
    }
  };

  const renderTree = (node: TreeNode, depth: number = 0) => {
    const entries = Object.values(node.children).sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="flex flex-col">
        {entries.map((item) => {
          if (item.isFolder) {
            const isCollapsed = !!collapsedFolders[item.fullPath];
            return (
              <div key={item.fullPath} className="flex flex-col">
                <button
                  onClick={() => toggleFolder(item.fullPath)}
                  className="flex items-center gap-1.5 py-2 px-2 hover:bg-zinc-900 rounded-lg text-left text-xs font-mono text-zinc-300 hover:text-white transition-colors group min-h-[36px]"
                  style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  {isCollapsed ? (
                    <Folder className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-white" />
                  )}
                  <span className="truncate">{item.name}</span>
                </button>
                {!isCollapsed && renderTree(item, depth + 1)}
              </div>
            );
          }

          const file = item.file!;
          const isSelected = activeFilePath === file.path;
          const isModified = file.gitStatus === 'MODIFIED';

          return (
            <div
              key={file.path}
              className={`group flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer text-xs font-mono transition-colors min-h-[36px] ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
              style={{ paddingLeft: `${depth * 12 + 20}px` }}
              onClick={() => onSelectFile(file.path)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getFileIcon(file.name)}
                <span className="truncate">{file.name}</span>
                {isModified && (
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-black' : 'bg-white'}`} title="Modified" />
                )}
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameTarget(file);
                    setRenameVal(file.path);
                  }}
                  className={`p-1 rounded ${isSelected ? 'hover:bg-zinc-200 text-black' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateFile(file.path);
                  }}
                  className={`p-1 rounded ${isSelected ? 'hover:bg-zinc-200 text-black' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete file "${file.path}"?`)) {
                      onDeleteFile(file.path);
                    }
                  }}
                  className={`p-1 rounded ${isSelected ? 'hover:bg-zinc-200 text-black' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-r border-zinc-800/80 select-none">
      {/* Header & New Actions */}
      <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          File Tree
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setNewFileInputOpen(true);
              setNewFolderNameInputOpen(false);
              setInputVal('');
            }}
            className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
            title="New File"
            id="btn-new-file"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setNewFolderNameInputOpen(true);
              setNewFileInputOpen(false);
              setInputVal('');
            }}
            className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
            title="New Folder"
            id="btn-new-folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-zinc-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Inline Create Input */}
      {newFileInputOpen && (
        <form onSubmit={handleCreateNewFileSubmit} className="p-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-400 mb-1">New File Path:</div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. components/Card.tsx"
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-600 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white"
          />
          <div className="flex justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setNewFileInputOpen(false)}
              className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-[11px] bg-white text-black font-semibold rounded hover:bg-zinc-200"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {newFolderNameInputOpen && (
        <form onSubmit={handleCreateNewFolderSubmit} className="p-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-400 mb-1">New Folder Name:</div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. lib/utils"
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-600 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white"
          />
          <div className="flex justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setNewFolderNameInputOpen(false)}
              className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-[11px] bg-white text-black font-semibold rounded hover:bg-zinc-200"
            >
              Add Folder
            </button>
          </div>
        </form>
      )}

      {renameTarget && (
        <form onSubmit={handleRenameSubmit} className="p-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-400 mb-1">Rename File:</div>
          <input
            type="text"
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-600 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white"
          />
          <div className="flex justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-[11px] bg-white text-black font-semibold rounded hover:bg-zinc-200"
            >
              Rename
            </button>
          </div>
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-1.5 py-2 space-y-0.5">
        {files.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500 font-mono">
            No files in project
          </div>
        ) : (
          renderTree(tree)
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-2.5 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex justify-between">
        <span>{files.length} files</span>
        <span>{files.reduce((acc, f) => acc + f.linesCount, 0)} lines</span>
      </div>
    </div>
  );
};
