# Gemini AI Integration Setup

This project includes a scaffold for integrating Google's Gemini AI API. Here's how to set it up:

## 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Install Dependencies

For the serverless function, you'll need to install the Google Generative AI SDK:

```bash
npm install @google/generative-ai
```

## 4. Deployment Options

### Option A: Vercel (Recommended)
- Deploy your app to Vercel
- Add `GEMINI_API_KEY` to your Vercel environment variables
- The `api/gemini.ts` file will automatically work as a serverless function

### Option B: Next.js
- Move `api/gemini.ts` to `pages/api/gemini.ts`
- Deploy to Vercel, Netlify, or any Next.js hosting platform

### Option C: Express.js
- Use the Express.js example in `api/gemini.ts`
- Deploy to Railway, Render, or any Node.js hosting platform

## 5. Testing

1. Start your development server: `npm run dev`
2. Navigate to the Dashboard page
3. Try sending a message to the AI assistant
4. Check the browser console for any errors

## 6. Features

- **Chat Interface**: Clean, responsive chat UI with message history
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during API calls
- **Theme Integration**: Works with both light and dark themes
- **Responsive Design**: Works on mobile, tablet, and desktop

## 7. Customization

You can customize the AI assistant by modifying:
- **Prompt**: Edit the prompt in `api/gemini.ts` to change the AI's behavior
- **Model**: Change the model from `gemini-pro` to other available models
- **Styling**: Modify the Agent component styling in `src/components/Agent.tsx`

## 8. Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use
- Add authentication if needed for your use case
