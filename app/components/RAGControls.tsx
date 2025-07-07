"use client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleRAGIndex, updateRAGSettings } from "../store/messageSlice";
import { ragService } from "../services/ragService";

export default function RAGControls() {
  const dispatch = useAppDispatch();
  const { ragSettings } = useAppSelector((state) => state.messages);

  const handleToggleRAG = () => {
    dispatch(updateRAGSettings({
      enabled: !ragSettings.enabled,
      selectedIndexes: ragSettings.selectedIndexes
    }));
  };

  const handleToggleIndex = (index: 'work' | 'school' | 'about_me') => {
    dispatch(toggleRAGIndex(index));
  };

  const indexStats = {
    work: ragService.getDocumentsByCategory('work').length,
    school: ragService.getDocumentsByCategory('school').length,
    about_me: ragService.getDocumentsByCategory('about_me').length,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">RAG Settings</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={ragSettings.enabled}
            onChange={handleToggleRAG}
            className="mr-2"
          />
          <span className="text-sm">Enable RAG</span>
        </label>
      </div>

      {ragSettings.enabled && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Active Indexes:</h4>
          
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('work')}
                  onChange={() => handleToggleIndex('work')}
                  className="mr-2"
                />
                <span className="text-sm">Work Experience</span>
              </div>
              <span className="text-xs text-gray-500">
                {indexStats.work} documents
              </span>
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('school')}
                  onChange={() => handleToggleIndex('school')}
                  className="mr-2"
                />
                <span className="text-sm">Education</span>
              </div>
              <span className="text-xs text-gray-500">
                {indexStats.school} documents
              </span>
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('about_me')}
                  onChange={() => handleToggleIndex('about_me')}
                  className="mr-2"
                />
                <span className="text-sm">Personal Info</span>
              </div>
              <span className="text-xs text-gray-500">
                {indexStats.about_me} documents
              </span>
            </label>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Selected: {ragSettings.selectedIndexes.length} of 3 indexes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}