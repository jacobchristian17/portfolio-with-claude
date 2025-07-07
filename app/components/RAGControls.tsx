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
    <div className="glass-card p-6 rounded-2xl shadow-royal">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-royal-gradient">🧠 RAG Settings</h3>
        <label className="flex items-center glass-card px-3 py-2 rounded-full">
          <input
            type="checkbox"
            checked={ragSettings.enabled}
            onChange={handleToggleRAG}
            className="mr-2 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Enable RAG</span>
        </label>
      </div>

      {ragSettings.enabled && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Active Indexes:</h4>
          
          <div className="space-y-3">
            <label className="glass-card-royal p-3 rounded-xl flex items-center justify-between hover-lift cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('work')}
                  onChange={() => handleToggleIndex('work')}
                  className="mr-3 accent-blue-600"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">💼 Work Experience</span>
                  <div className="text-xs text-gray-600">{indexStats.work} documents</div>
                </div>
              </div>
            </label>

            <label className="glass-card-gold p-3 rounded-xl flex items-center justify-between hover-lift cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('school')}
                  onChange={() => handleToggleIndex('school')}
                  className="mr-3 accent-amber-600"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">🎓 Education</span>
                  <div className="text-xs text-gray-600">{indexStats.school} documents</div>
                </div>
              </div>
            </label>

            <label className="glass-card-royal p-3 rounded-xl flex items-center justify-between hover-lift cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.selectedIndexes.includes('about_me')}
                  onChange={() => handleToggleIndex('about_me')}
                  className="mr-3 accent-blue-600"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">🥷🏻 Personal Info</span>
                  <div className="text-xs text-gray-600">{indexStats.about_me} documents</div>
                </div>
              </div>
            </label>
          </div>

          <div className="section-divider"></div>
          <div className="text-center">
            <p className="text-sm font-medium text-royal-gradient">
              {ragSettings.selectedIndexes.length} of 3 indexes active
            </p>
          </div>
        </div>
      )}
    </div>
  );
}