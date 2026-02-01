import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { message, members, tripName } = await req.json();
    
    console.log('Received message:', message);
    console.log('Trip members:', members);
    console.log('Trip name:', tripName);

    const systemPrompt = `You are an AI assistant that helps parse natural language into expense data for a trip expense splitting app called TripSplit.

Current trip: "${tripName}"
Trip members: ${members.map((m: { name: string }) => m.name).join(', ')}

When the user describes an expense, extract:
1. title: A short description of the expense
2. amount: The numeric amount (extract numbers, handle formats like "$50", "50 dollars", "fifty")
3. paidBy: The name of the person who paid (must match one of the trip members exactly)
4. category: One of: food, stay, travel, shopping, activities, other

IMPORTANT RULES:
- If the user says "I spent" or "I paid", ask who they are (which member)
- If any required info is missing, ask a clarifying question
- If the amount is unclear, ask for confirmation
- If the payer name doesn't match any member, suggest the closest match or ask for clarification

Respond in JSON format:
{
  "type": "expense" | "clarification" | "error",
  "data": {
    // For expense type:
    "title": "string",
    "amount": number,
    "paidBy": "string (exact member name)",
    "category": "food|stay|travel|shopping|activities|other"
  },
  "message": "A friendly message to the user explaining what was understood or asking for clarification"
}

Be conversational and helpful. If the expense is parsed successfully, confirm the details in your message.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI response:', JSON.stringify(aiResponse));

    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Try to parse JSON from the response
    let parsedResponse;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      parsedResponse = JSON.parse(jsonStr.trim());
    } catch {
      console.log('Could not parse JSON, using raw response');
      parsedResponse = {
        type: 'clarification',
        message: content
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-parse-expense:', error);
    return new Response(JSON.stringify({ 
      type: 'error',
      message: error instanceof Error ? error.message : 'An error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
