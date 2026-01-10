'use client';

import { 
  Plus, 
  Play, 
  Users, 
  Clock, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Pause,
  BarChart3,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Share2,
  Settings
} from "lucide-react";
import { useState } from "react";

function Rooms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'closed'>('active');
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock Data - Replace with actual API calls using useRooms hook
  const stats = [
    { label: "Active Rooms", value: "3", icon: Play, color: "text-bio-500", bg: "bg-bio-100" },
    { label: "Total Participants", value: "87", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Scheduled Today", value: "5", icon: Calendar, color: "text-dna-500", bg: "bg-dna-100" },
  ];

  const activeRooms = [
    {
      id: 1,
      code: "X7Y2Z9",
      title: "Genetics: Mitosis vs Meiosis",
      description: "Live assessment covering cell division processes",
      status: "live",
      participants: 24,
      maxStudents: 30,
      questions: 15,
      expiresAt: "2025-01-08T18:30:00",
      timeRemaining: "02:15:00",
      created: "2 hours ago",
      allowLateJoin: true,
      showResults: true
    },
    {
      id: 2,
      code: "A1B2C3",
      title: "Evolutionary Adaptation Quiz",
      description: "Darwin's theory and natural selection concepts",
      status: "waiting",
      participants: 18,
      maxStudents: 25,
      questions: 20,
      expiresAt: "2025-01-08T20:00:00",
      timeRemaining: "06:30:00",
      created: "30 minutes ago",
      allowLateJoin: true,
      showResults: false
    },
    {
      id: 3,
      code: "M9N8P7",
      title: "Cell Structure Fundamentals",
      description: "Understanding organelles and their functions",
      status: "live",
      participants: 45,
      maxStudents: 50,
      questions: 12,
      expiresAt: "2025-01-08T17:45:00",
      timeRemaining: "01:30:00",
      created: "4 hours ago",
      allowLateJoin: false,
      showResults: true
    }
  ];

  const scheduledRooms = [
    {
      id: 4,
      code: "D4E5F6",
      title: "Ecology and Ecosystems Test",
      description: "Comprehensive ecology assessment",
      status: "draft",
      participants: 0,
      maxStudents: 35,
      questions: 18,
      scheduledFor: "2025-01-09T10:00:00",
      created: "1 day ago"
    },
    {
      id: 5,
      code: "G7H8I9",
      title: "Human Biology: Immune System",
      description: "Deep dive into immune responses",
      status: "draft",
      participants: 0,
      maxStudents: 40,
      questions: 22,
      scheduledFor: "2025-01-09T14:00:00",
      created: "1 day ago"
    }
  ];

  const closedRooms = [
    {
      id: 6,
      code: "J1K2L3",
      title: "Photosynthesis Process Quiz",
      description: "Light and dark reactions assessment",
      status: "closed",
      participants: 32,
      maxStudents: 35,
      questions: 15,
      completedAt: "2025-01-07T16:00:00",
      avgScore: 84.5,
      created: "2 days ago"
    },
    {
      id: 7,
      code: "W4X5Y6",
      title: "DNA Replication Mechanisms",
      description: "Molecular biology fundamentals",
      status: "closed",
      participants: 28,
      maxStudents: 30,
      questions: 20,
      completedAt: "2025-01-06T11:30:00",
      avgScore: 78.2,
      created: "3 days ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </span>
        );
      case 'waiting':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-wide">
            Waiting
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wide">
            Draft
          </span>
        );
      case 'closed':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wide">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimeRemaining = (timeString: string) => {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">My Rooms</h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Create and manage live quiz sessions for your students.</p>
          </div>
          <button className="w-full md:w-auto bg-bio-600 hover:bg-bio-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Create New Room
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

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-slate-200">
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'active'
                  ? 'bg-bio-100 text-bio-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Active Rooms ({activeRooms.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'scheduled'
                  ? 'bg-bio-100 text-bio-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Scheduled ({scheduledRooms.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'closed'
                  ? 'bg-bio-100 text-bio-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Closed ({closedRooms.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Active Rooms Content */}
        {activeTab === 'active' && (
          <div className="p-4 space-y-4">
            {activeRooms.length > 0 ? (
              activeRooms.map((room) => (
                <div 
                  key={room.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-bio-300 hover:shadow-md transition-all group bg-gradient-to-br from-white to-slate-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Room Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Room Code */}
                      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0 relative group/code">
                        {room.code}
                        <button
                          onClick={() => copyRoomCode(room.code)}
                          className="absolute inset-0 bg-slate-800 opacity-0 group-hover/code:opacity-100 transition-opacity rounded-xl flex items-center justify-center"
                          title="Copy room code"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{room.title}</h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description}</p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span className="font-medium text-slate-900">{room.participants}</span>/{room.maxStudents} Students
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {room.questions} Questions
                          </span>
                          <span className="flex items-center gap-1.5 text-orange-600">
                            <Clock className="w-4 h-4" />
                            Expires in {formatTimeRemaining(room.timeRemaining)}
                          </span>
                          {room.allowLateJoin && (
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                              Late join allowed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                      {room.status === 'live' ? (
                        <>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            Monitor
                          </button>
                          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <Pause className="w-4 h-4" />
                            Pause
                          </button>
                          <button className="px-4 py-2 bg-dna-600 hover:bg-dna-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <XCircle className="w-4 h-4" />
                            End
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="px-4 py-2 bg-bio-600 hover:bg-bio-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <Play className="w-4 h-4" />
                            Start Room
                          </button>
                          <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                          <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        </>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Rooms</h3>
                <p className="text-slate-500 mb-4">Create a new room to start a live quiz session.</p>
                <button className="px-4 py-2 bg-bio-600 hover:bg-bio-700 text-white text-sm font-medium rounded-lg inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Room
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scheduled Rooms Content */}
        {activeTab === 'scheduled' && (
          <div className="p-4 space-y-4">
            {scheduledRooms.length > 0 ? (
              scheduledRooms.map((room) => (
                <div 
                  key={room.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0">
                        {room.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{room.title}</h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Scheduled: {new Date(room.scheduledFor).toLocaleDateString()} at {new Date(room.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Max {room.maxStudents} Students
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {room.questions} Questions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button className="px-4 py-2 bg-bio-600 hover:bg-bio-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Now
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configure
                      </button>
                      <button className="p-2 text-slate-400 hover:text-dna-600 hover:bg-dna-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Scheduled Rooms</h3>
                <p className="text-slate-500">Schedule rooms in advance for your upcoming classes.</p>
              </div>
            )}
          </div>
        )}

        {/* Closed Rooms Content */}
        {activeTab === 'closed' && (
          <div className="p-4 space-y-4">
            {closedRooms.length > 0 ? (
              closedRooms.map((room) => (
                <div 
                  key={room.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-slate-100 text-slate-400 px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0">
                        {room.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{room.title}</h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {room.participants} Participants
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            Avg Score: <span className="font-semibold text-slate-900">{room.avgScore}%</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Completed {new Date(room.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        View Results
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button className="p-2 text-slate-400 hover:text-dna-600 hover:bg-dna-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Closed Rooms</h3>
                <p className="text-slate-500">Completed room sessions will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;