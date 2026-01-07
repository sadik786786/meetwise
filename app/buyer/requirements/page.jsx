// Mobile Form Component (Optimized)
const MobileForm = () => {
  const [localFormData, setLocalFormData] = useState(formData);

  // Sync local form data when formData changes (for editing)
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Update parent formData before submitting
    setFormData(localFormData);
    
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/requirements/${editingId}` : "/api/requirements";
    
    const payload = {
      ...localFormData,
      budget: localFormData.budget ? parseInt(localFormData.budget) : null,
      deadline: localFormData.deadline || null
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        const refreshRes = await fetch("/api/requirements");
        const refreshData = await refreshRes.json();
        setRequirements(refreshData.requirements || []);
      }
    } catch (error) {
      console.error("Error saving requirement:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center gap-2 text-gray-600 p-2"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back</span>
        </button>
        <h2 className="text-base font-semibold text-gray-900">
          {editingId ? "Edit Requirement" : "New Requirement"}
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Form - Using div instead of form tag to prevent default submission */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto pb-24 px-4 pt-4">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="What do you need?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={localFormData.title}
              onChange={handleLocalChange}
              required
              autoFocus={true} // Auto-focus the first input
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe your project..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
              value={localFormData.description}
              onChange={handleLocalChange}
              required
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                placeholder="₹50000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={localFormData.budget}
                onChange={handleLocalChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={localFormData.deadline}
                onChange={handleLocalChange}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              name="category"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={localFormData.category}
              onChange={handleLocalChange}
            >
              <option value="">Select Category</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="writing">Writing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Urgency Level
            </label>
            <select
              name="urgency"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={localFormData.urgency}
              onChange={handleLocalChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="button" // Changed from type="submit" to type="button"
            onClick={handleLocalSubmit}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 font-semibold text-sm"
          >
            <FiCheckCircle className="w-4 h-4" />
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};