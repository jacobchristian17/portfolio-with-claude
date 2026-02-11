"use client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleRAGIndex } from "../store/messageSlice";
import { ragService } from "../services/ragService";

export default function RAGControls() {
  const dispatch = useAppDispatch();
  const { ragSettings } = useAppSelector((state) => state.messages);

  // RAG is always enabled, no toggle needed

  const handleToggleIndex = (index: 'work' | 'school' | 'about_me') => {
    dispatch(toggleRAGIndex(index));
  };

  const indexStats = {
    work: ragService.getDocumentsByCategory('work').length,
    school: ragService.getDocumentsByCategory('school').length,
    about_me: ragService.getDocumentsByCategory('about_me').length,
  };

  const includesWork = ragSettings.selectedIndexes.includes('work');
  const includesSchool = ragSettings.selectedIndexes.includes('school');
  const includesAboutMe = ragSettings.selectedIndexes.includes('about_me');

  return (
    <div id="rag-controls" className="glass-card p-6 rounded-2xl shadow-royal relative z-3 select-none">
      <div id="rag-controls-header" className="text-center mb-6 select-none">
        <h3 id="rag-controls-title" className="text-xl font-bold text-royal-gradient mb-2">🧠 Knowledge Areas</h3>
        <p id="rag-controls-subtitle" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Select topics to ask about</p>
      </div>

      <div id="rag-controls-options" className="space-y-4">
        <div id="rag-checkboxes" className="space-y-3">
          <label id="rag-option-work" className={`${includesWork ? "knowledge-doc-box" : "knowledge-doc-box-h"} p-4 rounded-xl flex items-center cursor-pointer transition-all duration-300`}>
            <input
              id="checkbox-rag-work"
              type="checkbox"
              checked={includesWork}
              onChange={() => handleToggleIndex('work')}
              className={`mr-4 knowledge-doc-checkbox w-4 h-4`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>💼 Career</span>
                <span id="rag-work-count" className="text-xs px-2 py-1 rounded-full" style={{ color: "var(--text-primary)" }}>
                  {indexStats.work} docs
                </span>
              </div>
            </div>
          </label>

          <label id="rag-option-school" className={`${includesSchool ? "knowledge-doc-box" : "knowledge-doc-box-h"} p-4 rounded-xl flex items-center cursor-pointer transition-all duration-300`}>
            <input
              id="checkbox-rag-school"
              type="checkbox"
              checked={includesSchool}
              onChange={() => handleToggleIndex('school')}
              className={`mr-4 knowledge-doc-checkbox w-4 h-4`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>🎓 Education</span>
                <span id="rag-school-count" className="text-xs px-2 py-1 rounded-full" style={{ color: "var(--text-primary)" }}>
                  {indexStats.school} docs
                </span>
              </div>
            </div>
          </label>

          <label id="rag-option-about" className={`${includesAboutMe ? "knowledge-doc-box" : "knowledge-doc-box-h"} p-4 rounded-xl flex items-center cursor-pointer transition-all duration-300`}>
            <input
              id="checkbox-rag-about"
              type="checkbox"
              checked={includesAboutMe}
              onChange={() => handleToggleIndex('about_me')}
              className={`mr-4 knowledge-doc-checkbox w-4 h-4`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>🥷🏻 Personal Info</span>
                <span id="rag-about-count" className="text-xs px-2 py-1 rounded-full" style={{ color: "var(--text-primary)" }}>
                  {indexStats.about_me} docs
                </span>
              </div>
            </div>
          </label>
        </div>

        <div id="rag-status" className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div id="rag-active-count" className="inline-flex items-center glass-card px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-knowledge-doc-dot rounded-full mr-2"></div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {ragSettings.selectedIndexes.length} of 3 areas active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}