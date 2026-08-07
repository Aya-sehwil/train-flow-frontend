 import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SupervisorSocketContext = createContext(null);

export function useSupervisorSocket() {
  return useContext(SupervisorSocketContext);
}

const API_BASE_URL = 'http://localhost:5000/api';

const notifTypeMap = {
  approval_request: 'request',
  new_report: 'report',
  contact_message: 'message',
  system_update: 'info',
};

const formatNotifTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} دقائق`;
    return `منذ ${diffHour} ساعة`;
  }
  const timeStr = date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  return `أمس • ${timeStr}`;
};

export const mapServerNotification = (n) => ({
  id: n.id,
  group: new Date(n.created_at).toDateString() === new Date().toDateString() ? 'today' : 'yesterday',
  type: notifTypeMap[n.type] || 'info',
  title: n.title,
  text: n.body,
  time: formatNotifTime(n.created_at),
  is_read: n.is_read,
});

// المزوّد (Provider): بيفتح اتصال socket واحد بس، ويظل شغال طول ما المستخدم
// داخل أي صفحة تحت لوحة تحكم المشرف (لأنه معاش في SupervisorLayout الأب).
export function SupervisorSocketProvider({ user, token, triggerToast, children }) {
  const socketRef = useRef(null);
  const [socketTick, setSocketTick] = useState(0); // لإجبار إعادة رندر لما يتغير socketRef

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);

  const fetchNotifications = async () => {
    if (!token) return;
    setNotifLoading(true);
    setNotifError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.map(mapServerNotification));
      } else {
        setNotifError(data.message || 'حدث خطأ أثناء جلب الإشعارات');
      }
    } catch (error) {
      console.error('fetchNotifications error:', error);
      setNotifError('تعذر الاتصال بالخادم');
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // اتصال الـ socket الوحيد لكل لوحة تحكم المشرف
  useEffect(() => {
    if (!user || !token) return;
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    setSocketTick((t) => t + 1);

    socket.on('connect', () => {
      socket.emit('join', { userId: user.id, role: user.role });
    });

    socket.on('new_notification', (n) => {
      setNotifications((prev) => [mapServerNotification(n), ...prev]);
      triggerToast(`إشعار جديد: ${n.title}`, 'success');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const value = {
    socket: socketRef.current,
    notifications,
    setNotifications,
    notifLoading,
    notifError,
    fetchNotifications,
    unreadNotifCount: notifications.filter((n) => !n.is_read).length,
  };

  return (
    <SupervisorSocketContext.Provider value={value}>
      {children}
    </SupervisorSocketContext.Provider>
  );
}