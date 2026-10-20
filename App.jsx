import React, { useState, useEffect, useMemo } from 'react';
import SplashPreloader from './components/SplashPreloader';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import SystemStatusBanner from './components/SystemStatusBanner';
import NotificationsModal from './components/NotificationsModal';
import EmployeeDashboard from './components/EmployeeView/EmployeeDashboard';
import NewTicketModal from './components/EmployeeView/NewTicketModal';
import EngineerDashboard from './components/EngineerView/EngineerDashboard';
import ManagerDashboard from './components/ManagerView/ManagerDashboard';
import TicketDetailDrawer from './components/EngineerView/TicketDetailDrawer';
import { USERS, ENGINEERS_LIST, createInitialTickets } from './data/mockData';
import { ShieldCheck, Lock } from 'lucide-react';

const STORAGE_KEY_TICKETS = 'resolvex_tickets_data_v1';
const STORAGE_KEY_USER = 'resolvex_current_user_v1';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : USERS.employee;
    } catch {
      return USERS.employee;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
      return saved ? JSON.parse(saved) : createInitialTickets();
    } catch {
      return createInitialTickets();
    }
  });

  // Real-time ticking clock for SLA countdowns
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTicketForDrawer, setSelectedTicketForDrawer] = useState(null);

  // SLA Tick Engine (ticks every 1,000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save tickets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Could not persist tickets to localStorage', e);
    }
  }, [tickets]);

  // Save user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      }
    } catch (e) {
      console.warn('Could not persist user to localStorage', e);
    }
  }, [currentUser]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSwitchRole = (newRoleUser) => {
    setCurrentUser(newRoleUser);
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  const handleSubmitTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleClaimTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            assignee: {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar
            },
            status: t.status === 'Submitted' ? 'In Progress' : t.status,
            timeline: [
              ...t.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: currentUser.name,
                action: 'Claimed Ticket Ownership',
                details: `${currentUser.name} assigned ticket to self and began triage.`
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleReassignTicket = (ticketId, targetEngineer) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            assignee: {
              id: targetEngineer.id,
              name: targetEngineer.name,
              avatar: targetEngineer.avatar
            },
            timeline: [
              ...t.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: currentUser.name,
                action: `Reassigned Ticket to ${targetEngineer.name}`,
                details: `Transferred ownership to ${targetEngineer.specialty} specialist.`
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTicketStatus = (ticketId, newStatus, reason = null) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            timeline: [
              ...t.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: currentUser.name,
                action: `Status changed to ${newStatus}`,
                details: reason || `Updated by ${currentUser.roleLabel}`
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleAddEngineerNote = (ticketId, note) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            engineerNotes: [...(t.engineerNotes || []), note],
            timeline: [
              ...t.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: currentUser.name,
                action: 'Added Internal Technical Note',
                details: note.content.slice(0, 80) + '...'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleAddCustomerUpdate = (ticketId, update) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            customerUpdates: [...(t.customerUpdates || []), update],
            timeline: [
              ...t.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: currentUser.name,
                action: 'Sent Customer Update',
                details: update.content.slice(0, 80) + '...'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handleAutoRebalance = () => {
    // Distribute unassigned tickets to engineers with lowest current active load
    setTickets((prev) => {
      let updated = [...prev];
      const availableEngineers = [...ENGINEERS_LIST];

      updated = updated.map((ticket) => {
        if (!ticket.assignee && ticket.status !== 'Resolved') {
          // Find engineer with lowest load in current pass
          const loads = availableEngineers.map((e) => ({
            eng: e,
            load: updated.filter((t) => t.assignee?.id === e.id && t.status !== 'Resolved').length
          }));
          loads.sort((a, b) => a.load - b.load);
          const chosen = loads[0].eng;

          return {
            ...ticket,
            assignee: {
              id: chosen.id,
              name: chosen.name,
              avatar: chosen.avatar
            },
            status: 'Assigned',
            timeline: [
              ...ticket.timeline,
              {
                timestamp: new Date().toLocaleTimeString(),
                actor: 'Workload Balancer Engine',
                action: `Auto-Assigned to ${chosen.name}`,
                details: `Load-balancer routed ticket based on available capacity (${chosen.specialty}).`
              }
            ]
          };
        }
        return ticket;
      });

      return updated;
    });
  };

  // Derive alert counts for notification badge
  const slaWarningCount = useMemo(() => {
    return tickets.filter((t) => {
      if (t.status === 'Resolved') return false;
      const remaining = (t.createdAt + t.slaHours * 3600000) - currentTime;
      return remaining <= 30 * 60 * 1000;
    }).length;
  }, [tickets, currentTime]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Splash Preloader Stage */}
      {showSplash && (
        <SplashPreloader onComplete={() => setShowSplash(false)} />
      )}

      {/* 2. Enterprise Authentication Screen (when not logged in) */}
      {!isLoggedIn ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <>
          {/* System Infrastructure Health Banner */}
          <SystemStatusBanner />

          {/* Global Header & Navigation */}
          <Navbar
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onOpenNewTicket={() => setIsNewTicketOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onReplaySplash={handleReplaySplash}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            alertCount={slaWarningCount}
          />

          {/* Main Dashboard Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {currentUser.role === 'employee' && (
              <EmployeeDashboard
                currentUser={currentUser}
                tickets={tickets}
                currentTime={currentTime}
                onOpenNewTicket={() => setIsNewTicketOpen(true)}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onAddComment={(ticketId, note) => handleAddCustomerUpdate(ticketId, note)}
                searchQuery={searchQuery}
              />
            )}

            {currentUser.role === 'engineer' && (
              <EngineerDashboard
                currentUser={currentUser}
                tickets={tickets}
                currentTime={currentTime}
                onClaimTicket={handleClaimTicket}
                onReassignTicket={handleReassignTicket}
                onUpdateStatus={handleUpdateTicketStatus}
                onAddEngineerNote={handleAddEngineerNote}
                onAddCustomerUpdate={handleAddCustomerUpdate}
                searchQuery={searchQuery}
              />
            )}

            {currentUser.role === 'manager' && (
              <ManagerDashboard
                currentUser={currentUser}
                tickets={tickets}
                currentTime={currentTime}
                onAutoRebalance={handleAutoRebalance}
                onClaimTicket={handleClaimTicket}
                onReassignTicket={handleReassignTicket}
                onUpdateStatus={handleUpdateTicketStatus}
                onAddEngineerNote={handleAddEngineerNote}
                onAddCustomerUpdate={handleAddCustomerUpdate}
              />
            )}
          </main>

          {/* Zero-Confusion New Ticket Modal */}
          <NewTicketModal
            isOpen={isNewTicketOpen}
            onClose={() => setIsNewTicketOpen(false)}
            onSubmitTicket={handleSubmitTicket}
            currentUser={currentUser}
          />

          {/* SLA Alerts & Incident Feeds Drawer */}
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            tickets={tickets}
            currentTime={currentTime}
            onSelectTicket={(t) => {
              setSelectedTicketForDrawer(t);
            }}
          />

          {/* Ticket Detail Drawer for Global Selection */}
          {selectedTicketForDrawer && (
            <TicketDetailDrawer
              isOpen={Boolean(selectedTicketForDrawer)}
              ticket={tickets.find((t) => t.id === selectedTicketForDrawer.id) || selectedTicketForDrawer}
              currentUser={currentUser}
              currentTime={currentTime}
              onClose={() => setSelectedTicketForDrawer(null)}
              onClaimTicket={handleClaimTicket}
              onReassignTicket={handleReassignTicket}
              onUpdateStatus={handleUpdateTicketStatus}
              onAddEngineerNote={handleAddEngineerNote}
              onAddCustomerUpdate={handleAddCustomerUpdate}
            />
          )}

          {/* Enterprise Footer */}
          <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight">
                  Resolve<span className="text-indigo-600">X</span>
                </span>
                <span className="text-slate-300">•</span>
                <span>Enterprise IT Incident & Service Desk Portal</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  SOC-2 Type II Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  RBAC Active: {currentUser.roleLabel}
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
