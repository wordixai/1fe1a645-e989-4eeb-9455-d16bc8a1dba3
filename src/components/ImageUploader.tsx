import { useCallback, useState } from "react";
import { Upload, Camera, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function ImageUploader({
  onImageSelect,
  imagePreview,
  onClear,
  isAnalyzing,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  if (imagePreview) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-card">
        <img
          src={imagePreview}
          alt="食物图片"
          className="w-full h-64 md:h-80 object-cover"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-x-0 h-1 gradient-primary animate-scan" />
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-foreground font-medium">AI 分析中...</span>
              </div>
            </div>
          </div>
        )}
        {!isAnalyzing && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-soft hover:bg-card transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Upload className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-1">
            上传食物图片
          </p>
          <p className="text-muted-foreground text-sm">
            拖拽图片到这里，或点击选择图片
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Camera className="w-4 h-4" />
          <span>支持 JPG, PNG, WebP 格式</span>
        </div>
      </div>
    </div>
  );
}
