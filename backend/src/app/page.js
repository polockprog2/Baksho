export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Baksho Backend API</h1>
        <p className="text-gray-500">The API server is running on port 3001.</p>
        <div className="flex gap-4 justify-center">
          <code className="px-3 py-1 bg-gray-100 rounded text-sm">/api/products</code>
          <code className="px-3 py-1 bg-gray-100 rounded text-sm">/api/categories</code>
        </div>
      </div>
    </div>
  );
}
