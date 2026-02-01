import { FoodAnalysis } from "../components/NutritionResult";

const AI_GATEWAY_URL = (window as any).ENV_AI_GATEWAY_URL || "";

export async function analyzeFood(imageDataUrl: string): Promise<FoodAnalysis> {
  const base64Data = imageDataUrl.split(",")[1];

  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Data,
              },
            },
            {
              type: "text",
              text: `请分析这张图片中的食物，并提供以下JSON格式的营养信息（只返回JSON，不要其他文字）：

{
  "name": "食物名称（中文）",
  "calories": 估算卡路里数值（数字，单位：千卡）,
  "protein": 蛋白质克数（数字）,
  "carbs": 碳水化合物克数（数字）,
  "fat": 脂肪克数（数字）,
  "confidence": 你对这个分析的置信度（1-100的数字）,
  "tips": "一句简短的健康饮食建议（中文）"
}

注意：
1. 如果图片中有多种食物，请估算整体的营养成分总和
2. 数值应该是合理的估算值
3. 如果无法识别食物，name设为"无法识别"，其他数值设为0，confidence设为0`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("AI 分析请求失败");
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || "";

  // 提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("无法解析 AI 响应");
  }

  const result = JSON.parse(jsonMatch[0]) as FoodAnalysis;
  return result;
}
