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
  Share2,
  Settings,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useRooms, useDeleteRoom, useUpdateRoomStatus } from "@/hooks/useRooms";
import { RoomStatus, IRoom } from "@/types/models";
import CreateRoomForm from "@/components/forms/CreateRoomForm";
import RoomResultsModal from "@/components/forms/RoomResultsModal";

function Rooms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'closed'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  // API Integration - Fetch all rooms and filter client-side
  const { data: roomsData, isLoading, isError } = useRooms(1, 100); // Fetch more rooms
  
  const allRooms = roomsData?.data || [];

  // Filter rooms by status
  const activeRooms = allRooms.filter(room => room.status === 'active' as RoomStatus);
  const scheduledRooms = allRooms.filter(room => room.status === 'draft' as RoomStatus); // Draft = Scheduled
  const closedRooms = allRooms.filter(room => room.status === 'closed' as RoomStatus);

  // Mutations
  const deleteRoomMutation = useDeleteRoom();
  const updateRoomStatusMutation = useUpdateRoomStatus();

  // Handlers
  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await deleteRoomMutation.mutateAsync(roomId);
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const handleStartRoom = async (roomId: string) => {
    try {
      await updateRoomStatusMutation.mutateAsync({ 
        roomId, 
        data: { status: 'active' as RoomStatus } 
      });
    } catch (error) {
      console.error('Failed to start room:', error);
    }
  };

  const handlePauseRoom = async (roomId: string) => {
    try {
      await updateRoomStatusMutation.mutateAsync({ 
        roomId, 
        data: { status: 'draft' as RoomStatus } 
      });
    } catch (error) {
      console.error('Failed to pause room:', error);
    }
  };

  const handleEndRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to end this room? Students will no longer be able to submit responses.')) {
      try {
        await updateRoomStatusMutation.mutateAsync({ 
          roomId, 
          data: { status: 'closed' as RoomStatus } 
        });
      } catch (error) {
        console.error('Failed to end room:', error);
      }
    }
  };

  const handleViewResults = (room: IRoom) => {
    setSelectedRoom(room);
    setShowResultsModal(true);
  };

  const stats = [
    { label: "Active Rooms", value: activeRooms.length.toString(), icon: Play, color: "text-bio-500", bg: "bg-bio-100" },
    { label: "Total Participants", value: allRooms.reduce((sum, room) => sum + (room.stats?.totalParticipants || 0), 0).toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Scheduled Today", value: scheduledRooms.length.toString(), icon: Calendar, color: "text-dna-500", bg: "bg-dna-100" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Active
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
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-bio-600 hover:bg-bio-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-bio-500 animate-spin" />
                <span className="ml-3 text-slate-600">Loading rooms...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-dna-600 font-medium">Failed to load rooms. Please try again.</p>
              </div>
            ) : activeRooms.length > 0 ? (
              activeRooms.map((room) => (
                <div 
                  key={room._id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-bio-300 hover:shadow-md transition-all group bg-linear-to-br from-white to-slate-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Room Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Room Code */}
                      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0 relative group/code">
                        {room.roomCode}
                        <button
                          onClick={() => copyRoomCode(room.roomCode)}
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
                        <p className="text-sm text-slate-600 mb-3">{room.description || 'No description'}</p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span className="font-medium text-slate-900">{room.stats.totalParticipants}</span>/{room.settings.maxStudents || 100} Students
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {Array.isArray(room.questions) ? room.questions.length : 0} Questions
                          </span>
                          <span className="flex items-center gap-1.5 text-blue-600">
                            <Clock className="w-4 h-4" />
                            {room.settings.timeLimit ? `${room.settings.timeLimit} min limit` : 'No time limit'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                      {room.status === 'active' ? (
                        <>
                          <button 
                            onClick={() => handleViewResults(room)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Results
                          </button>
                          <button 
                            onClick={() => handlePauseRoom(room._id)}
                            disabled={updateRoomStatusMutation.isPending}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {updateRoomStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                            Pause
                          </button>
                          <button 
                            onClick={() => handleEndRoom(room._id)}
                            disabled={updateRoomStatusMutation.isPending}
                            className="px-4 py-2 bg-dna-600 hover:bg-dna-700 disabled:bg-dna-300 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {updateRoomStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            End
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleStartRoom(room._id)}
                            disabled={updateRoomStatusMutation.isPending}
                            className="px-4 py-2 bg-bio-600 hover:bg-bio-700 disabled:bg-bio-300 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {updateRoomStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
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
                      <button 
                        onClick={() => handleDeleteRoom(room._id)}
                        disabled={deleteRoomMutation.isPending}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteRoomMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
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
                <button 
                  onClick={() => setShowCreateModal(true)} 
                  className="px-4 py-2 bg-bio-600 hover:bg-bio-700 text-white text-sm font-medium rounded-lg inline-flex items-center gap-2"
                >
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-bio-500 animate-spin" />
                <span className="ml-3 text-slate-600">Loading scheduled rooms...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-dna-600 font-medium">Failed to load scheduled rooms. Please try again.</p>
              </div>
            ) : scheduledRooms.length > 0 ? (
              scheduledRooms.map((room) => (
                <div 
                  key={room._id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0">
                        {room.roomCode}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{room.title}</h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description || 'No description'}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Created: {new Date(room.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Max {room.settings.maxStudents || 100} Students
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {Array.isArray(room.questions) ? room.questions.length : 0} Questions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleStartRoom(room._id)}
                        disabled={updateRoomStatusMutation.isPending}
                        className="px-4 py-2 bg-bio-600 hover:bg-bio-700 disabled:bg-bio-300 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                      >
                        {updateRoomStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Start Now
                      </button>
                      {/* <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configure
                      </button> */}
                      <button 
                        onClick={() => handleDeleteRoom(room._id)}
                        disabled={deleteRoomMutation.isPending}
                        className="p-2 text-slate-400 hover:text-dna-600 hover:bg-dna-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteRoomMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-bio-500 animate-spin" />
                <span className="ml-3 text-slate-600">Loading closed rooms...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-dna-600 font-medium">Failed to load closed rooms. Please try again.</p>
              </div>
            ) : closedRooms.length > 0 ? (
              closedRooms.map((room) => (
                <div 
                  key={room._id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="bg-slate-100 text-slate-400 px-4 py-3 rounded-xl font-mono font-bold text-xl tracking-wider shrink-0">
                        {room.roomCode}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{room.title}</h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description || 'No description'}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {room.stats.totalParticipants} Participants
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {Array.isArray(room.questions) ? room.questions.length : 0} Questions
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Closed {new Date(room.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleViewResults(room)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        View Results
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button 
                        onClick={() => handleDeleteRoom(room._id)}
                        disabled={deleteRoomMutation.isPending}
                        className="p-2 text-slate-400 hover:text-dna-600 hover:bg-dna-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteRoomMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

      {/* Create Room Modal */}
      <CreateRoomForm 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Room Results Modal */}
      <RoomResultsModal
        open={showResultsModal}
        onOpenChange={setShowResultsModal}
        room={selectedRoom}
      />
    </div>
  );
}

export default Rooms;