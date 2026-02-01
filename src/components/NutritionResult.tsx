import { Flame, Beef, Wheat, Droplets } from "lucide-react";

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  confidence: number;
  tips?: string;
}

interface NutritionResultProps {
  result: FoodAnalysis;
}

const NutrientBar = ({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="nutrient-bar">
      <div
        className={`nutrient-fill ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export function NutritionResult({ result }: NutritionResultProps) {
  const nutrients = [
    {
      icon: Beef,
      label: "蛋白质",
      value: result.protein,
      unit: "g",
      max: 50,
      color: "bg-rose-500",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      icon: Wheat,
      label: "碳水化合物",
      value: result.carbs,
      unit: "g",
      max: 100,
      color: "bg-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Droplets,
      label: "脂肪",
      value: result.fat,
      unit: "g",
      max: 50,
      color: "bg-sky-500",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
      textColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="space-y-4 animate-slide-up">
      {/* 主卡片 - 食物名称和卡路里 */}
      <div className="result-card gradient-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {result.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">置信度</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">
                  {result.confidence}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary shadow-soft">
            <Flame className="w-6 h-6 text-primary-foreground" />
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-foreground">
                {result.calories}
              </p>
              <p className="text-xs text-primary-foreground/80">千卡</p>
            </div>
          </div>
        </div>

        {/* 营养成分 */}
        <div className="grid grid-cols-3 gap-3">
          {nutrients.map((nutrient) => (
            <div
              key={nutrient.label}
              className={`p-3 rounded-xl ${nutrient.bgColor}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <nutrient.icon className={`w-4 h-4 ${nutrient.textColor}`} />
                <span className="text-xs text-muted-foreground">
                  {nutrient.label}
                </span>
              </div>
              <p className={`text-xl font-bold ${nutrient.textColor} mb-2`}>
                {nutrient.value}
                <span className="text-sm font-normal ml-0.5">
                  {nutrient.unit}
                </span>
              </p>
              <NutrientBar
                value={nutrient.value}
                max={nutrient.max}
                color={nutrient.color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 小贴士 */}
      {result.tips && (
        <div className="result-card bg-secondary/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                健康小贴士
              </p>
              <p className="text-sm text-muted-foreground">{result.tips}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
