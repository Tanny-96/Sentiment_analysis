import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFUploadProps {
  onFileUpload?: (file: File) => void;
}

export function PDFUpload({ onFileUpload }: PDFUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      onFileUpload?.(pdfFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      onFileUpload?.(file);
    }
  }, [onFileUpload]);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
  }, []);

  return (
    <Card className="sentiment-card">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-5 w-5 text-neon-green" />
        <h3 className="text-lg font-semibold">📝 Upload Support Ticket</h3>
      </div>
      
      {!uploadedFile ? (
        <div
          className={cn(
            "drag-zone",
            isDragOver && "drag-over border-neon-green"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Drop your PDF file here</p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Button variant="outline" className="cursor-pointer">
              Select PDF File
            </Button>
          </label>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-neon-blue" />
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-neon-red hover:text-neon-red-glow"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}