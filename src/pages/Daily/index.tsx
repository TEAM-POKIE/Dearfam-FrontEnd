export function DailyPage() {
  return (
    <div className="flex justify-center items-center h-app bg-bg-1">
      <div className="mobile-container flex flex-col overflow-y-auto">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-xl font-semibold">Card Title</h3>
              <p className="text-gray-500 text-sm">Card Description</p>
            </div>
            <div className="p-4">
              <p>Card Content</p>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <p>Card Footer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
