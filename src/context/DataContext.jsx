import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // 1. All Students List
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'أحمد محمود الخالدي',
      idNum: '439012345',
      email: 'a.alkhaldi@student.edu.sa',
      phone: '+966 50 123 4567',
      college: 'كلية علوم الحاسب والمعلومات',
      major: 'هندسة البرمجيات',
      company: 'شركة الاتصالات السعودية (STC)',
      status: 'qualified', // 'pending' | 'qualified' | 'unqualified'
      trainingStatus: 'مسجل - قيد التدريب', // 'قيد التدريب' | 'بانتظار المباشرة'
      supervisor: 'د. فهد الدوسري (الحالي)',
      passedHours: 95,
      requiredHours: 100,
      applyDate: '2023-10-15',
      letterStatus: 'ready', // 'draft' | 'ready' | 'issued'
      refNum: 'TR-2023-091',
      letterDate: '2023 / 08 / 15',
      subject: 'توجيه متدرب (برنامج التدريب التعاوني)',
      duration: '12 أسبوع',
      supervisorScore: 92,
      finalScore: 92,
      gradeStatus: 'approved', // 'pending' | 'approved'
      avatarBg: 'bg-indigo-900 text-white',
      avatarText: 'أ.م'
    },
    {
      id: 2,
      name: 'سارة بنت عبدالله',
      idNum: '441098765',
      email: 'sara.a@student.edu.sa',
      phone: '+966 55 987 6543',
      college: 'كلية علوم الحاسب والمعلومات',
      major: 'علوم الحاسب',
      company: 'شركة أرامكو السعودية',
      status: 'qualified',
      trainingStatus: 'مسجل - قيد التدريب',
      supervisor: 'د. فهد الدوسري',
      passedHours: 100,
      requiredHours: 110,
      applyDate: '2023-10-14',
      letterStatus: 'draft',
      refNum: 'TR-2023-092',
      letterDate: '2023 / 08 / 16',
      subject: 'توجيه متدرب (برنامج التدريب التعاوني)',
      duration: '10 أسبوع',
      supervisorScore: 88,
      finalScore: 88,
      gradeStatus: 'pending',
      avatarBg: 'bg-amber-500 text-white',
      avatarText: 'س.ع'
    },
    {
      id: 3,
      name: 'خالد فهد',
      idNum: '201920111',
      email: 'khalid.f@student.edu.sa',
      phone: '+966 53 456 7890',
      college: 'كلية علوم الحاسب والمعلومات',
      major: 'نظم المعلومات الإدارية',
      company: 'مستشفى الملك فيصل التخصصي',
      status: 'unqualified',
      trainingStatus: 'مسجل - قيد التدريب',
      supervisor: 'أ.د. محمد القحطاني',
      passedHours: 75,
      requiredHours: 100,
      applyDate: '2023-10-12',
      letterStatus: 'issued',
      refNum: 'TR-2023-093',
      letterDate: '2023 / 08 / 15',
      subject: 'توجيه متدرب (برنامج التدريب التعاوني)',
      duration: '12 أسبوع',
      supervisorScore: 75,
      finalScore: 65,
      gradeStatus: 'pending',
      alert: true,
      avatarBg: 'bg-gray-700 text-white',
      avatarText: 'خ.ف'
    }
  ]);

  // 2. Training Opportunities (posted by Companies/Institutions)
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'مطور برمجيات متكاملة (Full Stack Developer)',
      company: 'شركة الاتصالات السعودية (STC)',
      location: 'الرياض، المملكة العربية السعودية',
      type: 'تدريب تعاوني',
      duration: '7 أشهر',
      seats: 5,
      requirements: ['React', 'Node.js', 'SQL', 'Git'],
      status: 'active'
    },
    {
      id: 2,
      title: 'محلل بيانات أمن سيبراني (Data Analyst)',
      company: 'شركة أرامكو السعودية',
      location: 'الظهران، المملكة العربية السعودية',
      type: 'تدريب تعاوني',
      duration: '6 أشهر',
      seats: 3,
      requirements: ['Python', 'R', 'PowerBI', 'Cybersecurity basics'],
      status: 'active'
    }
  ]);

  // 3. System Announcements (created by Registrar, visible to students/supervisors)
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'هام بخصوص مواعيد تسليم التقارير النهائية',
      content: 'نرجو من جميع المتدربين رفع نماذج تقييم المشرف الأكاديمي والتقرير الختامي قبل نهاية الأسبوع القادم.',
      date: '2026-07-13',
      target: 'all'
    }
  ]);

  // 4. Live Chat Messages (Registrar communication)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'student', text: 'السلام عليكم، هل تم اعتماد خطاب التوجيه الخاص بي؟', time: '10:30 ص', contactId: 1 },
    { id: 2, sender: 'registrar', text: 'وعليكم السلام، نعم تم اعتماده وإرساله لجهة التدريب.', time: '10:32 ص', contactId: 1 },
    { id: 3, sender: 'student', text: 'شكراً جزيلاً لكم على سرعة التجاوب.', time: '10:33 ص', contactId: 1 }
  ]);

  // Actions for Registrar / Admin / Users
  const addStudent = (studentData) => {
    const newId = students.length + 1;
    const student = {
      id: newId,
      name: studentData.name,
      idNum: studentData.idNum,
      college: studentData.college || 'كلية علوم الحاسب',
      major: studentData.major || 'علوم حاسب',
      email: `${studentData.idNum}@student.edu.sa`,
      phone: '+966 50 000 0000',
      company: 'بانتظار جهة التدريب',
      status: 'pending',
      trainingStatus: 'بانتظار المباشرة',
      supervisor: '--',
      passedHours: 90,
      requiredHours: 100,
      applyDate: new Date().toISOString().split('T')[0],
      letterStatus: 'draft',
      refNum: `TR-2023-09${newId}`,
      letterDate: new Date().toISOString().split('T')[0],
      subject: 'توجيه متدرب',
      duration: '12 أسبوع',
      supervisorScore: 0,
      finalScore: 0,
      gradeStatus: 'pending',
      avatarBg: 'bg-brand-purple/10 text-brand-purple',
      avatarText: studentData.name[0]
    };
    setStudents(prev => [...prev, student]);
  };

  const updateStudentData = (id, updatedFields) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const updateApplicationStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const updateLetterStatus = (id, newLetterStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, letterStatus: newLetterStatus } : s));
  };

  const updateStudentGrade = (id, supervisorScore, finalScore, gradeStatus = 'pending') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, supervisorScore, finalScore, gradeStatus } : s));
  };

  const addOpportunity = (oppData) => {
    const newId = opportunities.length + 1;
    const opp = {
      id: newId,
      ...oppData,
      status: 'active'
    };
    setOpportunities(prev => [...prev, opp]);
  };

  const sendAnnouncement = (annData) => {
    const newId = announcements.length + 1;
    const ann = {
      id: newId,
      ...annData,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [...prev, ann]);
  };

  const addChatMessage = (contactId, sender, text) => {
    const newMsg = {
      id: messages.length + 1,
      contactId,
      sender,
      text,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <DataContext.Provider value={{
      students,
      opportunities,
      announcements,
      messages,
      addStudent,
      updateStudentData,
      updateApplicationStatus,
      updateLetterStatus,
      updateStudentGrade,
      addOpportunity,
      sendAnnouncement,
      addChatMessage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
