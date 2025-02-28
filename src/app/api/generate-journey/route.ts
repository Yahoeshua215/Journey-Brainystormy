import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure Vercel serverless function with longer timeout
export const runtime = 'edge';
// Note: Edge runtime has a maximum timeout of 30 seconds on Vercel's free tier
export const maxDuration = 30; // Set maximum duration to 30 seconds

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  timeout: 25000, // 25 second timeout (to ensure we stay under the 30s Edge limit)
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating journey with prompt:', prompt);

    // Simplified system message to reduce token count while maintaining essential instructions
    const systemMessage = `
      You are an expert in creating customer journeys for marketing automation. 
      Generate a concise journey based on the user's prompt.
      
      Your response should be a JSON object with nodes and edges.
      
      Node structure:
      {
        "id": "string",
        "type": "entrance|push|email|sms|inApp|wait|branch|split|outcome|webhook|exit",
        "position": { "x": number, "y": number },
        "data": {
          "label": "string",
          "message": "string (for message types)",
          "subject": "string (for email)",
          "content": "string (for email)",
          "duration": "string (for wait)",
          "condition": "string (for branch)",
          "status": "complete|incomplete"
        }
      }
      
      Edge structure:
      {
        "id": "string",
        "source": "string (node id)",
        "target": "string (node id)",
        "label": "string (optional)"
      }
      
      GUIDELINES:
      1. Include "filterCondition" in entrance nodes
      2. Center main flow nodes at x=400
      3. Use 220px vertical spacing
      4. Position "Yes" branches at x=700, "No" branches at x=100
      5. Keep branches symmetrical
      6. Start with entrance, end with exit
      7. Ensure all nodes are connected
      8. Add "Yes" and "No" labels to edges from branch nodes
      9. Keep the journey simple with 5-8 nodes maximum
      
      RESPOND ONLY WITH VALID JSON.
    `;

    // Call OpenAI API with retry logic
    let completion;
    let retries = 0;
    const maxRetries = 1; // Reduce max retries to save time
    
    while (retries <= maxRetries) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Use a faster model to reduce timeout risk
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500, // Reduce token count to speed up response
        });
        break; // If successful, exit the retry loop
      } catch (error) {
        retries++;
        if (retries > maxRetries) throw error;
        // Wait before retrying (shorter backoff)
        await new Promise(resolve => setTimeout(resolve, 500 * retries));
      }
    }

    if (!completion) {
      throw new Error('Failed to get completion after retries');
    }

    // Extract the journey JSON from the response
    const journeyText = completion.choices[0].message.content || '';
    console.log('Received response from OpenAI:', journeyText.substring(0, 200) + '...');
    
    // Parse the JSON response
    let journey;
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = journeyText.match(/```json\n([\s\S]*?)\n```/) || 
                        journeyText.match(/```\n([\s\S]*?)\n```/) ||
                        [null, journeyText];
      
      const jsonString = jsonMatch[1] || journeyText;
      journey = JSON.parse(jsonString);
      console.log('Successfully parsed journey JSON');
    } catch (error) {
      console.error('Failed to parse journey JSON:', error);
      console.error('Raw journey text:', journeyText);
      return NextResponse.json(
        { error: 'Failed to generate valid journey data', details: String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ journey });
  } catch (error) {
    console.error('Error generating journey:', error);
    return NextResponse.json(
      { error: 'Failed to generate journey', details: String(error) },
      { status: 500 }
    );
  }
} 