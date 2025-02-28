import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div>
        <h2 className="text-2xl font-semibold text-center border p-4 font-mono rounded-md">
          Get started by choosing a template path from the /paths/ folder.
        </h2>
      </div>
      <div>
        <h1 className="text-6xl font-bold text-center">Make anything you imagine 🪄</h1>
        <h2 className="text-2xl text-center font-light text-gray-500 pt-4">
          This whole page will be replaced when you run your template path.
        </h2>
        <div className="mt-6 text-center flex justify-center gap-4">
          <Link href="/flow" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            View React Flow Demo
          </Link>
          <Link href="/journey" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Try Journey Builder
          </Link>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">AI Chat App</h3>
          <p className="mt-2 text-sm text-gray-600">
            An intelligent conversational app powered by AI models, featuring real-time responses
            and seamless integration with Next.js and various AI providers.
          </p>
        </div>
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">AI Image Generation App</h3>
          <p className="mt-2 text-sm text-gray-600">
            Create images from text prompts using AI, powered by the Replicate API and Next.js.
          </p>
        </div>
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">Social Media App</h3>
          <p className="mt-2 text-sm text-gray-600">
            A feature-rich social platform with user profiles, posts, and interactions using
            Firebase and Next.js.
          </p>
        </div>
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">Voice Notes App</h3>
          <p className="mt-2 text-sm text-gray-600">
            A voice-based note-taking app with real-time transcription using Deepgram API, 
            Firebase integration for storage, and a clean, simple interface built with Next.js.
          </p>
        </div>
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">React Flow Demo</h3>
          <p className="mt-2 text-sm text-gray-600">
            A demonstration of React Flow, a highly customizable library for building node-based UIs,
            workflow builders, and interactive diagrams.
          </p>
          <Link href="/flow" className="mt-3 inline-block text-blue-500 hover:underline">
            View Demo →
          </Link>
        </div>
        <div className="border rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-xl font-semibold">Journey Builder</h3>
          <p className="mt-2 text-sm text-gray-600">
            Create automated notification journeys for user engagement with a visual flow builder.
            Supports push notifications, email, SMS, and in-app messages.
          </p>
          <Link href="/journey" className="mt-3 inline-block text-green-500 hover:underline">
            Try Builder →
          </Link>
        </div>
      </div>
    </main>
  );
}
