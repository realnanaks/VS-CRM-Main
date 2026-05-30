// AI Service using Google Gemini
// Provides intelligent insights, report generation, and natural language queries

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
// Note: In production, use environment variable for API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate insights from data
 * @param {Object} data - Data to analyze
 * @param {string} context - Context about the data
 * @returns {Promise<Object>} AI-generated insights
 */
async function generateInsights(data, context = '') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
You are a marketing analytics expert for Echo House, a marketing agency operating across 7 African countries.

Context: ${context}

Data Summary:
${JSON.stringify(data, null, 2)}

Please analyze this data and provide:
1. Key insights (3-5 bullet points)
2. Trends or patterns you notice
3. Actionable recommendations
4. Potential risks or opportunities

Format your response as JSON with the following structure:
{
  "insights": ["insight 1", "insight 2", ...],
  "trends": ["trend 1", "trend 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "risks": ["risk 1", "risk 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse as JSON, fallback to structured text
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return structured text
      return {
        insights: [text],
        trends: [],
        recommendations: [],
        risks: [],
        opportunities: []
      };
    }
    
    return { insights: [text] };
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
}

/**
 * Generate a report from data
 * @param {string} reportType - Type of report (executive, campaign, country, department, client)
 * @param {Object} data - Data for the report
 * @param {Object} options - Report options (format, period, etc.)
 * @returns {Promise<Object>} Generated report
 */
async function generateReport(reportType, data, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let prompt = '';
    
    switch (reportType) {
      case 'executive':
        prompt = `
Generate an executive summary report for Echo House marketing agency.

Data:
${JSON.stringify(data, null, 2)}

Create a comprehensive executive summary including:
1. Overall Performance Summary
2. Key Metrics and KPIs
3. Top Achievements
4. Challenges and Concerns
5. Strategic Recommendations

Format as a professional business report.
`;
        break;
        
      case 'campaign':
        prompt = `
Generate a campaign performance report for Echo House.

Campaign Data:
${JSON.stringify(data, null, 2)}

Include:
1. Campaign Overview
2. Performance Metrics (reach, engagement, conversions)
3. ROI Analysis
4. Audience Insights
5. Optimization Recommendations

Format as a detailed campaign analysis.
`;
        break;
        
      case 'country':
        prompt = `
Generate a country performance report for Echo House operations in ${options.country || 'the region'}.

Data:
${JSON.stringify(data, null, 2)}

Include:
1. Market Overview
2. Performance by Department
3. Top Clients and Revenue
4. Growth Trends
5. Market-Specific Recommendations

Format as a regional performance report.
`;
        break;
        
      case 'department':
        prompt = `
Generate a department performance report for ${options.department || 'the department'}.

Data:
${JSON.stringify(data, null, 2)}

Include:
1. Department Overview
2. Key Projects and Deliverables
3. Resource Utilization
4. Performance Metrics
5. Improvement Opportunities

Format as a department performance review.
`;
        break;
        
      case 'client':
        prompt = `
Generate a client health report for Echo House.

Client Data:
${JSON.stringify(data, null, 2)}

Include:
1. Client Portfolio Overview
2. Satisfaction Scores
3. Revenue Analysis
4. Churn Risk Assessment
5. Upsell Opportunities

Format as a client relationship report.
`;
        break;
        
      default:
        prompt = `
Generate a general report for Echo House.

Data:
${JSON.stringify(data, null, 2)}

Provide a comprehensive analysis with insights and recommendations.
`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      type: reportType,
      generatedAt: new Date().toISOString(),
      content: text,
      data: data
    };
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
}

/**
 * Answer natural language queries about data
 * @param {string} query - User's question
 * @param {Object} data - Available data
 * @returns {Promise<string>} AI-generated answer
 */
async function answerQuery(query, data) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
You are an AI assistant for Echo House, a marketing agency with operations in Ghana, Nigeria, Ivory Coast, South Africa, Benin, and Togo.

Available Data:
${JSON.stringify(data, null, 2)}

User Question: ${query}

Please provide a clear, concise answer based on the available data. If the data doesn't contain enough information to answer the question, say so and suggest what data would be needed.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering query:', error);
    throw new Error(`Failed to answer query: ${error.message}`);
  }
}

/**
 * Predict campaign performance
 * @param {Object} campaignData - Campaign details
 * @param {Object} historicalData - Historical campaign data
 * @returns {Promise<Object>} Performance predictions
 */
async function predictCampaignPerformance(campaignData, historicalData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
As a marketing analytics expert, predict the performance of this campaign based on historical data.

Campaign Details:
${JSON.stringify(campaignData, null, 2)}

Historical Performance:
${JSON.stringify(historicalData, null, 2)}

Provide predictions for:
1. Expected reach
2. Estimated engagement rate
3. Predicted conversion rate
4. Estimated ROI
5. Success probability (0-100%)
6. Key success factors
7. Potential challenges

Format as JSON:
{
  "reach": number,
  "engagementRate": number,
  "conversionRate": number,
  "roi": number,
  "successProbability": number,
  "successFactors": ["factor1", "factor2"],
  "challenges": ["challenge1", "challenge2"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      return {
        successProbability: 50,
        note: text
      };
    }
    
    return { note: text };
  } catch (error) {
    console.error('Error predicting performance:', error);
    throw new Error(`Failed to predict performance: ${error.message}`);
  }
}

/**
 * Analyze client churn risk
 * @param {Object} clientData - Client information and history
 * @returns {Promise<Object>} Churn risk analysis
 */
async function analyzeChurnRisk(clientData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Analyze the churn risk for this client.

Client Data:
${JSON.stringify(clientData, null, 2)}

Provide:
1. Churn risk score (0-100, where 100 is highest risk)
2. Risk factors
3. Warning signs
4. Retention recommendations

Format as JSON:
{
  "riskScore": number,
  "riskLevel": "low" | "medium" | "high",
  "riskFactors": ["factor1", "factor2"],
  "warningSigns": ["sign1", "sign2"],
  "recommendations": ["rec1", "rec2"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      return {
        riskScore: 50,
        riskLevel: 'medium',
        note: text
      };
    }
    
    return { note: text };
  } catch (error) {
    console.error('Error analyzing churn risk:', error);
    throw new Error(`Failed to analyze churn risk: ${error.message}`);
  }
}

/**
 * Generate budget optimization recommendations
 * @param {Object} budgetData - Current budget allocation
 * @param {Object} performanceData - Performance by channel/campaign
 * @returns {Promise<Object>} Budget recommendations
 */
async function optimizeBudget(budgetData, performanceData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Optimize budget allocation based on performance data.

Current Budget:
${JSON.stringify(budgetData, null, 2)}

Performance Data:
${JSON.stringify(performanceData, null, 2)}

Provide:
1. Recommended budget reallocation
2. Expected impact
3. Rationale for changes

Format as JSON with recommended allocations and reasoning.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      recommendations: text,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error optimizing budget:', error);
    throw new Error(`Failed to optimize budget: ${error.message}`);
  }
}

module.exports = {
  generateInsights,
  generateReport,
  answerQuery,
  predictCampaignPerformance,
  analyzeChurnRisk,
  optimizeBudget
};
