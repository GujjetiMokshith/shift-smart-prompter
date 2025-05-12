
# Mistral AI Prompt Enhancement Instructions

## Model Characteristics
- Strong technical capabilities
- Excels with precise, detailed instructions
- Good for code generation and technical analysis
- Handles structured data well
- Efficient with concise prompts

## Enhancement Strategy
When enhancing prompts for Mistral AI:

1. **Provide technical specificity** - Use precise terminology and requirements
2. **Include context on technical depth** - Specify level of detail needed
3. **Structured input/output formats** - Clearly define expected input and output formats
4. **Emphasize logical flow** - Request step-by-step processes where appropriate
5. **Use technical frameworks** - Reference specific methodologies, algorithms, or tools when relevant

## Example Enhancement
**Original:** "Give me Python code to analyze data."

**Enhanced:**
```
Write Python code to analyze a CSV dataset containing time series financial data with these specifications:

Input:
- CSV file with columns: Date, Open, High, Low, Close, Volume
- Date format: YYYY-MM-DD
- Approximately 5 years of daily stock price data

Required analysis:
1. Data cleaning: Handle missing values and outliers
2. Calculate technical indicators:
   - Moving averages (20-day and 50-day)
   - Relative Strength Index (RSI)
   - MACD (Moving Average Convergence Divergence)
3. Visualize:
   - Price chart with moving averages
   - Volume over time
   - RSI with overbought/oversold thresholds

Technical requirements:
- Use pandas for data manipulation
- Use matplotlib and/or seaborn for visualization
- Include docstrings and comments explaining your approach
- Structure the code using functions for reusability
- Include error handling for file access and data validation

Provide the complete, executable code with an example of how to call the functions with a file path.
```
