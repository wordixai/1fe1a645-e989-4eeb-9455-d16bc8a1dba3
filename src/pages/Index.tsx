import { useState, useCallback } from "react";
import { Salad, Sparkles } from "lucide-react";
import { ImageUploader } from "../components/ImageUploader";
import { NutritionResult, FoodAnalysis } from "../components/NutritionResult";
import { analyzeFood } from "../lib/ai";

export default function Index() {
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeFood(imagePreview);
      setResult(analysis);
    } catch (err) {
      setError("分析失败，请重试");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [imagePreview]);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-lg mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Salad className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI 卡路里分析
          </h1>
          <p className="text-muted-foreground">
            上传食物图片，AI 为你分析营养成分
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <ImageUploader
            onImageSelect={handleImageSelect}
            imagePreview={imagePreview}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Analyze Button */}
        {imagePreview && !result && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? "分析中..." : "开始分析"}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && <NutritionResult result={result} />}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            AI 分析结果仅供参考，实际营养成分可能因份量和烹饪方式而异
          </p>
        </div>
      </div>
    </div>
  );
}
