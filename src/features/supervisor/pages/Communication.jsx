 import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Send } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Communication() {
  const { triggerToast, token, socket } = useOutletContext();

  // ==========================================
  // قائمة جهات الاتصال (طلاب + القبول والتسجيل)
  // ==========================================
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [chatMessages]);

  // جلب قائمة جهات الاتصال (الطلاب المرتبطين بالمشرف + موظفي القبول والتسجيل)
  useEffect(() => {
    if (!token) return;
    setContactsLoading(true);
    fetch(`${API_BASE_URL}/messages/students`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setContacts(data.students);
          if (data.students.length > 0) {
            setActiveContact(data.students[0]);
          }
        }
      })
      .catch((error) => console.error('fetchContacts error:', error))
      .finally(() => setContactsLoading(false));
  }, [token]);

  // جلب المحادثة كاملة مع جهة الاتصال المختارة
  useEffect(() => {
    if (!token || !activeContact) return;
    setChatLoading(true);
    fetch(`${API_BASE_URL}/messages/conversation/${activeContact.role}/${activeContact.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setChatMessages(data.messages);
        setContacts(prev => prev.map(c =>
          c.id === activeContact.id && c.role === activeContact.role ? { ...c, unread_count: 0 } : c
        ));
      })
      .catch((error) => console.error('fetchConversation error:', error))
      .finally(() => setChatLoading(false));
  }, [activeContact, token]);

  // استقبال الرسائل اللحظية من الـ socket المشترك
  const activeContactRef = useRef(null);
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
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
    };

    socket.on('new_message', handleNewMessage);
    return () => socket.off('new_message', handleNewMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // إرسال رسالة جديدة
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: activeContact.id,
          receiverRole: activeContact.role,
          message: newMessage,
        }),
      });
      const data = await response.json();
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
        triggerToast(data.message || 'حدث خطأ أثناء إرسال الرسالة', 'error');
      }
    } catch (error) {
      console.error('handleSendMessage error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="space-y-0.5 shrink-0 text-right">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800 font-cairo">التواصل</h1>
        <p className="text-gray-400 text-xs font-semibold">مراسلة الطلاب الخاضعين لإشرافك، والتواصل مع القبول والتسجيل.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm items-stretch">

        {/* 1. Contacts List Sidebar */}
        <div className="border-l border-gray-100 flex flex-col bg-gray-50/20">
          <div className="p-4 border-b border-gray-50 shrink-0 space-y-3">
            <h3 className="text-xs font-extrabold text-gray-800">جهات الاتصال ({contacts.length})</h3>
            <div className="relative">
              <input
                type="text"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
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

            {!contactsLoading && contacts.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">لا توجد جهات اتصال متاحة حالياً</p>
            )}

            {!contactsLoading && contacts
              .filter(c => c.full_name.toLowerCase().includes(chatSearchQuery.toLowerCase()))
              .map(contact => {
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
                      <p className="text-[10px] text-gray-400 truncate">
                        {contact.role === 'registrar' ? 'القبول والتسجيل' : (contact.subtitle || 'طالب')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasUnread && (
                        <span className="min-w-[18px] h-[18px] px-1 bg-brand-purple text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                          {contact.unread_count > 9 ? '9+' : contact.unread_count}
                        </span>
                      )}
                      <div className="h-8 w-8 rounded-full bg-purple-100 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                        {contact.full_name.charAt(0)}
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
              اختاري جهة اتصال من القائمة لبدء المحادثة
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                <div />
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-800">{activeContact.full_name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {activeContact.role === 'registrar' ? 'القبول والتسجيل' : (activeContact.subtitle || 'طالب')}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 text-brand-purple rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">
                    {activeContact.full_name.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Messages Log */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/10">
                {chatLoading && (
                  <p className="text-xs text-gray-400 text-center py-6">جاري تحميل المحادثة...</p>
                )}

                {!chatLoading && chatMessages.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">لا توجد رسائل بعد، ابدئي المحادثة!</p>
                )}

                {!chatLoading && chatMessages.map((msg) => {
                  const isOwn = msg.sender_role === 'supervisor';
                  return (
                    <div key={msg.message_id} className={`flex items-start gap-2 max-w-sm lg:max-w-md ${isOwn ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isOwn ? 'bg-purple-100 text-brand-purple' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isOwn ? 'م' : activeContact.full_name.charAt(0)}
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