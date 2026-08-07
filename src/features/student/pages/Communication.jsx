 import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, Search } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Communication() {
  const { triggerToast, user } = useOutletContext();

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [chatMessages]);

  // جلب قائمة جهات الاتصال (المشرف الأكاديمي + القبول والتسجيل)
  useEffect(() => {
    setContactsLoading(true);
    fetch(`${API}/messages/student-contacts`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setContacts(res.contacts);
          if (res.contacts.length > 0) setActiveContact(res.contacts[0]);
        } else {
          triggerToast(res.message || 'تعذر تحميل جهات الاتصال', 'error');
        }
      })
      .catch(() => triggerToast('تعذر تحميل جهات الاتصال', 'error'))
      .finally(() => setContactsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // جلب المحادثة كاملة مع جهة الاتصال المختارة
  useEffect(() => {
    if (!activeContact) return;
    setChatLoading(true);
    fetch(`${API}/messages/conversation/${activeContact.role}/${activeContact.id}`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) setChatMessages(res.messages);
        setContacts(prev => prev.map(c =>
          c.id === activeContact.id && c.role === activeContact.role ? { ...c, unread_count: 0 } : c
        ));
      })
      .catch(() => triggerToast('تعذر تحميل المحادثة', 'error'))
      .finally(() => setChatLoading(false));
  }, [activeContact]);

  // اتصال Socket لاستقبال الرسائل اللحظية
  const activeContactRef = useRef(null);
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  useEffect(() => {
    if (!user) return;
    const socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.on('connect', () => {
      socket.emit('join', { userId: user.id, role: 'student' });
    });

    socket.on('new_message', (msg) => {
      const isActiveConversation =
        activeContactRef.current &&
        msg.sender_id === activeContactRef.current.id &&
        msg.sender_role === activeContactRef.current.role;

      if (isActiveConversation) {
        setChatMessages((prev) => [...prev, msg]);
      }

      setContacts((prev) => {
        const updated = prev.map(c => {
          if (c.id === msg.sender_id && c.role === msg.sender_role) {
            return {
              ...c,
              last_message_at: msg.created_at,
              unread_count: isActiveConversation ? 0 : (c.unread_count || 0) + 1,
            };
          }
          return c;
        });
        return updated.sort((a, b) => {
          if (a.last_message_at && b.last_message_at) return new Date(b.last_message_at) - new Date(a.last_message_at);
          if (a.last_message_at) return -1;
          if (b.last_message_at) return 1;
          return 0;
        });
      });

      triggerToast('رسالة جديدة وصلت!', 'success');
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    try {
      const res = await fetch(`${API}/messages/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          receiverId: activeContact.id,
          receiverRole: activeContact.role,
          message: newMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, data.data]);
        setNewMessage('');
        setContacts(prev => {
          const updated = prev.map(c =>
            c.id === activeContact.id && c.role === activeContact.role
              ? { ...c, last_message_at: data.data.created_at }
              : c
          );
          return updated.sort((a, b) => {
            if (a.last_message_at && b.last_message_at) return new Date(b.last_message_at) - new Date(a.last_message_at);
            if (a.last_message_at) return -1;
            if (b.last_message_at) return 1;
            return 0;
          });
        });
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء الإرسال', 'error');
      }
    } catch {
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.full_name?.includes(searchQuery)
  );

  const contactLabel = (contact) => {
    if (contact.role === 'registrar') return 'القبول والتسجيل';
    if (contact.role === 'supervisor') return 'المشرف الأكاديمي';
    return contact.subtitle || '';
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-6xl mx-auto font-cairo">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">التواصل</h1>
        <p className="text-gray-400 text-xs font-semibold">راسل مشرفك الأكاديمي أو القبول والتسجيل مباشرة لأي استفسار.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm items-stretch">

        {/* 1. Contacts List Sidebar */}
        <div className="border-l border-gray-100 flex flex-col bg-gray-50/20">
          <div className="p-4 border-b border-gray-50 shrink-0 space-y-3">
            <h3 className="text-xs font-extrabold text-gray-800">جهات الاتصال ({contacts.length})</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث..."
                className="w-full py-2.5 pl-3 pr-9 border border-gray-200 bg-white rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
              />
              <Search className="absolute inset-y-0 right-3.5 h-4 w-4 my-auto text-gray-400" />
            </div>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto min-h-[400px]">
            {contactsLoading && (
              <p className="text-xs text-gray-400 text-center py-6">جاري تحميل جهات الاتصال...</p>
            )}

            {!contactsLoading && filteredContacts.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">لا توجد جهات اتصال متاحة حالياً</p>
            )}

            {!contactsLoading && filteredContacts.map(contact => {
              const hasUnread = (contact.unread_count || 0) > 0;
              const isActive = activeContact?.id === contact.id && activeContact?.role === contact.role;
              return (
                <div
                  key={`${contact.role}-${contact.id}`}
                  onClick={() => setActiveContact(contact)}
                  className={`p-3.5 rounded-2xl cursor-pointer text-right transition flex justify-between items-center gap-3 ${
                    isActive
                      ? 'bg-purple-50/70 border border-purple-100/50'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="text-right space-y-0.5 overflow-hidden flex-1">
                    <h4 className={`text-xs truncate ${hasUnread ? 'font-extrabold text-gray-900' : 'font-extrabold text-gray-800'}`}>
                      {contact.full_name}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate">{contactLabel(contact)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasUnread && (
                      <span className="min-w-[18px] h-[18px] px-1 bg-brand-purple text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                        {contact.unread_count > 9 ? '9+' : contact.unread_count}
                      </span>
                    )}
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                      {contact.full_name?.charAt(0)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Chat Window */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white h-[600px]">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold">
              اختر جهة اتصال من القائمة لبدء المحادثة
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                <div />
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-800">{activeContact.full_name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">{contactLabel(activeContact)}</p>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 text-brand-purple rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">
                    {activeContact.full_name?.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Messages Log */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/10">
                {chatLoading && (
                  <p className="text-xs text-gray-400 text-center py-6">جاري تحميل المحادثة...</p>
                )}

                {!chatLoading && chatMessages.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">لا توجد رسائل بعد، ابدأ المحادثة!</p>
                )}

                {!chatLoading && chatMessages.map((msg) => {
                  const isOwn = msg.sender_role === 'student';
                  return (
                    <div key={msg.message_id} className={`flex items-start gap-2 max-w-sm lg:max-w-md ${isOwn ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isOwn ? 'bg-purple-100 text-brand-purple' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isOwn ? (user?.name?.charAt(0) || 'ط') : activeContact.full_name?.charAt(0)}
                      </div>
                      <div className="space-y-0.5 text-right w-full">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                          isOwn ? 'bg-brand-purple text-white rounded-tl-none shadow-sm' : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tr-none'
                        }`}>
                          <p>{msg.message_body}</p>
                          <span className={`text-[8px] mt-1 block text-left ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-50 flex items-center gap-2.5 shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالة..."
                  className="flex-1 py-2 px-4 border border-gray-200 bg-[#fbfbfd] rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
                <button type="submit" className="p-2.5 bg-brand-purple text-white rounded-xl hover:bg-brand-purpleDark transition shrink-0">
                  <Send className="h-4.5 w-4.5 transform rotate-180" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}