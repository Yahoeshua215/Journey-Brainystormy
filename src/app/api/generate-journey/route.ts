import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
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

    // Prepare the system message with instructions on how to format the journey
    const systemMessage = `
      You are an expert in creating customer journeys for marketing automation. 
      Generate a detailed journey based on the user's prompt.
      
      Your response should be a JSON object with the following structure:
      {
        "nodes": [
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
              "status": "complete|incomplete",
              // Additional fields based on node type
            }
          }
        ],
        "edges": [
          {
            "id": "string",
            "source": "string (node id)",
            "target": "string (node id)",
            "label": "string (optional)"
          }
        ]
      }
      
      IMPORTANT GUIDELINES:
      1. For entrance nodes, include a "filterCondition" field in the data object to specify the audience criteria
         (e.g., "Last purchase > 45 days ago?") rather than creating a separate filter node.
      2. Do not create separate filter nodes - instead, incorporate filter conditions directly into the entrance node.
      
      IMPORTANT LAYOUT GUIDELINES:
      1. Create a clean, vertical flow with nodes centered along a vertical axis (x=400)
      2. Use increased vertical spacing between nodes (y positions should increase by 220 for each level)
      3. For branch nodes:
         - Position "Yes/True" path nodes to the right (x=700)
         - Position "No/False" path nodes to the left (x=100)
         - Ensure branches reconnect in a symmetrical way
         - When branches reconnect, ensure the reconnection node is perfectly centered (x=400)
      4. Keep the journey visually balanced and symmetrical
      5. Always start with an entrance node and end with at least one exit node
      6. Make sure all nodes are connected with appropriate edges
      7. Be creative but realistic with the journey design
      8. Ensure that parallel branches have the same number of nodes when possible for visual balance
      9. When branches split and later reconnect, make them symmetrical on both sides
      10. Maintain consistent spacing between nodes both vertically and horizontally
      11. All nodes in the main flow (not part of branches) should be perfectly centered at x=400
      
      The client-side will further optimize the layout, but providing a good initial structure helps.
    `;

    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });

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
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return NextResponse.json(
        { error: 'OpenAI API error', details: String(openaiError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating journey:', error);
    return NextResponse.json(
      { error: 'Failed to generate journey', details: String(error) },
      { status: 500 }
    );
  }
} 