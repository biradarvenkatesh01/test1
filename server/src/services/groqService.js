import { Groq } from 'groq-sdk';

let groqClient = null;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not configured.');
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

/**
 * Generates flashcards for a specific topic using Groq AI.
 * @param {string} topic
 * @param {number} count
 * @returns {Promise<Array<{question: string, answer: string}>>}
 */
export async function generateFlashcards(topic, count) {
  const groq = getGroqClient();
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const systemPrompt = `You are a professional educational assistant that creates clear, highly readable study flashcards.
Generate exactly ${count} flashcards for the topic provided by the user.
Your output must be a valid JSON object containing a single key "flashcards", which is an array of flashcard objects.
Each flashcard object must have exactly two string properties: "question" and "answer".
Do not include any extra text, markdown wrappers, comments, HTML, or explanations outside the JSON object.
Format example:
{
  "flashcards": [
    {
      "question": "What is the mitochondria?",
      "answer": "The organelle responsible for generating cell energy (ATP)."
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Topic: "${topic}"` }
    ],
    model: model,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Groq AI returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error('Failed to parse Groq AI response as JSON.');
  }

  const flashcards = parsed.flashcards;

  if (!Array.isArray(flashcards)) {
    throw new Error('AI output is invalid: "flashcards" property is missing or not an array.');
  }

  if (flashcards.length !== count) {
    throw new Error(`AI generated ${flashcards.length} cards, but exactly ${count} were requested.`);
  }

  for (let i = 0; i < flashcards.length; i++) {
    const card = flashcards[i];
    if (!card.question || typeof card.question !== 'string' || !card.question.trim()) {
      throw new Error(`AI generated card at index ${i} has an empty or invalid question.`);
    }
    if (!card.answer || typeof card.answer !== 'string' || !card.answer.trim()) {
      throw new Error(`AI generated card at index ${i} has an empty or invalid answer.`);
    }
    card.question = card.question.trim();
    card.answer = card.answer.trim();
  }

  return flashcards;
}
