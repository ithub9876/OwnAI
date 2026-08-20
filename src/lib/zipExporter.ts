import JSZip from 'jszip';
import { ProjectEntity, ProjectFileEntity } from '../types';

export async function exportProjectToZip(
  project: ProjectEntity,
  files: ProjectFileEntity[]
): Promise<Blob> {
  const zip = new JSZip();

  const cleanName = project.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const projectFolder = zip.folder(cleanName) || zip;

  for (const file of files) {
    projectFolder.file(file.path, file.content);
  }

  // Generate downloadable blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6
    }
  });

  return content;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
