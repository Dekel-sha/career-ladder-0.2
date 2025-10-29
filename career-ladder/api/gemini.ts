// Vercel Serverless Function Example
// File: api/gemini.ts (for Vercel deployment)
// 
// This is a scaffold example showing how to integrate Google's Gemini AI
// You'll need to install: npm install @google/generative-ai
// 
// Environment variables needed:
// - GEMINI_API_KEY: Your Google AI API key from https://makersuite.google.com/app/apikey

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' 
      });
    }

    const { messages } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from user' });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a conversation context
    const conversationHistory = messages
      .map((msg: any) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a helpful AI assistant for a job application tracking app called "Career Ladder". 
    You help users with career advice, job application strategies, interview preparation, and general career guidance.
    
    Previous conversation:
    ${conversationHistory}
    
    Please provide a helpful response. Keep it concise but informative.`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    // Return the response
    res.status(200).json({ 
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (error.message.includes('quota')) {
        return res.status(429).json({ error: 'API quota exceeded' });
      }
    }

    res.status(500).json({ 
      error: 'Failed to generate response',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// Alternative: Next.js API Route version
// File: pages/api/gemini.ts (for Next.js)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Same implementation as above
}
*/

// Alternative: Express.js version
// File: server.js (for Express.js)
/*
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/gemini', async (req, res) => {
  // Same implementation as above
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
*/
