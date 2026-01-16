'use client';

import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  FileText,
  Clock,
  TrendingUp,
  BookOpen,
  Dna,
  Microscope,
  Leaf,
  Brain,
  Activity,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuestions, useDeleteQuestion } from "@/hooks";
import { QuestionTopic, QuestionDifficulty, QuestionType, IQuestion } from "@/types";
import CreateQuestionForm from "@/components/forms/CreateQuestionForm";

function Questions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);

  // Build filter object for API
  const filters = {
    topic: selectedTopic !== "all" ? selectedTopic as QuestionTopic : undefined,
    difficulty: selectedDifficulty !== "all" ? selectedDifficulty as QuestionDifficulty : undefined,
    type: selectedType !== "all" ? selectedType as QuestionType : undefined,
    page: currentPage,
    limit: 6,
  };

  // Fetch questions from API
  const { data: questionsData, isLoading, isError } = useQuestions(filters);
  const deleteQuestionMutation = useDeleteQuestion();

  const questions = questionsData?.data || [];
  const totalQuestions = questionsData?.pagination?.total || 0;
  const totalPages = questionsData?.pagination?.totalPages || 1;

  // Calculate stats from real data
  const stats = [
    { label: "Total Questions", value: totalQuestions.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Topics Covered", value: "6", icon: BookOpen, color: "text-bio-500", bg: "bg-bio-100" },
    { label: "Avg. Difficulty", value: "Medium", icon: TrendingUp, color: "text-dna-500", bg: "bg-dna-100" },
  ];

  const topics = [
    { id: 'all', name: 'All Topics', icon: FileText, count: totalQuestions },
    { id: 'Genetic Engineering', name: 'Genetic Engineering', icon: Dna, count: 0 },
    { id: 'Recombinant DNA Technology', name: 'Recombinant DNA Technology', icon: Microscope, count: 0 },
    { id: 'Geologic Timeline', name: 'Geologic Timeline', icon: TrendingUp, count: 0 },
    { id: 'Mechanisms of Evolution', name: 'Mechanisms of Evolution', icon: Activity, count: 0 },
    { id: 'Descent with Modification', name: 'Descent with Modification', icon: Activity, count: 0 },
    { id: 'Development of Evolutionary Thought', name: 'Development of Evolutionary Thought', icon: Brain, count: 0 },
  ];

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestionMutation.mutateAsync(questionId);
      } catch (error) {
        console.error('Failed to delete question:', error);
        alert('Failed to delete question. Please try again.');
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedTopic("all");
    setSelectedDifficulty("all");
    setSelectedType("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'multiple choice':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'true/false':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'essay':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'matching':
        return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'fill in the blank':
        return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'short answer':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Question Bank</h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your biology assessment questions and build your quiz library.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-bio-600 hover:bg-bio-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Question
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Topic Filter */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Topic
              </h3>
            </div>
            <div className="p-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTopic === topic.id
                      ? 'bg-bio-100 text-bio-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <topic.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{topic.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    selectedTopic === topic.id
                      ? 'bg-bio-200 text-bio-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {topic.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Question Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="essay">Essay</option>
                <option value="matching">Matching</option>
                <option value="fill-in-the-blank">Fill in the Blank</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </div>

            <button 
              onClick={handleResetFilters}
              className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content - Questions List */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword or content..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Questions List */}
          {isLoading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-bio-600" />
              <p className="text-slate-600">Loading questions...</p>
            </div>
          ) : isError ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-red-600 mb-4">Failed to load questions. Please try again.</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">No questions found. Create your first question!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <div 
                  key={question._id} 
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-bio-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Question Text */}
                      <h4 className="font-semibold text-slate-900 mb-3 line-clamp-2">
                        {question.questionText}
                      </h4>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getTypeColor(question.questionType)}`}>
                          {question.questionType}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                          {question.topic}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                        {question.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {question.timeLimit < 60 
                              ? `${question.timeLimit}s` 
                              : `${Math.floor(question.timeLimit / 60)}m`}
                          </span>
                        )}
                        <span className="text-slate-400">• Created {new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => setEditingQuestion(question)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-bio-600 hover:bg-bio-50 rounded-lg transition-colors"
                        title="Duplicate Question"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question._id)}
                        disabled={deleteQuestionMutation.isPending}
                        className="p-2 text-slate-400 hover:text-dna-600 hover:bg-dna-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-medium">{((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, totalQuestions)}</span> of <span className="font-medium">{totalQuestions}</span> questions
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-bio-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Question Modal */}
      <CreateQuestionForm 
        open={showCreateModal || editingQuestion !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateModal(false);
            setEditingQuestion(null);
          }
        }}
        editMode={editingQuestion !== null}
        initialData={editingQuestion || undefined}
      />
    </div>
  );
}

export default Questions;