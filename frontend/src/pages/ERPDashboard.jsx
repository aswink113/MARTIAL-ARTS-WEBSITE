import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  DollarSign,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Shield,
  Award,
  Clock,
  LogOut,
  Plus,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Key,
  Trash2,
  Edit,
  Building,
  UserCheck,
  Briefcase,
  X,
  Eye,
  EyeOff,
  Bell,
  ChevronLeft,
  RefreshCw,
  Check,
  BookOpen,
  Layers,
  Settings,
  Mail,
  FileText,
  Activity,
  Flame,
  UserPlus,
  Sun,
  Moon,
  ChevronDown,
  UserX,
  CalendarDays,
  Download,
  CreditCard,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardStats,
  getERPEnquiries,
  updateERPEnquiry,
  getERPStudents,
  getNextStudentId,
  createERPStudent,
  updateERPStudent,
  deleteERPStudent,
  manageStudentCredentials,
  getDepartments,
  createDepartment,
  deleteDepartment,
  getStaffMembers,
  getNextStaffId,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  manageStaffCredentials,
  saveAttendance,
  saveStudentAttendance,
  getStudentAttendance,
  getStaffAttendance,
  saveStaffAttendance,
  getCourses,
  getSchedules,
  getFeePayments,
  createFeePayment,
  getBeltPromotions,
  createBeltPromotion
} from '../services/api';

const ERPDashboard = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation & View state
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'departments' | 'staff' | 'students' | 'enquiries' | 'attendance' | 'courses'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('erp_theme') || 'light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('erp_theme', nextTheme);
  };

  // Data state
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [students, setStudents] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Filtering & search
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');

  // Attendance Module state (Student & Staff separation)
  const [attendanceMainTab, setAttendanceMainTab] = useState('students'); // 'students' | 'staff'
  const [studentAttendanceDate, setStudentAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentAttDisciplineFilter, setStudentAttDisciplineFilter] = useState('');
  const [studentAttBatchFilter, setStudentAttBatchFilter] = useState('');
  const [studentAttSearch, setStudentAttSearch] = useState('');
  const [studentUnsavedChanges, setStudentUnsavedChanges] = useState(0);

  const [staffAttendanceDate, setStaffAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffAttSearch, setStaffAttSearch] = useState('');
  const [staffAttCheckIn, setStaffAttCheckIn] = useState({});
  const [staffAttCheckOut, setStaffAttCheckOut] = useState({});
  const [staffUnsavedChanges, setStaffUnsavedChanges] = useState(0);

  // Natdemy Attendance & Analytics Ledger state
  const [attendanceViewMode, setAttendanceViewMode] = useState('daily'); // 'daily' | 'daywise' | 'monthly'
  const [attendanceRangeDays, setAttendanceRangeDays] = useState('7'); // '7' | '14' | '30' | 'all'
  const [attendanceSubTab, setAttendanceSubTab] = useState('staff'); // 'staff' | 'students' | 'personal'
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [attendanceDeptFilter, setAttendanceDeptFilter] = useState('');
  const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
  const [attendancePageSize, setAttendancePageSize] = useState(7);
  const [showManualMarkModal, setShowManualMarkModal] = useState(false);
  const [markModalTarget, setMarkModalTarget] = useState('staff'); // 'staff' | 'student'
  const [modalMarkDate, setModalMarkDate] = useState(new Date().toISOString().split('T')[0]);

  // Staff Attendance (Non-Admin only)
  const [staffAttendanceMarks, setStaffAttendanceMarks] = useState({});
  const [staffAttendanceRemarks, setStaffAttendanceRemarks] = useState({});
  const [staffAttendanceRecords, setStaffAttendanceRecords] = useState([]);
  const [staffFilterTab, setStaffFilterTab] = useState('all'); // 'all' | 'present' | 'absent' | 'other'

  // Student Attendance
  const [studentAttendanceMarks, setStudentAttendanceMarks] = useState({});
  const [studentAttendanceRemarks, setStudentAttendanceRemarks] = useState({});
  const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([]);

  // Fees & Payments Module state
  const [feePayments, setFeePayments] = useState([]);
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');
  const [feeSearch, setFeeSearch] = useState('');
  const [feeMonthFilter, setFeeMonthFilter] = useState('November 2026');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    student: '',
    amount: '99.00',
    payment_method: 'Card',
    status: 'Paid',
    billing_month: 'November 2026',
    notes: 'Monthly Academy Tuition'
  });
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Belt & Rank Management Module state
  const [beltPromotions, setBeltPromotions] = useState([]);
  const [beltSearch, setBeltSearch] = useState('');
  const [beltFilter, setBeltFilter] = useState('');
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promotionData, setPromotionData] = useState({
    student: '',
    to_belt: 'Yellow Belt',
    examiner: '',
    certificate_number: '',
    remarks: 'Passed technical syllabus examination'
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Modals state
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '' });

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    staff_id: '',
    email: '',
    phone: '',
    department: '',
    designation: 'Instructor',
    role_type: 'instructor',
    salary: '4500.00',
    password: 'warrior123',
    notes: '',
  });

  // Edit Staff Modal State
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState({
    id: null,
    full_name: '',
    staff_id: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    role_type: 'instructor',
    salary: '4500.00',
    is_active: true,
    notes: '',
  });

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    student_id: '',
    email: '',
    phone: '',
    department: '',
    course: '',
    batch: '',
    guardian_name: '',
    current_belt: 'White Belt',
    fee_status: 'Paid',
    password: 'student123',
    notes: '',
  });

  // Edit Student Modal State
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState({
    id: null,
    full_name: '',
    student_id: '',
    email: '',
    phone: '',
    department: '',
    course: '',
    batch: '',
    guardian_name: '',
    current_belt: 'White Belt',
    fee_status: 'Paid',
    is_active: true,
    notes: '',
  });

  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credentialTarget, setCredentialTarget] = useState({
    type: 'staff',
    id: null,
    name: '',
    identifier: '',
    email: '',
    username: '',
    password: '',
    role_type: 'instructor',
  });
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/portal/login');
      return;
    }
    if (role === 'student') {
      setAttendanceSubTab('students');
    } else if (role === 'instructor' || role === 'sensei') {
      setAttendanceSubTab('personal');
    } else {
      setAttendanceSubTab('staff');
    }
    loadDashboardData();
  }, [user, role]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const statsData = await getDashboardStats();
      setStats(statsData);

      const [
        enqData, studData, staffData, deptData, courseData, schedData, 
        staffAttData, studAttData, feeData, beltData
      ] = await Promise.all([
        getERPEnquiries(enquiryStatusFilter, enquirySearch).catch(() => []),
        getERPStudents().catch(() => []),
        getStaffMembers().catch(() => []),
        getDepartments().catch(() => []),
        getCourses().catch(() => []),
        getSchedules().catch(() => []),
        getStaffAttendance({ days: '14' }).catch(() => []),
        getStudentAttendance({ days: '14' }).catch(() => []),
        getFeePayments().catch(() => []),
        getBeltPromotions().catch(() => [])
      ]);

      setEnquiries(enqData);
      setStudents(studData);
      setStaffMembers(staffData);
      setDepartments(deptData);
      setCourses(courseData);
      setSchedules(schedData);
      setStaffAttendanceRecords(staffAttData);
      setStudentAttendanceRecords(studAttData);
      setFeePayments(feeData);
      setBeltPromotions(beltData);

      // Pre-fill staff attendance marks for today (Non-Admin only)
      const initialStaffMarks = {};
      const initialStaffRemarks = {};
      const staffAttMap = {};
      if (staffAttData && staffAttData.length > 0) {
        staffAttData.filter(r => r.date === todayDate).forEach(r => { staffAttMap[r.staff] = r; });
      }
      staffData
        .filter(s => s.role_type !== 'admin' && s.staff_id !== 'STF-001' && s.user?.username !== 'admin')
        .forEach(s => {
          if (staffAttMap[s.id]) {
            initialStaffMarks[s.id] = staffAttMap[s.id].status;
            initialStaffRemarks[s.id] = staffAttMap[s.id].remarks || '';
          } else {
            initialStaffMarks[s.id] = 'Present';
            initialStaffRemarks[s.id] = '';
          }
        });
      setStaffAttendanceMarks(initialStaffMarks);
      setStaffAttendanceRemarks(initialStaffRemarks);

      // Pre-fill student attendance marks for today
      const initialStudentMarks = {};
      const initialStudentRemarks = {};
      const studAttMap = {};
      if (studAttData && studAttData.length > 0) {
        studAttData.filter(r => r.date === todayDate).forEach(r => { studAttMap[r.student] = r; });
      }
      if (studData) {
        studData.forEach(s => {
          if (studAttMap[s.id]) {
            initialStudentMarks[s.id] = studAttMap[s.id].status;
            initialStudentRemarks[s.id] = studAttMap[s.id].remarks || '';
          } else {
            initialStudentMarks[s.id] = 'Present';
            initialStudentRemarks[s.id] = '';
          }
        });
        setStudentAttendanceMarks(initialStudentMarks);
        setStudentAttendanceRemarks(initialStudentRemarks);
      }

      if (schedData && schedData.length > 0) {
        setSelectedBatchForAtt(schedData[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching ERP dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4500);
  };

  // ---------------------------------------------------------------------------
  // NATDEMY ATTENDANCE LEDGER HELPERS (ALL ROLES)
  // ---------------------------------------------------------------------------
  const fetchAttendanceLedger = async (days = attendanceRangeDays) => {
    try {
      const isStudent = role === 'student';
      const [staffRecords, studentRecords] = await Promise.all([
        getStaffAttendance({ days: days === 'all' ? 'all' : days }).catch(() => []),
        getStudentAttendance({ days: days === 'all' ? 'all' : days, personal: isStudent ? 'true' : undefined }).catch(() => [])
      ]);
      if (staffRecords && Array.isArray(staffRecords)) {
        setStaffAttendanceRecords(staffRecords);
      }
      if (studentRecords && Array.isArray(studentRecords)) {
        setStudentAttendanceRecords(studentRecords);
      }
    } catch (err) {
      console.error('Error fetching attendance ledger:', err);
    }
  };

  const handleRangeDaysSelect = async (days) => {
    setAttendanceRangeDays(days);
    setAttendanceCurrentPage(1);
    await fetchAttendanceLedger(days);
  };

  const handleLoadOlderDays = async () => {
    const current = parseInt(attendanceRangeDays, 10) || 7;
    const nextDays = current + 7;
    setAttendanceRangeDays(String(nextDays));
    await fetchAttendanceLedger(String(nextDays));
    triggerToast(`Loaded older records (+7 days, showing past ${nextDays} days)`);
  };

  const formatDateDivider = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(d);
        target.setHours(0, 0, 0, 0);
        
        const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));
        const day = d.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[d.getMonth()];
        const year = d.getFullYear();
        const formatted = `${day} ${month} ${year}`;

        if (diffDays === 0) return `${formatted} • TODAY`;
        if (diffDays === 1) return `${formatted} • YESTERDAY`;
        
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = weekdayNames[d.getDay()];
        return `${formatted} • ${dayName}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const computeAttendanceKPIs = (records) => {
    const total = records.length;
    let lateCount = 0;
    let absentCount = 0;
    let presentCount = 0;

    records.forEach(r => {
      const stat = (r.status || '').toLowerCase();
      const flg = (r.flag || '').toLowerCase();
      if (stat === 'late' || flg.includes('late')) {
        lateCount++;
      } else if (stat === 'absent') {
        absentCount++;
      } else if (stat === 'present') {
        presentCount++;
      }
    });

    const presentRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

    return {
      cycleRange: '21 Nov 2026 - 20 Dec 2026',
      cycleSub: '21st - 20th',
      lateCount,
      absentCount,
      presentCount,
      presentRate
    };
  };

  // ---------------------------------------------------------------------------
  // ATTENDANCE HANDLERS (STAFF & STUDENTS - ADMIN EXCLUDED)
  // ---------------------------------------------------------------------------
  const handleDateChangeStaffAttendance = async (selectedDate) => {
    setAttendanceDate(selectedDate);
    try {
      const records = await getStaffAttendance(selectedDate);
      setStaffAttendanceRecords(records);
      const marks = { ...staffAttendanceMarks };
      const remarks = { ...staffAttendanceRemarks };
      records.forEach(r => {
        marks[r.staff] = r.status;
        if (r.remarks) remarks[r.staff] = r.remarks;
      });
      setStaffAttendanceMarks(marks);
      setStaffAttendanceRemarks(remarks);
    } catch (err) {
      console.error('Failed to load staff attendance for date:', err);
    }
  };

  const handleDateChangeStudentAttendance = async (selectedDate) => {
    setAttendanceDate(selectedDate);
    try {
      const records = await getStudentAttendance(selectedDate);
      setStudentAttendanceRecords(records);
      const marks = { ...studentAttendanceMarks };
      const remarks = { ...studentAttendanceRemarks };
      records.forEach(r => {
        marks[r.student] = r.status;
        if (r.remarks) remarks[r.student] = r.remarks;
      });
      setStudentAttendanceMarks(marks);
      setStudentAttendanceRemarks(remarks);
    } catch (err) {
      console.error('Failed to load student attendance for date:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // ATTENDANCE & MODULE HANDLERS
  // ---------------------------------------------------------------------------
  const exportToCSV = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filename} successfully!`);
  };

  const handleStudentStatusChange = (studentId, status) => {
    setStudentAttendanceMarks(prev => ({
      ...prev,
      [studentId]: status
    }));
    setStudentUnsavedChanges(prev => prev + 1);
  };

  const markAllStudentsPresent = () => {
    const updated = { ...studentAttendanceMarks };
    students.forEach(s => {
      updated[s.id] = 'Present';
    });
    setStudentAttendanceMarks(updated);
    setStudentUnsavedChanges(prev => prev + 1);
    triggerToast('Marked all students as Present.');
  };

  const bulkMarkStudentsAbsent = () => {
    const updated = { ...studentAttendanceMarks };
    students.forEach(s => {
      updated[s.id] = 'Absent';
    });
    setStudentAttendanceMarks(updated);
    setStudentUnsavedChanges(prev => prev + 1);
    triggerToast('Bulk marked all students as Absent.');
  };

  const submitStudentAttendanceAction = async () => {
    let targetStudents = students;
    if (studentAttDisciplineFilter) {
      targetStudents = targetStudents.filter(s => String(s.department) === String(studentAttDisciplineFilter) || String(s.course) === String(studentAttDisciplineFilter));
    }
    if (studentAttBatchFilter) {
      targetStudents = targetStudents.filter(s => String(s.batch) === String(studentAttBatchFilter));
    }

    const records = targetStudents.map(st => ({
      student: st.id,
      date: studentAttendanceDate,
      schedule: studentAttBatchFilter ? parseInt(studentAttBatchFilter, 10) : null,
      status: studentAttendanceMarks[st.id] || 'Present',
      remarks: studentAttendanceRemarks[st.id] || 'Classroom roll-call verified'
    }));

    try {
      await saveStudentAttendance(records);
      setStudentUnsavedChanges(0);
      const [freshStudAtt, freshStats] = await Promise.all([
        getStudentAttendance({ days: '14' }),
        getDashboardStats()
      ]);
      setStudentAttendanceRecords(freshStudAtt);
      setStats(freshStats);
      triggerToast(`Student attendance for ${studentAttendanceDate} saved successfully!`);
    } catch (err) {
      console.error('Student attendance submit error:', err);
      alert('Error saving student attendance.');
    }
  };

  const exportStudentAttendanceCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Discipline', 'Current Belt', 'Date', 'Status', 'Remarks'];
    const rows = students.map(st => [
      st.student_id,
      st.full_name,
      st.course_name || 'General Martial Arts',
      st.current_belt,
      studentAttendanceDate,
      studentAttendanceMarks[st.id] || 'Present',
      studentAttendanceRemarks[st.id] || ''
    ]);
    exportToCSV(`student-attendance-${studentAttendanceDate}.csv`, headers, rows);
  };

  const markAllStaffPresent = () => {
    const updated = { ...staffAttendanceMarks };
    nonAdminStaff.forEach(s => {
      updated[s.id] = 'Present';
    });
    setStaffAttendanceMarks(updated);
    setStaffUnsavedChanges(prev => prev + 1);
    triggerToast('Marked all instructional staff as Present.');
  };

  const submitStaffAttendanceAction = async () => {
    const records = nonAdminStaff.map(stf => ({
      staff: stf.id,
      date: staffAttendanceDate,
      status: staffAttendanceMarks[stf.id] || 'Present',
      check_in: staffAttCheckIn[stf.id] || '09:00 AM',
      check_out: staffAttCheckOut[stf.id] || '05:00 PM',
      total_in_time: '8h 0m',
      total_working_time: '8h 0m',
      remarks: staffAttendanceRemarks[stf.id] || 'Daily staff roll-call verified'
    }));

    try {
      await saveStaffAttendance(records);
      setStaffUnsavedChanges(0);
      const [freshStaffAtt, freshStats] = await Promise.all([
        getStaffAttendance({ days: '14' }),
        getDashboardStats()
      ]);
      setStaffAttendanceRecords(freshStaffAtt);
      setStats(freshStats);
      triggerToast(`Staff attendance for ${staffAttendanceDate} saved successfully!`);
    } catch (err) {
      console.error('Staff attendance save error:', err);
      alert('Error saving staff attendance.');
    }
  };

  const exportStaffAttendanceCSV = () => {
    const headers = ['Staff ID', 'Name', 'Designation', 'Discipline', 'Date', 'Check In', 'Check Out', 'Status', 'Remarks'];
    const rows = nonAdminStaff.map(s => [
      s.staff_id,
      s.full_name,
      s.designation,
      s.department_name || 'General',
      staffAttendanceDate,
      staffAttCheckIn[s.id] || '09:00 AM',
      staffAttCheckOut[s.id] || '05:00 PM',
      staffAttendanceMarks[s.id] || 'Present',
      staffAttendanceRemarks[s.id] || ''
    ]);
    exportToCSV(`staff-attendance-${staffAttendanceDate}.csv`, headers, rows);
  };

  // Fee Payment Handler
  const handleCreateFeePayment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student: parseInt(newPayment.student, 10),
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.payment_method,
        status: newPayment.status,
        billing_month: newPayment.billing_month,
        notes: newPayment.notes
      };
      await createFeePayment(payload);
      const [freshPayments, freshStudents] = await Promise.all([
        getFeePayments(),
        getERPStudents()
      ]);
      setFeePayments(freshPayments);
      setStudents(freshStudents);
      setShowAddPaymentModal(false);
      triggerToast('Fee payment recorded and receipt generated successfully!');
    } catch (err) {
      console.error('Fee creation error:', err);
      alert('Failed to record fee payment.');
    }
  };

  // Belt Promotion Handler
  const handlePromoteStudentBelt = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student: parseInt(promotionData.student, 10),
        to_belt: promotionData.to_belt,
        from_belt: students.find(s => s.id === parseInt(promotionData.student, 10))?.current_belt || 'White Belt',
        examiner: promotionData.examiner ? parseInt(promotionData.examiner, 10) : (staffMembers[0]?.id || null),
        certificate_number: promotionData.certificate_number || `WAR-${Date.now().toString().slice(-6)}`,
        remarks: promotionData.remarks
      };
      await createBeltPromotion(payload);
      const [freshPromotions, freshStudents] = await Promise.all([
        getBeltPromotions(),
        getERPStudents()
      ]);
      setBeltPromotions(freshPromotions);
      setStudents(freshStudents);
      setShowPromoteModal(false);
      triggerToast(`Student successfully promoted to ${promotionData.to_belt}!`);
    } catch (err) {
      console.error('Belt promotion error:', err);
      alert('Failed to record belt promotion.');
    }
  };

  const handleQuickStaffStatusChange = (staffId, newStatus) => {
    setStaffAttendanceMarks(prev => ({
      ...prev,
      [staffId]: newStatus
    }));
    setStaffUnsavedChanges(prev => prev + 1);
  };

  // Staff Edit Handlers
  const openEditStaffModal = (stf) => {
    setEditingStaff({
      id: stf.id,
      full_name: stf.full_name || '',
      staff_id: stf.staff_id || '',
      email: stf.email || '',
      phone: stf.phone || '',
      department: stf.department ? stf.department.toString() : '',
      designation: stf.designation || 'Instructor',
      role_type: stf.role_type || 'instructor',
      salary: stf.salary || '4500.00',
      is_active: stf.is_active !== undefined ? stf.is_active : true,
      notes: stf.notes || '',
    });
    setShowEditStaffModal(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: editingStaff.full_name.trim(),
        email: editingStaff.email.trim(),
        phone: editingStaff.phone.trim(),
        department: editingStaff.department ? parseInt(editingStaff.department, 10) : null,
        designation: editingStaff.designation.trim(),
        role_type: editingStaff.role_type,
        salary: parseFloat(editingStaff.salary) || 0.00,
        is_active: editingStaff.is_active,
        notes: editingStaff.notes,
      };
      await updateStaffMember(editingStaff.id, payload);
      setShowEditStaffModal(false);
      const [freshStaff, freshWorkforce] = await Promise.all([
        getStaffMembers(),
        getWorkforceAttendance(workforceDateFilter)
      ]);
      setStaffMembers(freshStaff);
      setWorkforceAttendance(freshWorkforce);
      triggerToast(`Staff member "${editingStaff.full_name}" updated successfully!`);
    } catch (err) {
      console.error('Update staff error:', err);
      alert('Error updating staff member. Please verify required fields.');
    }
  };

  // Student Edit Handlers
  const openEditStudentModal = (st) => {
    setEditingStudent({
      id: st.id,
      full_name: st.full_name || '',
      student_id: st.student_id || '',
      email: st.email || '',
      phone: st.phone || '',
      guardian_name: st.guardian_name || '',
      department: st.department ? st.department.toString() : '',
      course: st.course ? st.course.toString() : '',
      batch: st.batch ? st.batch.toString() : '',
      current_belt: st.current_belt || 'White Belt',
      fee_status: st.fee_status || 'Paid',
      is_active: st.is_active !== undefined ? st.is_active : true,
      notes: st.notes || '',
    });
    setShowEditStudentModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: editingStudent.full_name.trim(),
        email: editingStudent.email.trim(),
        phone: editingStudent.phone.trim(),
        guardian_name: editingStudent.guardian_name.trim(),
        department: editingStudent.department ? parseInt(editingStudent.department, 10) : null,
        course: editingStudent.course ? parseInt(editingStudent.course, 10) : null,
        batch: editingStudent.batch ? parseInt(editingStudent.batch, 10) : null,
        current_belt: editingStudent.current_belt,
        fee_status: editingStudent.fee_status,
        is_active: editingStudent.is_active,
        notes: editingStudent.notes,
      };
      await updateERPStudent(editingStudent.id, payload);
      setShowEditStudentModal(false);
      const [freshStudents, freshStats] = await Promise.all([
        getERPStudents(),
        getDashboardStats()
      ]);
      setStudents(freshStudents);
      setStats(freshStats);
      triggerToast(`Student "${editingStudent.full_name}" updated successfully!`);
    } catch (err) {
      console.error('Update student error:', err);
      alert('Error updating student. Please verify required fields.');
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingId(enquiryId);
    try {
      await updateERPEnquiry(enquiryId, { enquiry_status: newStatus });
      const [refreshedEnq, freshStats, refreshedStudents] = await Promise.all([
        getERPEnquiries(enquiryStatusFilter, enquirySearch),
        getDashboardStats(),
        getERPStudents(),
      ]);
      setEnquiries(refreshedEnq);
      setStats(freshStats);
      setStudents(refreshedStudents);
      triggerToast(`Enquiry updated to ${newStatus}. ${newStatus === 'Enrolled' ? 'Student account auto-created!' : ''}`);
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await createDepartment(newDept);
      setShowAddDeptModal(false);
      setNewDept({ name: '', code: '', description: '' });
      const [freshDepts, freshStats] = await Promise.all([getDepartments(), getDashboardStats()]);
      setDepartments(freshDepts);
      setStats(freshStats);
      triggerToast('Department successfully created!');
    } catch (err) {
      console.error(err);
      alert('Error creating department. Code must be unique.');
    }
  };

  const handleDeleteDepartment = async (deptId, deptName) => {
    if (!window.confirm(`Are you sure you want to delete department "${deptName}"?`)) return;
    try {
      await deleteDepartment(deptId);
      const [freshDepts, freshStats] = await Promise.all([getDepartments(), getDashboardStats()]);
      setDepartments(freshDepts);
      setStats(freshStats);
      triggerToast(`Department "${deptName}" removed.`);
    } catch (err) {
      alert('Cannot delete department with assigned members.');
    }
  };

  const calculateNextStudentId = (studentsList) => {
    if (!studentsList || studentsList.length === 0) return 'STU-1001';
    let maxNum = 1000;
    studentsList.forEach(s => {
      if (s.student_id) {
        const match = s.student_id.match(/STU-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    return `STU-${maxNum + 1}`;
  };

  const calculateNextStaffId = (staffList) => {
    if (!staffList || staffList.length === 0) return 'STF-001';
    let maxNum = 0;
    staffList.forEach(s => {
      if (s.staff_id) {
        const match = s.staff_id.match(/STF-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    return `STF-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const openAddStudentModal = async () => {
    const defaultDept = departments.length > 0 ? String(departments[0].id) : '';
    const defaultCourse = courses.length > 0 ? String(courses[0].id) : '';
    const calculatedId = calculateNextStudentId(students);

    setNewStudent({
      full_name: '',
      student_id: calculatedId,
      email: '',
      phone: '',
      department: defaultDept,
      course: defaultCourse,
      batch: '',
      guardian_name: '',
      current_belt: 'White Belt',
      fee_status: 'Paid',
      password: 'student123',
      notes: '',
    });
    setShowAddStudentModal(true);

    try {
      const res = await getNextStudentId();
      if (res?.next_student_id) {
        setNewStudent(prev => ({
          ...prev,
          student_id: res.next_student_id,
        }));
      }
    } catch (e) {
      // Keep calculated ID
    }
  };

  const openAddStaffModal = async () => {
    const defaultDept = departments.length > 0 ? String(departments[0].id) : '';
    const calculatedId = calculateNextStaffId(staffMembers);

    setNewStaff({
      full_name: '',
      staff_id: calculatedId,
      email: '',
      phone: '',
      department: defaultDept,
      designation: 'Senior Martial Arts Coach',
      role_type: 'instructor',
      salary: '4500.00',
      password: 'warrior123',
      notes: '',
    });
    setShowAddStaffModal(true);

    try {
      const res = await getNextStaffId();
      if (res?.next_staff_id) {
        setNewStaff(prev => ({
          ...prev,
          staff_id: res.next_staff_id,
        }));
      }
    } catch (e) {
      // Keep calculated ID
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const selectedDept = newStaff.department || (departments[0]?.id ? String(departments[0].id) : null);
      const payload = {
        ...newStaff,
        department: newStaff.department ? parseInt(newStaff.department, 10) : null,
        department: selectedDept ? parseInt(selectedDept, 10) : null,
      };
      await createStaffMember(payload);
      setShowAddStaffModal(false);
      setNewStaff({
        full_name: '',
        staff_id: '',
        email: '',
        phone: '',
        department: '',
        designation: 'Instructor',
        role_type: 'instructor',
        salary: '4500.00',
        password: 'warrior123',
        notes: '',
      });
      const [freshStaff, freshStats] = await Promise.all([getStaffMembers(), getDashboardStats()]);
      setStaffMembers(freshStaff);
      setStats(freshStats);
      triggerToast('Staff member & credentials successfully created! Can login via Staff ID or Email.');
    } catch (err) {
      alert('Error creating staff member. Verify Email or Staff ID uniqueness.');
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${staffName}"?`)) return;
    try {
      await deleteStaffMember(staffId);
      const [freshStaff, freshStats] = await Promise.all([getStaffMembers(), getDashboardStats()]);
      setStaffMembers(freshStaff);
      setStats(freshStats);
      triggerToast(`Staff member "${staffName}" removed.`);
    } catch (err) {
      alert('Error removing staff member.');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const selectedDept = newStudent.department || (departments[0]?.id ? String(departments[0].id) : null);
      const selectedCourse = newStudent.course || (courses[0]?.id ? String(courses[0].id) : null);
      const payload = {
        ...newStudent,
        department: newStudent.department ? parseInt(newStudent.department, 10) : null,
        course: newStudent.course ? parseInt(newStudent.course, 10) : null,
        department: selectedDept ? parseInt(selectedDept, 10) : null,
        course: selectedCourse ? parseInt(selectedCourse, 10) : null,
        batch: newStudent.batch ? parseInt(newStudent.batch, 10) : null,
      };
      await createERPStudent(payload);
      setShowAddStudentModal(false);
      setNewStudent({
        full_name: '',
        student_id: '',
        email: '',
        phone: '',
        department: '',
        course: '',
        batch: '',
        guardian_name: '',
        current_belt: 'White Belt',
        fee_status: 'Paid',
        password: 'student123',
        notes: '',
      });
      const [freshStudents, freshStats] = await Promise.all([getERPStudents(), getDashboardStats()]);
      setStudents(freshStudents);
      setStats(freshStats);
      triggerToast('Student member registered! Can login via Student ID or Email.');
    } catch (err) {
      alert('Error registering student. Verify Email or Student ID uniqueness.');
    }
  };

  const handleDeleteStudent = async (studId, studName) => {
    if (!window.confirm(`Are you sure you want to remove student "${studName}"?`)) return;
    try {
      await deleteERPStudent(studId);
      const [freshStudents, freshStats] = await Promise.all([getERPStudents(), getDashboardStats()]);
      setStudents(freshStudents);
      setStats(freshStats);
      triggerToast(`Student "${studName}" removed.`);
    } catch (err) {
      alert('Error removing student.');
    }
  };

  const openCredentialModal = (item, type) => {
    setCredentialTarget({
      type,
      id: item.id,
      name: item.full_name,
      identifier: type === 'staff' ? item.staff_id : item.student_id,
      email: item.email,
      username: item.username || (type === 'staff' ? item.staff_id : item.student_id),
      password: '',
      role_type: item.role_type || (type === 'staff' ? 'instructor' : 'student'),
    });
    setShowPasswordInModal(false);
    setShowCredentialModal(true);
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: credentialTarget.username.trim(),
        password: credentialTarget.password,
        role_type: credentialTarget.role_type,
      };

      if (credentialTarget.type === 'staff') {
        await manageStaffCredentials(credentialTarget.id, payload);
        const freshStaff = await getStaffMembers();
        setStaffMembers(freshStaff);
      } else {
        await manageStudentCredentials(credentialTarget.id, payload);
        const freshStudents = await getERPStudents();
        setStudents(freshStudents);
      }

      setShowCredentialModal(false);
      triggerToast(`Credentials updated for ${credentialTarget.name}! Can login via ID (${credentialTarget.identifier}) or Email (${credentialTarget.email}).`);
    } catch (err) {
      alert('Error updating credentials. Please verify username uniqueness.');
    }
  };

  const submitAttendance = async () => {
    const records = Object.entries(attendanceMarks).map(([studentId, status]) => ({
      student: parseInt(studentId, 10),
      date: attendanceDate,
      schedule: selectedBatchForAtt ? parseInt(selectedBatchForAtt, 10) : null,
      status: status,
      remarks: 'Marked via Sensei ERP Portal',
    }));

    try {
      await saveAttendance(records);
      setAttendanceSuccess(true);
      triggerToast('Attendance successfully saved to PostgreSQL database!');
      setTimeout(() => setAttendanceSuccess(false), 3500);
    } catch (err) {
      console.error('Attendance submit error:', err);
    }
  };

  // Non-Admin Staff helper - ADMIN DOES NOT HAVE ATTENDANCE
  const nonAdminStaff = staffMembers.filter(
    s => s.role_type !== 'admin' && s.staff_id !== 'STF-001' && s.user?.username !== 'admin'
  );
  const staffPresentCount = nonAdminStaff.filter(s => staffAttendanceMarks[s.id] === 'Present').length;
  const staffAbsentCount = nonAdminStaff.filter(s => staffAttendanceMarks[s.id] === 'Absent').length;
  const staffOtherCount = nonAdminStaff.filter(s => ['Late', 'Half Day', 'Leave'].includes(staffAttendanceMarks[s.id])).length;

  // Formatted date string (e.g. Sunday, Nov 22, 2026)
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const userDisplayName = (user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'WARRIOR').toUpperCase();

  return (
    <div className={`erp-enterprise-root theme-${theme}`}>
      {/* =========================================================================
          LEFT SIDEBAR (COLLAPSIBLE)
          ========================================================================= */}
      <aside className={`erp-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Area */}
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <Flame size={20} color="#FFFFFF" />
          </div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <span className="brand-title">WARRIOR</span>
              <span className="brand-subtitle">ERP SYSTEM</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-collapse-toggle"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft size={16} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Search Bar in Sidebar */}
        {!sidebarCollapsed && (
          <div className="sidebar-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search menu..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="sidebar-search-input"
            />
            <span className="search-kbd">⌘K</span>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="sidebar-nav">
          {/* Section 1: WORKSPACE */}
          <div className="nav-section-label">{!sidebarCollapsed ? 'WORKSPACE' : '•••'}</div>

          <button
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
            title="Dashboard"
          >
            <LayoutDashboard size={17} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button
            className={`nav-item ${activeView === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveView('attendance')}
            title="Attendance"
          >
            <Calendar size={17} />
            {!sidebarCollapsed && <span>Attendance</span>}
          </button>

          {role === 'admin' && (
            <button
              className={`nav-item ${activeView === 'enquiries' ? 'active' : ''}`}
              onClick={() => setActiveView('enquiries')}
              title="Admission Management"
            >
              <Mail size={17} />
              {!sidebarCollapsed && <span>Admission Management</span>}
              {!sidebarCollapsed && enquiries.length > 0 && (
                <span className="nav-badge alert">
                  {enquiries.filter(e => e.enquiry_status === 'New').length || enquiries.length}
                </span>
              )}
            </button>
          )}

          {/* Section 2: ACADEMY MANAGEMENT */}
          <div className="nav-section-label">{!sidebarCollapsed ? 'ACADEMY MANAGEMENT' : '•••'}</div>

          {role === 'admin' && (
            <button
              className={`nav-item ${activeView === 'departments' ? 'active' : ''}`}
              onClick={() => setActiveView('departments')}
              title="Disciplines"
            >
              <Building size={17} />
              {!sidebarCollapsed && <span>Disciplines</span>}
              {!sidebarCollapsed && departments.length > 0 && <span className="nav-badge count">{departments.length}</span>}
            </button>
          )}

          <button
            className={`nav-item ${activeView === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveView('courses')}
            title="Courses & Programs"
          >
            <BookOpen size={17} />
            {!sidebarCollapsed && <span>Courses & Programs</span>}
            {!sidebarCollapsed && <span className="nav-badge count">{courses.length}</span>}
          </button>

          <button
            className={`nav-item ${activeView === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveView('timetable')}
            title="Batches & Timetable"
          >
            <Clock size={17} />
            {!sidebarCollapsed && <span>Batches & Timetable</span>}
            {!sidebarCollapsed && schedules.length > 0 && <span className="nav-badge count">{schedules.length}</span>}
          </button>

          {/* Section 3: PEOPLE MANAGEMENT */}
          <div className="nav-section-label">{!sidebarCollapsed ? 'PEOPLE MANAGEMENT' : '•••'}</div>

          <button
            className={`nav-item ${activeView === 'students' ? 'active' : ''}`}
            onClick={() => setActiveView('students')}
            title="Student Members"
          >
            <Users size={17} />
            {!sidebarCollapsed && <span>Student Members</span>}
            {!sidebarCollapsed && <span className="nav-badge count">{students.length}</span>}
          </button>

          {role === 'admin' && (
            <button
              className={`nav-item ${activeView === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveView('staff')}
              title="Staff & Instructors"
            >
              <Briefcase size={17} />
              {!sidebarCollapsed && <span>Staff & Instructors</span>}
              {!sidebarCollapsed && <span className="nav-badge count">{staffMembers.length}</span>}
            </button>
          )}

          <button
            className={`nav-item ${activeView === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveView('fees')}
            title="Fees & Payments"
          >
            <DollarSign size={17} />
            {!sidebarCollapsed && <span>Fees & Payments</span>}
          </button>

          <button
            className={`nav-item ${activeView === 'belts' ? 'active' : ''}`}
            onClick={() => setActiveView('belts')}
            title="Belt & Rank Management"
          >
            <Award size={17} />
            {!sidebarCollapsed && <span>Belt & Rank Management</span>}
          </button>

          {/* Section 4: REPORTS & SETTINGS */}
          <div className="nav-section-label">{!sidebarCollapsed ? 'REPORTS & SETTINGS' : '•••'}</div>

          <button
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
            title="Reports & Analytics"
          >
            <TrendingUp size={17} />
            {!sidebarCollapsed && <span>Reports & Analytics</span>}
          </button>

          <button
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
            title="Settings"
          >
            <Settings size={17} />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>

          {/* Section 5: EXTERNAL */}
          <div className="nav-section-label">{!sidebarCollapsed ? 'EXTERNAL' : '•••'}</div>

          <Link to="/home" className="nav-item" title="View Public Website">
            <ExternalLink size={17} />
            {!sidebarCollapsed && <span>View Public Website</span>}
          </Link>
        </nav>

        {/* Sidebar Footer: Sign Out */}
        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-logout-btn" title="Sign Out">
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN APPLICATION WORKSPACE
          ========================================================================= */}
      <div className={`erp-main-area ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
        {/* Top Header Bar */}
        <header className="erp-topbar">
          <div className="topbar-left">
            <div className="notification-pill">
              <Bell size={14} className="bell-icon" />
              <span>
                {role === 'admin'
                  ? `${enquiries.filter(e => e.enquiry_status === 'New').length} pending admission inquiries`
                  : 'No active alerts'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Theme Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-mode-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} color="#F59E0B" />}
              <span className="theme-toggle-text">{theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}</span>
            </button>

            {/* Role Badge */}
            <span className={`role-pill role-${role}`}>
              {role?.toUpperCase()}
            </span>

            {/* User Profile Chip */}
            <div className="user-profile-chip">
              <div className="avatar-circle">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="User" />
                ) : (
                  <span>{user?.username?.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="user-names">
                <span className="user-fullname">{user?.first_name || user?.username}</span>
                <span className="user-sub">{user?.custom_id || user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {actionSuccessMsg && (
          <div className="toast-notification-banner">
            <div className="toast-content">
              <CheckCircle2 size={18} color="#10B981" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="toast-close-btn">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Greeting & Filter Bar */}
        <section className="erp-greeting-bar">
          <div className="greeting-text">
            <h1>{timeGreeting}, {userDisplayName}!</h1>
            <p>
              {role === 'admin' && 'Executive oversight, manual attendance governance, and Dojo operations.'}
              {role === 'instructor' && 'Classroom rosters, daily attendance register, and student martial arts progression.'}
              {role === 'student' && 'Dojo passport, belt ranking progression, and training class timetable.'}
            </p>
          </div>

          <div className="greeting-filters">
            <div className="date-display-pill">
              <Calendar size={15} />
              <span>{todayFormatted}</span>
            </div>

            {role === 'admin' && (
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}

            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Batches</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>{s.batch_name} ({s.training_day})</option>
              ))}
            </select>

            <button onClick={loadDashboardData} className="refresh-btn" title="Refresh Dashboard Data">
              <RefreshCw size={15} />
            </button>
          </div>
        </section>

        {/* =====================================================================
            VIEW 1: PRIMARY DASHBOARD (TEMPLATE SPECIFICATION LAYOUT)
            ===================================================================== */}
        {activeView === 'dashboard' && (
          <div className="dashboard-content-flow">
            {/* TOP 4 KPI CARDS GRID */}
            <div className="kpi-cards-grid">
              {/* Card 1: STAFF ATTENDANCE (MANUAL) */}
              <div className="kpi-metric-card border-green">
                <div className="card-top-row">
                  <span className="card-kpi-title">STAFF ATTENDANCE (MANUAL)</span>
                  <div className="card-icon-bubble green">
                    <Users size={18} />
                  </div>
                </div>
                <div className="card-main-stat">
                  <span className="dots-indicator">●●●</span> {staffPresentCount} / {nonAdminStaff.length} Staff Present
                </div>
                <div className="card-sub-info">
                  <span className="info-rate">
                    Attendance Rate: <strong>{nonAdminStaff.length > 0 ? Math.round((staffPresentCount / nonAdminStaff.length) * 100) : 0}%</strong>
                  </span>
                </div>
                <div className="card-badges-row">
                  <span className="status-sub-pill" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.12)' }}>{staffPresentCount} Present</span>
                  <span className="status-sub-pill" style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)' }}>{staffAbsentCount} Absent</span>
                  <span className="status-sub-pill" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.12)' }}>{staffOtherCount} Leave / Late</span>
                  <button onClick={() => { setActiveView('attendance'); setAttendanceTab('staff'); }} className="card-link-action">Roll-Call ↗</button>
                </div>
              </div>

              {/* Card 2: MARTIAL DISCIPLINES & BATCHES */}
              <div className="kpi-metric-card border-purple">
                <div className="card-top-row">
                  <span className="card-kpi-title">DISCIPLINES & PROGRAMS</span>
                  <div className="card-icon-bubble purple">
                    <Briefcase size={18} />
                  </div>
                </div>
                <div className="card-main-stat">
                  <span className="dots-indicator">●●●</span> {courses.length} Active Disciplines
                </div>
                <div className="card-sub-info">
                  <span className="info-tag-purple">{courses.length} Total Managed</span>
                  <span className="info-tag-green">Multi-Discipline Dojo</span>
                </div>
                <div className="card-badges-row">
                  <span className="status-text-muted">Training on Track</span>
                  <button onClick={() => setActiveView('courses')} className="card-link-action">View Board ↗</button>
                </div>
              </div>

              {/* Card 3: OPERATIONAL TASKS & ADMISSIONS */}
              <div className="kpi-metric-card border-blue">
                <div className="card-top-row">
                  <span className="card-kpi-title">OPERATIONAL ADMISSIONS</span>
                  <div className="card-icon-bubble blue">
                    <CheckSquare size={18} />
                  </div>
                </div>
                <div className="card-main-stat">
                  <span className="dots-indicator">●●●</span> {enquiries.length} Enquiries
                </div>
                <div className="card-sub-info">
                  <span className="info-tag-green">
                    {enquiries.filter(e => e.enquiry_status === 'New').length} New
                  </span>
                  <span className="info-tag-amber">
                    {enquiries.filter(e => e.enquiry_status === 'In Review').length} In Progress
                  </span>
                </div>
                <div className="card-badges-row">
                  <span className="status-text-muted">
                    {enquiries.filter(e => e.enquiry_status === 'Enrolled').length} Enrolled
                  </span>
                  <button onClick={() => setActiveView('enquiries')} className="card-link-action">Task Matrix ↗</button>
                </div>
              </div>

              {/* Card 4: PENDING SIGN-OFFS & DUES */}
              <div className="kpi-metric-card border-amber">
                <div className="card-top-row">
                  <span className="card-kpi-title">PENDING SIGN-OFFS & DUES</span>
                  <div className="card-icon-bubble amber">
                    <Shield size={18} />
                  </div>
                </div>
                <div className="card-main-stat">
                  <span className="dots-indicator">●●●</span> Action Items
                </div>
                <div className="card-sub-info">
                  <span className="info-tag-red">
                    {students.filter(s => s.fee_status === 'Due' || s.fee_status === 'Overdue').length} Fees Due
                  </span>
                  <span className="info-tag-blue">0 Belt Reviews</span>
                </div>
                <div className="card-badges-row">
                  <span className="status-text-muted">{students.length} Enrolled Students</span>
                  <button onClick={() => setActiveView('students')} className="card-link-action amber">Resolve Queue ↗</button>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: SPLIT VIEW (LIVE ATTENDANCE + ACTIVE DELIVERABLES) */}
            <div className="middle-panels-split">
              {/* Left Panel (62%): Today's Staff Attendance (Manual Register) */}
              <div className="panel-box attendance-live-panel">
                <div className="panel-header-split">
                  <div>
                    <div className="panel-title-with-icon">
                      <Users size={18} color="#10B981" />
                      <h3>Today's Staff Attendance Register</h3>
                    </div>
                    <p className="panel-subtitle">Manual daily attendance roll-call for coaches & senseis (Admin excluded)</p>
                  </div>
                  <div className="panel-header-controls">
                    <button
                      onClick={() => handleDateChangeStaffAttendance(new Date().toISOString().split('T')[0])}
                      className={`control-btn ${attendanceDate === new Date().toISOString().split('T')[0] ? 'active' : ''}`}
                    >
                      Today
                    </button>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => handleDateChangeStaffAttendance(e.target.value)}
                      className="control-date-input"
                    />
                    <button onClick={markAllStaffPresent} className="control-btn" title="Set all to Present">All Present</button>
                    <button onClick={() => submitStaffAttendance()} className="control-btn-green">Save Register</button>
                  </div>
                </div>

                {/* Filter Sub-Tabs */}
                <div className="sub-filter-row">
                  <button
                    onClick={() => setStaffFilterTab('all')}
                    className={`sub-tab-pill ${staffFilterTab === 'all' ? 'active' : ''}`}
                  >
                    All Staff ({nonAdminStaff.length})
                  </button>
                  <button
                    onClick={() => setStaffFilterTab('present')}
                    className={`sub-tab-pill ${staffFilterTab === 'present' ? 'active' : ''}`}
                  >
                    Present ({staffPresentCount})
                  </button>
                  <button
                    onClick={() => setStaffFilterTab('absent')}
                    className={`sub-tab-pill ${staffFilterTab === 'absent' ? 'active' : ''}`}
                  >
                    Absent ({staffAbsentCount})
                  </button>
                  <button
                    onClick={() => setStaffFilterTab('other')}
                    className={`sub-tab-pill ${staffFilterTab === 'other' ? 'active' : ''}`}
                  >
                    Leave / Late ({staffOtherCount})
                  </button>
                </div>

                {/* Manual Attendance Table */}
                <div className="table-wrapper-dark">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>STAFF / SENSEI</th>
                        <th>DEPARTMENT</th>
                        <th>DESIGNATION</th>
                        <th style={{ textAlign: 'center' }}>MARK ATTENDANCE STATUS</th>
                        <th>NOTES / REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonAdminStaff
                        .filter(stf => {
                          const status = staffAttendanceMarks[stf.id] || 'Present';
                          if (staffFilterTab === 'present') return status === 'Present';
                          if (staffFilterTab === 'absent') return status === 'Absent';
                          if (staffFilterTab === 'other') return ['Late', 'Half Day', 'Leave'].includes(status);
                          return true;
                        })
                        .map((stf) => {
                          const currentStatus = staffAttendanceMarks[stf.id] || 'Present';
                          return (
                            <tr key={stf.id}>
                              <td>
                                <div className="employee-cell">
                                  <div className="avatar-mini">{stf.full_name?.substring(0, 2).toUpperCase()}</div>
                                  <div>
                                    <span className="emp-name">{stf.full_name}</span>
                                    <span className="emp-id">{stf.staff_id}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="branch-tag">{stf.department_name || 'General'}</span>
                              </td>
                              <td style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{stf.designation || 'Instructor'}</td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                  {['Present', 'Absent', 'Late', 'Half Day', 'Leave'].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleQuickStaffStatusChange(stf.id, st)}
                                      className={`att-choice-btn ${currentStatus === st ? `selected-${st.toLowerCase().replace(' ', '-')}` : ''}`}
                                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Optional note..."
                                  value={staffAttendanceRemarks[stf.id] || ''}
                                  onChange={(e) => setStaffAttendanceRemarks({ ...staffAttendanceRemarks, [stf.id]: e.target.value })}
                                  style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'inherit'
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      {nonAdminStaff.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8' }}>
                            No instructional or support staff found. (Administrators do not require attendance).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Panel (38%): Active Projects & Deliverables */}
              <div className="panel-box deliverables-panel">
                <div className="panel-header-split">
                  <div>
                    <div className="panel-title-with-icon">
                      <Briefcase size={18} color="#8B5CF6" />
                      <h3>Active Disciplines & Deliverables</h3>
                    </div>
                    <p className="panel-subtitle">High-priority martial arts training programs</p>
                  </div>
                  <button onClick={() => setActiveView('courses')} className="link-all">All ({courses.length}) →</button>
                </div>

                <div className="deliverables-list">
                  {courses.map((course) => (
                    <div key={course.id} className="deliverable-item-card">
                      <div className="deliverable-info">
                        <h4>{course.title}</h4>
                        <span className="deliverable-meta">
                          {course.age_group} • Monthly Fee: ${parseFloat(course.monthly_fee).toFixed(2)}
                        </span>
                      </div>
                      <div className="deliverable-status-tag">
                        Active Syllabus
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveView('courses')} className="new-initiation-btn">
                  <Plus size={16} /> New Course / Batch Initiation
                </button>
              </div>
            </div>

            {/* BOTTOM ROW: OPERATIONAL TASKS FEED + EXECUTIVE QUICK ACTIONS */}
            <div className="bottom-panels-split">
              {/* Left Panel: Operational Tasks Feed */}
              <div className="panel-box tasks-feed-panel">
                <div className="panel-header-split">
                  <div className="panel-title-with-icon">
                    <CheckSquare size={18} color="#3B82F6" />
                    <h3>Operational Tasks Feed</h3>
                  </div>
                  <button onClick={() => setActiveView('enquiries')} className="link-all">Manage All →</button>
                </div>
                <p className="panel-subtitle">Pending deliverables across dojo teams</p>

                <div className="tasks-feed-list">
                  {[
                    { id: 1, title: 'Process 3 incoming Karate admission inquiries', dept: 'Admissions', due: 'Today', priority: 'high' },
                    { id: 2, title: 'Verify Belt Grading eligibility for Alexander Cole', dept: 'BJJ Discipline', due: 'Tomorrow', priority: 'med' },
                    { id: 3, title: 'Quarterly membership fee follow-up for Jessica Taylor', dept: 'Finance', due: 'Nov 25', priority: 'high' },
                    { id: 4, title: 'Assign Master Kenji weekend masterclass timetable', dept: 'Curriculum', due: 'Nov 28', priority: 'low' },
                  ].map((task) => (
                    <div key={task.id} className="task-feed-item">
                      <div className="task-left">
                        <input type="checkbox" className="custom-check" />
                        <div>
                          <div className="task-title-text">{task.title}</div>
                          <span className="task-dept-badge">{task.dept} • Due {task.due}</span>
                        </div>
                      </div>
                      <span className={`priority-tag ${task.priority}`}>{task.priority.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Executive Quick Actions (Colorful Tile Grid) */}
              <div className="panel-box quick-actions-panel">
                <div className="panel-title-with-icon">
                  <Activity size={18} color="#F59E0B" />
                  <h3>Executive Quick Actions</h3>
                </div>
                <p className="panel-subtitle">Instant administrative shortcuts & operational tools</p>

                <div className="quick-tiles-grid">
                  {/* Tile 1: Staff Directory */}
                  <div className="quick-tile tile-blue" onClick={() => { setActiveView('staff'); setShowAddStaffModal(true); }}>
                    <div className="quick-tile tile-blue" onClick={() => { setActiveView('staff'); openAddStaffModal(); }}>
                      <div className="tile-icon-box">
                        <Briefcase size={22} />
                      </div>
                      <h4>Staff Directory</h4>
                      <p>Add & Manage</p>
                    </div>

                    {/* Tile 2: Projects / Courses */}
                    <div className="quick-tile tile-teal" onClick={() => setActiveView('courses')}>
                      <div className="tile-icon-box">
                        <BookOpen size={22} />
                      </div>
                      <h4>Disciplines</h4>
                      <p>Programs & Board</p>
                    </div>

                    {/* Tile 3: Admission Enquiries */}
                    <div className="quick-tile tile-amber" onClick={() => setActiveView('enquiries')}>
                      <div className="tile-icon-box">
                        <Mail size={22} />
                      </div>
                      <h4>Admissions Queue</h4>
                      <p>Review & Enroll</p>
                    </div>

                    {/* Tile 4: Work Emails / Contact */}
                    <div className="quick-tile tile-cyan" onClick={() => setActiveView('enquiries')}>
                      <div className="tile-icon-box">
                        <MessageCircle size={22} />
                      </div>
                      <h4>Lead Inquiries</h4>
                      <p>WhatsApp & Phone</p>
                    </div>

                    {/* Tile 5: Staff Attendance */}
                    <div className="quick-tile tile-purple" onClick={() => { setActiveView('attendance'); setAttendanceTab('staff'); }}>
                      <div className="tile-icon-box">
                        <Users size={22} />
                      </div>
                      <h4>Staff Attendance</h4>
                      <p>Manual Roll-Call</p>
                    </div>

                    {/* Tile 6: Student Attendance */}
                    <div className="quick-tile tile-skyblue" onClick={() => { setActiveView('attendance'); setAttendanceTab('students'); }}>
                      <div className="tile-icon-box">
                        <Calendar size={22} />
                      </div>
                      <h4>Student Register</h4>
                      <p>Classroom Register</p>
                    </div>

                    {/* Tile 7: Students & Batches */}
                    <div className="quick-tile tile-magenta" onClick={() => { setActiveView('students'); setShowAddStudentModal(true); }}>
                      <div className="quick-tile tile-magenta" onClick={() => { setActiveView('students'); openAddStudentModal(); }}>
                        <div className="tile-icon-box">
                          <Users size={22} />
                        </div>
                        <h4>Students & Batch</h4>
                        <p>Academic Hub</p>
                      </div>

                      {/* Tile 8: Dojo Governance */}
                      <div className="quick-tile tile-slate" onClick={() => setActiveView('departments')}>
                        <div className="tile-icon-box">
                          <Shield size={22} />
                        </div>
                        <h4>Dojo Governance</h4>
                        <p>System Settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        )}

              {/* =====================================================================
            VIEW 2: NATDEMY ATTENDANCE & ANALYTICS HUB (ALL ROLES)
            ===================================================================== */}
        {activeView === 'attendance' && (() => {
          // Resolve current records based on role and active sub-tab
          const currentAttendanceRecords = (() => {
            let list = [];
            if (role === 'student') {
              list = studentAttendanceRecords;
            } else if (attendanceSubTab === 'personal') {
              list = staffAttendanceRecords.filter(r => 
                r.staff_code === 'STF-002' || 
                r.staff_name?.toLowerCase().includes('marcus') || 
                r.staff_name?.toLowerCase().includes((user?.username || '').toLowerCase())
              );
              // Fallback to all staff if personal instructor list is empty
              if (list.length === 0) list = staffAttendanceRecords;
            } else if (attendanceSubTab === 'students') {
              list = studentAttendanceRecords;
            } else {
              list = staffAttendanceRecords;
            }

            return list.filter(r => {
              const q = attendanceSearchQuery.toLowerCase().trim();
              if (q) {
                const name = (r.staff_name || r.student_name || '').toLowerCase();
                const code = (r.staff_code || r.student_code || r.staff_id || r.student_id || '').toLowerCase();
                const branch = (r.branch_name || r.department_name || r.course_name || '').toLowerCase();
                const remarks = (r.remarks || '').toLowerCase();
                if (!name.includes(q) && !code.includes(q) && !branch.includes(q) && !remarks.includes(q)) {
                  return false;
                }
              }
              if (attendanceDeptFilter) {
                const branch = (r.branch_name || r.department_name || r.course_name || '').toLowerCase();
                if (!branch.includes(attendanceDeptFilter.toLowerCase())) {
                  return false;
                }
              }
              return true;
            });
          })();

          const attKPIs = computeAttendanceKPIs(currentAttendanceRecords);
          const totalAttEntries = currentAttendanceRecords.length;
          const totalAttPages = Math.max(1, Math.ceil(totalAttEntries / attendancePageSize));
          const safeAttPage = Math.min(attendanceCurrentPage, totalAttPages);
          const startAttIndex = (safeAttPage - 1) * attendancePageSize;
          const endAttIndex = Math.min(startAttIndex + attendancePageSize, totalAttEntries);
          const pagedAttRecords = currentAttendanceRecords.slice(startAttIndex, endAttIndex);

          // Group paginated records by date
          const groupedAttByDate = {};
          pagedAttRecords.forEach(r => {
            const d = r.date || 'Today';
            if (!groupedAttByDate[d]) groupedAttByDate[d] = [];
            groupedAttByDate[d].push(r);
          });

          // Generate pagination page numbers
          const pageNumbers = [];
          for (let p = 1; p <= totalAttPages; p++) {
            if (p === 1 || p === totalAttPages || (p >= safeAttPage - 1 && p <= safeAttPage + 1)) {
              pageNumbers.push(p);
            }
          }

          return (
            <div className="attendance-analytics-hub">
              {/* Top Natdemy Banner */}
              <div className="att-hub-header">
                <div>
                  <h1 className="att-hub-title">Attendance & Analytics</h1>
                  <p className="att-hub-subtitle">
                    Monitor real-time punches, late indicators, absenteeism patterns, and monthly leave balances.
                  </p>
                </div>

                <div className="att-mode-pill-tabs">
                  <button 
                    type="button" 
                    onClick={() => setAttendanceViewMode('daily')}
                    className={`att-mode-pill ${attendanceViewMode === 'daily' ? 'active' : ''}`}
                  >
                    Daily Monitoring
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAttendanceViewMode('daywise')}
                    className={`att-mode-pill ${attendanceViewMode === 'daywise' ? 'active' : ''}`}
                  >
                    Day-Wise Report
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAttendanceViewMode('monthly')}
                    className={`att-mode-pill ${attendanceViewMode === 'monthly' ? 'active' : ''}`}
                  >
                    Monthly Reports
                  </button>
                </div>
              </div>

              {/* Sub-Role Navigation & Action Row */}
              <div className="att-subnav-bar">
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {role === 'admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => { setAttendanceSubTab('staff'); setAttendanceCurrentPage(1); }}
                        className={`att-subtab-btn ${attendanceSubTab === 'staff' ? 'active' : ''}`}
                      >
                        <Briefcase size={15} />
                        <span>Staff Attendance Ledger</span>
                        <span className="att-badge-count">{staffAttendanceRecords.length}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAttendanceSubTab('students'); setAttendanceCurrentPage(1); }}
                        className={`att-subtab-btn ${attendanceSubTab === 'students' ? 'active' : ''}`}
                      >
                        <Users size={15} />
                        <span>Student Class Attendance</span>
                        <span className="att-badge-count">{studentAttendanceRecords.length}</span>
                      </button>
                    </>
                  )}

                  {(role === 'instructor' || role === 'sensei') && (
                    <>
                      <button
                        type="button"
                        onClick={() => { setAttendanceSubTab('personal'); setAttendanceCurrentPage(1); }}
                        className={`att-subtab-btn ${attendanceSubTab === 'personal' ? 'active' : ''}`}
                      >
                        <Briefcase size={15} />
                        <span>My Attendance Ledger</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAttendanceSubTab('students'); setAttendanceCurrentPage(1); }}
                        className={`att-subtab-btn ${attendanceSubTab === 'students' ? 'active' : ''}`}
                      >
                        <Users size={15} />
                        <span>My Students' Attendance</span>
                        <span className="att-badge-count">{studentAttendanceRecords.length}</span>
                      </button>
                    </>
                  )}

                  {role === 'student' && (
                    <div className="att-subtab-btn active" style={{ cursor: 'default' }}>
                      <Award size={15} />
                      <span>My Dojo Training Attendance Ledger</span>
                      <span className="att-badge-count">{studentAttendanceRecords.length} Classes</span>
                    </div>
                  )}
                </div>

                {/* Right Action: Record Manual Attendance Modal Trigger (Admin & Instructor only) */}
                {role !== 'student' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMarkModalTarget(attendanceSubTab === 'students' ? 'student' : 'staff');
                      setShowManualMarkModal(true);
                    }}
                    className="btn-primary-action"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.84rem' }}
                  >
                    <Plus size={15} />
                    <span>+ Record Roll-Call Attendance</span>
                  </button>
                )}
              </div>

              {/* Filters & KPI Metrics Row */}
              <div className="att-metrics-container">
                {/* Left: Days Filter Dropdown */}
                <div className="att-range-selector-box">
                  <label className="att-range-label">Time Horizon</label>
                  <div className="att-select-wrapper">
                    <select
                      value={attendanceRangeDays}
                      onChange={(e) => handleRangeDaysSelect(e.target.value)}
                      className="att-range-dropdown"
                    >
                      <option value="7">Recent (Past 7 Days)</option>
                      <option value="14">Past 14 Days</option>
                      <option value="30">Past 30 Days (Full Month)</option>
                      <option value="all">All-Time Roll-Call Ledger</option>
                    </select>
                  </div>
                </div>

                {/* KPI 1: Cycle */}
                <div className="att-kpi-card">
                  <div className="kpi-icon-box kpi-icon-cycle">
                    <Calendar size={18} />
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-tag">CYCLE</span>
                    <span className="kpi-value-text">{attKPIs.cycleRange}</span>
                    <span className="kpi-subtext">{attKPIs.cycleSub}</span>
                  </div>

                  <div className="departments-grid">
                    {departments.map((dept) => (
                      <div key={dept.id} className="dept-card-dark">
                        <div className="dept-card-header">
                          <span className="dept-code-tag">CODE: {dept.code}</span>
                          <span className={`dept-status-tag ${dept.is_active ? 'active' : 'inactive'}`}>
                            {dept.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <h3>{dept.name}</h3>
                        <p>{dept.description || 'Specialized division dedicated to technical excellence and martial discipline.'}</p>

                        <div className="dept-stats-row">
                          <span>Staff Senseis: <strong>{dept.staff_count ?? 0}</strong></span>
                          <span>Students: <strong>{dept.student_count ?? 0}</strong></span>
                        </div>

                        <div className="dept-card-footer">
                          <button
                            onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                            className="btn-danger-outline"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                {/* KPI 2: Late */}
                <div className="att-kpi-card">
                  <div className="kpi-icon-box kpi-icon-late">
                    <AlertCircle size={18} />
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-tag">LATE</span>
                    <span className="kpi-value-num num-late">{attKPIs.lateCount}</span>
                  </div>
                </div>

                {/* KPI 3: Absent */}
                <div className="att-kpi-card">
                  <div className="kpi-icon-box kpi-icon-absent">
                    <UserX size={18} />
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-tag">ABSENT</span>
                    <span className="kpi-value-num num-absent">{attKPIs.absentCount}</span>
                  </div>
                </div>

                {/* KPI 4: Attendance Rate */}
                <div className="att-kpi-card">
                  <div className="kpi-icon-box kpi-icon-rate">
                    <TrendingUp size={18} />
                  </div>
                  <div className="kpi-content">
                    <span className="kpi-tag">ATTENDANCE RATE</span>
                    <span className="kpi-value-num num-rate">{attKPIs.presentRate}%</span>
                  </div>
                </div>
              </div>

              {/* Search & Department Filter Bar */}
              <div className="att-search-filter-bar">
                <div className="att-search-input-box">
                  <Search size={15} style={{ opacity: 0.6 }} />
                  <input
                    type="text"
                    placeholder="Search by name, staff/student code, or remarks..."
                    value={attendanceSearchQuery}
                    onChange={(e) => { setAttendanceSearchQuery(e.target.value); setAttendanceCurrentPage(1); }}
                    className="att-search-input"
                  />
                  {attendanceSearchQuery && (
                    <button type="button" onClick={() => setAttendanceSearchQuery('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="att-dept-filter-box">
                  <Filter size={14} style={{ opacity: 0.6 }} />
                  <select
                    value={attendanceDeptFilter}
                    onChange={(e) => { setAttendanceDeptFilter(e.target.value); setAttendanceCurrentPage(1); }}
                    className="att-dept-dropdown"
                  >
                    <option value="">All Departments & Disciplines</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    {courses.map(c => (
                      <option key={`c-${c.id}`} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Attendance Table Card */}
              <div className="natdemy-table-card">
                <div className="table-wrapper-dark" style={{ overflowX: 'auto' }}>
                  <table className="enterprise-table natdemy-att-table">
                    <thead>
                      <tr>
                        <th>EMPLOYEE / STUDENT</th>
                        <th>CODE</th>
                        <th>BRANCH / DEPT</th>
                        <th>TYPE</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>CHECK IN</th>
                        <th>CHECK OUT</th>
                        <th>TOTAL IN TIME</th>
                        <th>BREAK TIME</th>
                        <th>TOTAL WORKING TIME</th>
                        <th>PUNCH FLAGS</th>
                        <th>REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(groupedAttByDate).length > 0 ? (
                        Object.keys(groupedAttByDate).map((dateKey) => (
                          <React.Fragment key={dateKey}>
                            {/* Centered Floating Date Divider Badge */}
                            <tr className="date-group-divider-row">
                              <td colSpan={13}>
                                <div className="date-floating-pill">
                                  <CalendarDays size={13} style={{ opacity: 0.85 }} />
                                  <span>{formatDateDivider(dateKey)}</span>
                                </div>
                              </td>
                            </tr>

                            {/* Attendance Records for this Date */}
                            {groupedAttByDate[dateKey].map((row, idx) => {
                              const displayName = row.staff_name || row.student_name || 'Member';
                              const displayCode = row.staff_code || row.student_code || row.staff_id || row.student_id || `ID-${row.id}`;
                              const displayBranch = row.branch_name || row.department_name || row.course_name || 'DOJO HQ';
                              const statusLower = (row.status || 'present').toLowerCase().replace(/\s+/g, '-');
                              const flagLower = (row.flag || 'on-time').toLowerCase().replace(/\s+/g, '-');

                              return (
                                <tr key={`${dateKey}-${row.id || idx}`} className="natdemy-att-row">
                                  {/* 1. Employee / Student */}
                                  <td>
                                    <div className="employee-cell">
                                      <div className="avatar-mini-natdemy">
                                        {displayName.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="emp-fullname-natdemy">{displayName}</span>
                                    </div>
                                  </td>

                                  {/* 2. Code */}
                                  <td>
                                    <span className="code-pill mono-code">{displayCode}</span>
                                  </td>

                                  {/* 3. Branch / Dept */}
                                  <td>
                                    <span className="branch-tag">{displayBranch.toUpperCase()}</span>
                                  </td>

                                  {/* 4. Type */}
                                  <td>
                                    <span className="att-type-badge">
                                      {row.attendance_type || (role === 'student' ? 'Dojo Class' : 'Biometric')}
                                    </span>
                                  </td>

                                  {/* 5. Date */}
                                  <td style={{ fontSize: '0.82rem', fontFamily: 'monospace', opacity: 0.9 }}>
                                    {row.date}
                                  </td>

                                  {/* 6. Status */}
                                  <td>
                                    <span className={`natdemy-status-pill status-${statusLower}`}>
                                      <span className="status-dot"></span>
                                      {row.status?.toUpperCase() || 'PRESENT'}
                                    </span>
                                  </td>

                                  {/* 7. Check In */}
                                  <td className="time-in-cell">
                                    {row.check_in || '09:00:00 AM'}
                                  </td>

                                  {/* 8. Check Out */}
                                  <td className="time-out-cell">
                                    {row.check_out || '05:00:00 PM'}
                                  </td>

                                  {/* 9. Total In Time */}
                                  <td className="time-total-cell">
                                    {row.total_in_time || row.training_time || '8h 0m'}
                                  </td>

                                  {/* 10. Break Time */}
                                  <td className="break-time-cell">
                                    {row.break_time || '45 min (1:15 PM - 2:00 PM)'}
                                  </td>

                                  {/* 11. Total Working Time */}
                                  <td className="work-time-cell">
                                    {row.total_working_time || row.training_time || '7h 15m'}
                                  </td>

                                  {/* 12. Punch Flags */}
                                  <td>
                                    <span className={`flag-badge flag-${flagLower}`}>
                                      {row.flag || 'On Time'}
                                    </span>
                                  </td>

                                  {/* 13. Remarks */}
                                  <td className="remarks-cell">
                                    {row.remarks || 'Machine punch IN (fp) at 09:04 AM; Machine punch OUT (fp) at 05:06 PM'}
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={13} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94A3B8' }}>
                            <div style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
                              <Clock size={32} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
                              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'inherit' }}>No Attendance Records Found</h4>
                              <p style={{ fontSize: '0.83rem', opacity: 0.7, margin: '0 0 1rem 0' }}>
                                No roll-call history found for the selected time horizon or search filter.
                              </p>
                              {role !== 'student' && (
                                <button
                                  type="button"
                                  onClick={() => setShowManualMarkModal(true)}
                                  className="btn-primary-action"
                                  style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                >
                                  + Record Today's Roll-Call
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Center Button: Load Older Attendance (+7 Days) [Screenshot 2] */}
                <div className="load-older-btn-container">
                  <button 
                    type="button" 
                    onClick={handleLoadOlderDays} 
                    className="load-older-att-btn"
                  >
                    <ChevronDown size={15} />
                    <span>Load Older Attendance (+7 Days)</span>
                  </button>
                </div>

                {/* Pagination Controls Bar */}
                <div className="attendance-pagination-bar">
                  <div className="pagination-info">
                    Showing <strong>{totalAttEntries > 0 ? startAttIndex + 1 : 0}</strong> to <strong>{endAttIndex}</strong> of <strong>{totalAttEntries}</strong> entries
                  </div>

                  <div className="pagination-page-controls">
                    <button
                      type="button"
                      disabled={safeAttPage <= 1}
                      onClick={() => setAttendanceCurrentPage(prev => Math.max(1, prev - 1))}
                      className="pagination-btn"
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>

                    {pageNumbers.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAttendanceCurrentPage(p)}
                        className={`pagination-num-btn ${safeAttPage === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={safeAttPage >= totalAttPages}
                      onClick={() => setAttendanceCurrentPage(prev => Math.min(totalAttPages, prev + 1))}
                      className="pagination-btn"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="pagination-pagesize-selector">
                    <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>Rows per page:</span>
                    {[7, 10, 25].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => { setAttendancePageSize(sz); setAttendanceCurrentPage(1); }}
                        className={`pagesize-btn ${attendancePageSize === sz ? 'active' : ''}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
              </div>

              {/* MODAL: Record Manual Roll-Call Attendance */}
              {showManualMarkModal && (
                <div className="modal-backdrop-dark" onClick={() => setShowManualMarkModal(false)}>
                  <div className="modal-card-dark" style={{ maxWidth: '820px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header-dark">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Calendar size={18} style={{ color: '#3B82F6' }} />
                        <h3 style={{ margin: 0 }}>RECORD MANUAL ROLL-CALL ATTENDANCE</h3>
                      </div>
                      <button type="button" onClick={() => setShowManualMarkModal(false)} className="close-btn-dark">
                        <X size={18} />
                      </button>
                    </div>

                    <div style={{ padding: '1.25rem 1.5rem' }}>
                      {/* Controls inside modal */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Roll-Call Date:</label>
                          <input
                            type="date"
                            value={modalMarkDate}
                            onChange={(e) => setModalMarkDate(e.target.value)}
                            className="control-date-input"
                          />
                        </div>

                        {role === 'admin' && (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => setMarkModalTarget('staff')}
                              className={`sub-tab-pill ${markModalTarget === 'staff' ? 'active' : ''}`}
                            >
                              Staff Roll-Call ({nonAdminStaff.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setMarkModalTarget('student')}
                              className={`sub-tab-pill ${markModalTarget === 'student' ? 'active' : ''}`}
                            >
                              Student Roll-Call ({students.length})
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (markModalTarget === 'staff') markAllStaffPresent();
                            else markAllStudentsPresent();
                          }}
                          className="btn-cancel-dark"
                          style={{ border: '1px solid #10B981', color: '#10B981', padding: '5px 12px', fontSize: '0.8rem' }}
                        >
                          ✓ Mark All Present
                        </button>
                      </div>

                      {/* Modal Table for Roll-Call Marking */}
                      <div className="table-wrapper-dark" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className="enterprise-table">
                          <thead>
                            <tr>
                              <th>NAME</th>
                              <th>CODE</th>
                              <th>BRANCH / DEPT</th>
                              <th style={{ textAlign: 'center' }}>STATUS</th>
                              <th>REMARKS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {markModalTarget === 'staff' ? (
                              nonAdminStaff.map(stf => {
                                const currentStatus = staffAttendanceMarks[stf.id] || 'Present';
                                return (
                                  <tr key={stf.id}>
                                    <td style={{ fontWeight: 700 }}>{stf.full_name}</td>
                                    <td><span className="code-pill mono-code">{stf.staff_id}</span></td>
                                    <td><span className="branch-tag">{stf.department_name || 'Dojo Operations'}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                      <div style={{ display: 'inline-flex', gap: '0.3rem', justifyContent: 'center' }}>
                                        {['Present', 'Absent', 'Late', 'Leave'].map(stat => (
                                          <button
                                            key={stat}
                                            type="button"
                                            onClick={() => handleQuickStaffStatusChange(stf.id, stat)}
                                            className={`att-choice-btn ${currentStatus === stat ? `selected-${stat.toLowerCase()}` : ''}`}
                                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                          >
                                            {stat}
                                          </button>
                                        ))}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Note..."
                                        value={staffAttendanceRemarks[stf.id] || ''}
                                        onChange={(e) => setStaffAttendanceRemarks({ ...staffAttendanceRemarks, [stf.id]: e.target.value })}
                                        style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)' }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              students.map(st => {
                                const currentStatus = studentAttendanceMarks[st.id] || 'Present';
                                return (
                                  <tr key={st.id}>
                                    <td style={{ fontWeight: 700 }}>{st.full_name}</td>
                                    <td><span className="code-pill mono-code">{st.student_id}</span></td>
                                    <td><span className="branch-tag">{st.course_name || 'Martial Arts'}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                      <div style={{ display: 'inline-flex', gap: '0.3rem', justifyContent: 'center' }}>
                                        {['Present', 'Absent', 'Late', 'Excused'].map(stat => (
                                          <button
                                            key={stat}
                                            type="button"
                                            onClick={() => setStudentAttendanceMarks({ ...studentAttendanceMarks, [st.id]: stat })}
                                            className={`att-choice-btn ${currentStatus === stat ? `selected-${stat.toLowerCase()}` : ''}`}
                                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                          >
                                            {stat}
                                          </button>
                                        ))}
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Note..."
                                        value={studentAttendanceRemarks[st.id] || ''}
                                        onChange={(e) => setStudentAttendanceRemarks({ ...studentAttendanceRemarks, [st.id]: e.target.value })}
                                        style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)' }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Modal Footer */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => setShowManualMarkModal(false)}
                          className="btn-cancel-dark"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (markModalTarget === 'staff') {
                              await submitStaffAttendance(modalMarkDate);
                            } else {
                              await submitStudentAttendance(modalMarkDate);
                            }
                            await fetchAttendanceLedger(attendanceRangeDays);
                            setShowManualMarkModal(false);
                          }}
                          className="btn-primary-action"
                        >
                          <CheckSquare size={15} /> Save & Submit Roll-Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

              {/* =====================================================================
            VIEW 6: ADMISSIONS PIPELINE
            ===================================================================== */}
              {activeView === 'enquiries' && (
                <div className="sub-view-container">
                  <div className="view-header-row">
                    <div>
                      <h2>ADMISSION ENQUIRIES PIPELINE</h2>
                      <p>Track incoming prospective student applications, update statuses, and auto-enroll.</p>
                    </div>
                  </div>

                  <div className="table-search-row">
                    <div className="sub-filter-row" style={{ margin: 0 }}>
                      {['All', 'New', 'In Review', 'Contacted', 'Enrolled', 'Rejected'].map((st) => (
                        <button
                          key={st}
                          onClick={() => { setEnquiryStatusFilter(st); getERPEnquiries(st, enquirySearch).then(setEnquiries); }}
                          className={`sub-tab-pill ${enquiryStatusFilter === st ? 'active' : ''}`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="search-field-dark">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search applicant name or email..."
                        value={enquirySearch}
                        onChange={(e) => {
                          setEnquirySearch(e.target.value);
                          getERPEnquiries(enquiryStatusFilter, e.target.value).then(setEnquiries);
                        }}
                      />
                    </div>
                  </div>

                  <div className="table-wrapper-dark">
                    <table className="enterprise-table">
                      <thead>
                        <tr>
                          <th>STUDENT NAME</th>
                          <th>AGE</th>
                          <th>GUARDIAN</th>
                          <th>PHONE / WHATSAPP</th>
                          <th>DESIRED PROGRAM</th>
                          <th>PREFERRED BATCH</th>
                          <th>STATUS</th>
                          <th>PIPELINE ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map((enq) => (
                          <tr key={enq.id}>
                            <td>
                              <div style={{ fontWeight: 800 }}>{enq.student_name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{enq.email}</div>
                            </td>
                            <td>{enq.student_age} yrs</td>
                            <td>{enq.guardian_name || 'Self'}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>{enq.phone}</span>
                                <a
                                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: '#25D366' }}
                                >
                                  <MessageCircle size={15} />
                                </a>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600 }}>{enq.course_title || 'General'}</span>
                            </td>
                            <td>{enq.preferred_batch || 'Open Enrollment'}</td>
                            <td>
                              <span className={`pipeline-badge status-${enq.enquiry_status?.toLowerCase().replace(' ', '-')}`}>
                                {enq.enquiry_status}
                              </span>
                            </td>
                            <td>
                              <select
                                value={enq.enquiry_status}
                                disabled={updatingId === enq.id}
                                onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                                className="status-dropdown-dark"
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Enrolled">Enrolled (Auto-Create Member)</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =====================================================================
            VIEW 7: COURSES & SYLLABI
            ===================================================================== */}
              {activeView === 'courses' && (
                <div className="sub-view-container">
                  <div className="view-header-row">
                    <div>
                      <h2>MARTIAL ARTS DISCIPLINES & SYLLABI</h2>
                      <p>Curriculum guidelines, rank requirements, monthly dues, and enrolled students.</p>
                    </div>
                  </div>

                  <div className="courses-grid-dark">
                    {courses.map((c) => (
                      <div key={c.id} className="course-card-dark">
                        <div className="course-card-image">
                          <img src={c.image_url || 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed'} alt={c.title} />
                          <span className="fee-badge-dark">${parseFloat(c.monthly_fee).toFixed(2)}/mo</span>
                        </div>
                        <div className="course-card-body">
                          <h3>{c.title}</h3>
                          <p>{c.short_description}</p>
                          <div className="course-specs-list">
                            <div><span>Target Age:</span> <strong>{c.age_group}</strong></div>
                            <div><span>Duration:</span> <strong>{c.duration}</strong></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
          MODAL: CREATE DEPARTMENT
          ========================================================================= */}
            {showAddDeptModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowAddDeptModal(false)}>
                <div className="modal-card-dark" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <h3>CREATE NEW DEPARTMENT</h3>
                    <button onClick={() => setShowAddDeptModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleCreateDepartment}>
                    <div className="form-group-dark">
                      <label>Department Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Traditional Karate & Kobudo"
                        value={newDept.name}
                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group-dark">
                      <label>Department Code (Unique Short Key) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KARATE, BJJ, KICKBOX"
                        value={newDept.code}
                        onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div className="form-group-dark">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        placeholder="Purpose of this martial arts department..."
                        value={newDept.description}
                        onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                      />
                    </div>
                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowAddDeptModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Create Department</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          MODAL: ADD STAFF MEMBER & CREDENTIALS
          ========================================================================= */}
            {showAddStaffModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowAddStaffModal(false)}>
                <div className="modal-card-dark wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <h3>ADD STAFF / SENSEI & CREDENTIALS</h3>
                    <button onClick={() => setShowAddStaffModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleCreateStaff}>
                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Master David Kim"
                          value={newStaff.full_name}
                          onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Staff ID (Login Handle)</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label style={{ margin: 0 }}>Staff ID (Login Handle) *</label>
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                            ✓ Auto-Generated Sequence
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Auto (e.g. STF-004)"
                          value={newStaff.staff_id}
                          onChange={(e) => setNewStaff({ ...newStaff, staff_id: e.target.value.toUpperCase() })}
                          style={{ fontWeight: 700, letterSpacing: '0.04em' }}
                        />
                        <small className="help-text-muted" style={{ display: 'block', marginTop: '4px' }}>
                          Auto-generated from database sequence. Can be customized if needed.
                        </small>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Email Address (Login Handle) *</label>
                        <input
                          type="email"
                          required
                          placeholder="david.kim@warriormartialarts.com"
                          value={newStaff.email}
                          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Contact Phone *</label>
                        <input
                          type="text"
                          required
                          placeholder="+1 (555) 789-0123"
                          value={newStaff.phone}
                          onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Department *</label>
                        <select
                          value={newStaff.department}
                          onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                          required
                        >
                          <option value="">Select Department...</option>
                          {departments.length === 0 && <option value="">Select Department...</option>}
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Designation *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Senior Judo Sensei"
                          value={newStaff.designation}
                          onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Role Access Level</label>
                        <select
                          value={newStaff.role_type}
                          onChange={(e) => setNewStaff({ ...newStaff, role_type: e.target.value })}
                        >
                          <option value="instructor">Sensei / Instructor</option>
                          <option value="admin">Administrator / Manager</option>
                          <option value="staff">Support Staff / Front Desk</option>
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Monthly Salary ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newStaff.salary}
                          onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group-dark">
                      <label>Initial Login Password *</label>
                      <input
                        type="text"
                        required
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                        style={{ fontFamily: 'monospace' }}
                      />
                      <small className="help-text-muted">Staff member can immediately sign in using either their Staff ID or Email with this password.</small>
                    </div>

                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowAddStaffModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Create Staff Member</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          MODAL: REGISTER STUDENT MEMBER & CREDENTIALS
          ========================================================================= */}
            {showAddStudentModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowAddStudentModal(false)}>
                <div className="modal-card-dark wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <h3>REGISTER STUDENT & ASSIGN CREDENTIALS</h3>
                    <button onClick={() => setShowAddStudentModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleCreateStudent}>
                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Student Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Leo Sanders"
                          value={newStudent.full_name}
                          onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Student ID (Login Handle)</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label style={{ margin: 0 }}>Student ID (Login Handle) *</label>
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                            ✓ Auto-Generated Sequence
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Auto (e.g. STU-1004)"
                          value={newStudent.student_id}
                          onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value.toUpperCase() })}
                          style={{ fontWeight: 700, letterSpacing: '0.04em' }}
                        />
                        <small className="help-text-muted" style={{ display: 'block', marginTop: '4px' }}>
                          Auto-generated from database sequence. Can be customized if needed.
                        </small>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Student / Guardian Email (Login Handle) *</label>
                        <input
                          type="email"
                          required
                          placeholder="leo.sanders@example.com"
                          value={newStudent.email}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Contact Phone *</label>
                        <input
                          type="text"
                          required
                          placeholder="+1 (555) 234-5678"
                          value={newStudent.phone}
                          onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Department *</label>
                        <select
                          value={newStudent.department}
                          onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                          required
                        >
                          <option value="">Select Department...</option>
                          {departments.length === 0 && <option value="">Select Department...</option>}
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Discipline / Course *</label>
                        <select
                          value={newStudent.course}
                          onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                          required
                        >
                          <option value="">Select Course...</option>
                          {courses.length === 0 && <option value="">Select Course...</option>}
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Current Belt Rank</label>
                        <select
                          value={newStudent.current_belt}
                          onChange={(e) => setNewStudent({ ...newStudent, current_belt: e.target.value })}
                        >
                          {['White Belt', 'Yellow Belt', 'Orange Belt', 'Green Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt (1st Dan)', 'Black Belt (2nd Dan+)'].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Fee Status</label>
                        <select
                          value={newStudent.fee_status}
                          onChange={(e) => setNewStudent({ ...newStudent, fee_status: e.target.value })}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Due">Due</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-dark">
                      <label>Initial Login Password *</label>
                      <input
                        type="text"
                        required
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                        style={{ fontFamily: 'monospace' }}
                      />
                      <small className="help-text-muted">Student can immediately sign in using either their Student ID or Email with this password.</small>
                    </div>

                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowAddStudentModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Enroll Student</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          MODAL: MANAGE CREDENTIALS
          ========================================================================= */}
            {showCredentialModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowCredentialModal(false)}>
                <div className="modal-card-dark" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Key size={18} color="#EF4444" />
                      <h3>MANAGE CREDENTIALS</h3>
                    </div>
                    <button onClick={() => setShowCredentialModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>

                  <div className="credential-summary-box">
                    <div>User: <strong>{credentialTarget.name}</strong></div>
                    <div>Login ID: <strong style={{ color: '#EF4444', fontFamily: 'monospace' }}>{credentialTarget.identifier}</strong></div>
                    <div>Email: <strong>{credentialTarget.email}</strong></div>
                  </div>

                  <form onSubmit={handleUpdateCredentials}>
                    <div className="form-group-dark">
                      <label>Username (Alternative Login)</label>
                      <input
                        type="text"
                        value={credentialTarget.username}
                        onChange={(e) => setCredentialTarget({ ...credentialTarget, username: e.target.value })}
                      />
                    </div>

                    <div className="form-group-dark">
                      <label>Set New Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPasswordInModal ? 'text' : 'password'}
                          required
                          placeholder="Enter new password"
                          value={credentialTarget.password}
                          onChange={(e) => setCredentialTarget({ ...credentialTarget, password: e.target.value })}
                          style={{ paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                          className="password-peek-btn"
                        >
                          {showPasswordInModal ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {credentialTarget.type === 'staff' && (
                      <div className="form-group-dark">
                        <label>Role Access Level</label>
                        <select
                          value={credentialTarget.role_type}
                          onChange={(e) => setCredentialTarget({ ...credentialTarget, role_type: e.target.value })}
                        >
                          <option value="instructor">Sensei / Instructor</option>
                          <option value="admin">Administrator / Manager</option>
                          <option value="staff">Support Staff / Front Desk</option>
                        </select>
                      </div>
                    )}

                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowCredentialModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Update Credentials</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          MODAL: EDIT STAFF / SENSEI MEMBER
          ========================================================================= */}
            {showEditStaffModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowEditStaffModal(false)}>
                <div className="modal-card-dark wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Edit size={18} color="#DC2626" />
                      <h3>EDIT STAFF / SENSEI MEMBER</h3>
                    </div>
                    <button onClick={() => setShowEditStaffModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>

                  <form onSubmit={handleUpdateStaff}>
                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          value={editingStaff.full_name}
                          onChange={(e) => setEditingStaff({ ...editingStaff, full_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Staff ID (System ID)</label>
                        <input
                          type="text"
                          disabled
                          value={editingStaff.staff_id}
                          style={{ opacity: 0.75, fontFamily: 'monospace', cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Email Address (Login) *</label>
                        <input
                          type="email"
                          required
                          value={editingStaff.email}
                          onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={editingStaff.phone}
                          onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Department</label>
                        <select
                          value={editingStaff.department}
                          onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                        >
                          <option value="">-- Select Department --</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Designation / Title *</label>
                        <input
                          type="text"
                          required
                          value={editingStaff.designation}
                          onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Role Access Level</label>
                        <select
                          value={editingStaff.role_type}
                          onChange={(e) => setEditingStaff({ ...editingStaff, role_type: e.target.value })}
                        >
                          <option value="instructor">Sensei / Instructor</option>
                          <option value="admin">Administrator / Manager</option>
                          <option value="staff">Support Staff / Front Desk</option>
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Monthly Salary ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingStaff.salary}
                          onChange={(e) => setEditingStaff({ ...editingStaff, salary: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group-dark">
                      <label>Active Status</label>
                      <select
                        value={editingStaff.is_active ? 'true' : 'false'}
                        onChange={(e) => setEditingStaff({ ...editingStaff, is_active: e.target.value === 'true' })}
                      >
                        <option value="true">Active Staff Member</option>
                        <option value="false">Inactive / On Leave</option>
                      </select>
                    </div>

                    <div className="form-group-dark">
                      <label>Administrative Notes</label>
                      <textarea
                        rows={2}
                        value={editingStaff.notes}
                        onChange={(e) => setEditingStaff({ ...editingStaff, notes: e.target.value })}
                        placeholder="Certifications, martial arts achievements, emergency details..."
                      />
                    </div>

                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowEditStaffModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          MODAL: EDIT STUDENT MEMBER
          ========================================================================= */}
            {showEditStudentModal && (
              <div className="modal-backdrop-dark" onClick={() => setShowEditStudentModal(false)}>
                <div className="modal-card-dark wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-dark">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Edit size={18} color="#DC2626" />
                      <h3>EDIT STUDENT MEMBER</h3>
                    </div>
                    <button onClick={() => setShowEditStudentModal(false)} className="close-btn-dark"><X size={18} /></button>
                  </div>

                  <form onSubmit={handleUpdateStudent}>
                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Student Full Name *</label>
                        <input
                          type="text"
                          required
                          value={editingStudent.full_name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Student ID (Assigned)</label>
                        <input
                          type="text"
                          disabled
                          value={editingStudent.student_id}
                          style={{ opacity: 0.75, fontFamily: 'monospace', cursor: 'not-allowed' }}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Email Address (Login) *</label>
                        <input
                          type="email"
                          required
                          value={editingStudent.email}
                          onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Phone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          value={editingStudent.phone}
                          onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Guardian Name (Optional)</label>
                        <input
                          type="text"
                          value={editingStudent.guardian_name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, guardian_name: e.target.value })}
                          placeholder="Parent / Emergency contact"
                        />
                      </div>
                      <div className="form-group-dark">
                        <label>Department</label>
                        <select
                          value={editingStudent.department}
                          onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                        >
                          <option value="">-- Select Department --</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Martial Arts Discipline</label>
                        <select
                          value={editingStudent.course}
                          onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                        >
                          <option value="">-- Select Discipline --</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Assigned Training Batch</label>
                        <select
                          value={editingStudent.batch}
                          onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                        >
                          <option value="">-- Select Schedule Batch --</option>
                          {schedules.map((s) => (
                            <option key={s.id} value={s.id}>{s.batch_name} ({s.training_day})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-dark">
                        <label>Current Belt Rank</label>
                        <select
                          value={editingStudent.current_belt}
                          onChange={(e) => setEditingStudent({ ...editingStudent, current_belt: e.target.value })}
                        >
                          {['White Belt', 'Yellow Belt', 'Orange Belt', 'Green Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt (1st Dan)', 'Black Belt (2nd Dan+)'].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-dark">
                        <label>Fee Status</label>
                        <select
                          value={editingStudent.fee_status}
                          onChange={(e) => setEditingStudent({ ...editingStudent, fee_status: e.target.value })}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Due">Due</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-dark">
                      <label>Active Membership Status</label>
                      <select
                        value={editingStudent.is_active ? 'true' : 'false'}
                        onChange={(e) => setEditingStudent({ ...editingStudent, is_active: e.target.value === 'true' })}
                      >
                        <option value="true">Active Enrolled Student</option>
                        <option value="false">Inactive / Suspended</option>
                      </select>
                    </div>

                    <div className="form-group-dark">
                      <label>Student Notes</label>
                      <textarea
                        rows={2}
                        value={editingStudent.notes}
                        onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                        placeholder="Medical notes, prior experience, grading eligibility..."
                      />
                    </div>

                    <div className="modal-footer-dark">
                      <button type="button" onClick={() => setShowEditStudentModal(false)} className="btn-cancel-dark">Cancel</button>
                      <button type="submit" className="btn-submit-dark">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* =========================================================================
          EMBEDDED HIGH-PERFORMANCE ENTERPRISE ERP CSS THEME (LIGHT & DARK DUAL ENGINE)
          ========================================================================= */}
            <style>{`
        /* Root ERP Layout */
        .erp-enterprise-root {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        /* -------------------------------------------------------------
           THEME ENGINE: LIGHT THEME (DEFAULT)
           ------------------------------------------------------------- */
        .erp-enterprise-root.theme-light {
          background-color: #F8FAFC;
          color: #0F172A;
        }

        .theme-light .erp-main-area { background-color: #F8FAFC; }
        .theme-light .erp-sidebar { background-color: #FFFFFF; border-right: 1px solid #E2E8F0; }
        .theme-light .sidebar-brand { border-bottom: 1px solid #E2E8F0; }
        .theme-light .brand-title { color: #0F172A; }
        .theme-light .brand-subtitle { color: #64748B; }
        .theme-light .sidebar-collapse-toggle { background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; }
        .theme-light .sidebar-collapse-toggle:hover { background: #E2E8F0; color: #0F172A; }
        .theme-light .sidebar-search-box { background: #F8FAFC; border: 1px solid #E2E8F0; }
        .theme-light .sidebar-search-input { color: #0F172A; }
        .theme-light .sidebar-search-input::placeholder { color: #94A3B8; }
        .theme-light .search-kbd { background: #E2E8F0; border: 1px solid #CBD5E1; color: #475569; }
        .theme-light .nav-section-label { color: #64748B; }
        .theme-light .nav-item { color: #475569; }
        .theme-light .nav-item:hover { background-color: #F1F5F9; color: #0F172A; }
        .theme-light .nav-item.active { background-color: #FEF2F2; color: #DC2626; border-left: 3px solid #DC2626; font-weight: 700; }
        .theme-light .nav-badge.count { background: #E2E8F0; color: #334155; }
        .theme-light .nav-badge.live { background: #DCFCE7; color: #15803D; }
        .theme-light .nav-badge.alert { background: #FEE2E2; color: #B91C1C; }
        .theme-light .sidebar-footer { border-top: 1px solid #E2E8F0; }
        .theme-light .sidebar-logout-btn { border: 1px solid #FECACA; color: #DC2626; background: #FFF5F5; }
        .theme-light .sidebar-logout-btn:hover { background: #FEE2E2; }

        .theme-light .erp-topbar { background-color: #FFFFFF; border-bottom: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
        .theme-light .notification-pill { background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; }
        .theme-light .theme-mode-toggle-btn { background: #F1F5F9; border: 1px solid #CBD5E1; color: #334155; }
        .theme-light .theme-mode-toggle-btn:hover { background: #E2E8F0; color: #0F172A; }
        .theme-light .punch-status-pill.punched-in { background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; }
        .theme-light .punch-status-pill.punched-out { background-color: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
        .theme-light .user-fullname { color: #0F172A; }
        .theme-light .user-sub { color: #64748B; }

        .theme-light .greeting-text h1 { color: #0F172A; }
        .theme-light .greeting-text p { color: #64748B; }
        .theme-light .date-display-pill { background: #FFFFFF; border: 1px solid #CBD5E1; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .theme-light .filter-select { background: #FFFFFF; border: 1px solid #CBD5E1; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .theme-light .refresh-btn { background: #FFFFFF; border: 1px solid #CBD5E1; color: #64748B; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .theme-light .refresh-btn:hover { color: #0F172A; border-color: #94A3B8; }

        .theme-light .kpi-metric-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }
        .theme-light .card-kpi-title { color: #64748B; }
        .theme-light .card-main-stat { color: #0F172A; }
        .theme-light .dots-indicator { color: #CBD5E1; }
        .theme-light .info-rate { color: #64748B; }
        .theme-light .card-badges-row { border-top: 1px solid #F1F5F9; }
        .theme-light .status-sub-pill { color: #64748B; }
        .theme-light .status-text-muted { color: #94A3B8; }
        .theme-light .card-link-action { color: #0284C7; }
        .theme-light .card-link-action.amber { color: #D97706; }

        .theme-light .panel-box {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }
        .theme-light .panel-title-with-icon h3 { color: #0F172A; }
        .theme-light .panel-subtitle { color: #64748B; }
        .theme-light .control-btn { background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; }
        .theme-light .control-btn.active { background: #0F172A; border-color: #0F172A; color: #FFFFFF; }
        .theme-light .control-date-input { background: #F8FAFC; border: 1px solid #CBD5E1; color: #0F172A; }
        .theme-light .control-btn-green { background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; }
        .theme-light .sub-tab-pill { background: #F1F5F9; border: 1px solid #E2E8F0; color: #64748B; }
        .theme-light .sub-tab-pill.active { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }

        .theme-light .table-wrapper-dark { background: #FFFFFF; border: 1px solid #E2E8F0; }
        .theme-light .enterprise-table th { background: #F8FAFC; color: #475569; border-bottom: 1px solid #E2E8F0; }
        .theme-light .enterprise-table td { border-bottom: 1px solid #F1F5F9; color: #334155; }
        .theme-light .enterprise-table tr:hover td { background-color: #F8FAFC; }
        .theme-light .emp-name { color: #0F172A; }
        .theme-light .emp-id { color: #64748B; }
        .theme-light .punch-time-cell { color: #475569; }
        .theme-light .branch-tag { background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; }
        .theme-light .status-badge-green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

        .theme-light .link-all { color: #0284C7; }
        .theme-light .deliverable-item-card { background: #F8FAFC; border: 1px solid #E2E8F0; }
        .theme-light .deliverable-info h4 { color: #0F172A; }
        .theme-light .deliverable-meta { color: #64748B; }
        .theme-light .deliverable-status-tag { background: #EDE9FE; color: #6D28D9; border: 1px solid #DDD6FE; }
        .theme-light .new-initiation-btn { background: #F8FAFC; border: 1px dashed #CBD5E1; color: #475569; }
        .theme-light .new-initiation-btn:hover { background: #F1F5F9; color: #0F172A; border-color: #3B82F6; }

        .theme-light .task-feed-item { background: #F8FAFC; border: 1px solid #E2E8F0; }
        .theme-light .task-title-text { color: #0F172A; }
        .theme-light .task-dept-badge { color: #64748B; }

        /* Light Quick Tiles */
        .theme-light .tile-blue { background: #EFF6FF; border: 1px solid #BFDBFE; }
        .theme-light .tile-blue h4 { color: #1E3A8A; }
        .theme-light .tile-blue p { color: #3B82F6; }
        .theme-light .tile-blue svg { color: #2563EB; }

        .theme-light .tile-teal { background: #F0FDF4; border: 1px solid #BBF7D0; }
        .theme-light .tile-teal h4 { color: #14532D; }
        .theme-light .tile-teal p { color: #16A34A; }
        .theme-light .tile-teal svg { color: #059669; }

        .theme-light .tile-amber { background: #FFFBEB; border: 1px solid #FDE68A; }
        .theme-light .tile-amber h4 { color: #78350F; }
        .theme-light .tile-amber p { color: #D97706; }
        .theme-light .tile-amber svg { color: #D97706; }

        .theme-light .tile-cyan { background: #ECFEFF; border: 1px solid #A5F3FC; }
        .theme-light .tile-cyan h4 { color: #164E63; }
        .theme-light .tile-cyan p { color: #0891B2; }
        .theme-light .tile-cyan svg { color: #0284C7; }

        .theme-light .tile-purple { background: #FAF5FF; border: 1px solid #E9D5FF; }
        .theme-light .tile-purple h4 { color: #581C87; }
        .theme-light .tile-purple p { color: #7C3AED; }
        .theme-light .tile-purple svg { color: #7C3AED; }

        .theme-light .tile-skyblue { background: #F0F9FF; border: 1px solid #BAE6FD; }
        .theme-light .tile-skyblue h4 { color: #0C4A6E; }
        .theme-light .tile-skyblue p { color: #0284C7; }
        .theme-light .tile-skyblue svg { color: #0284C7; }

        .theme-light .tile-magenta { background: #FDF2F8; border: 1px solid #FBCFE8; }
        .theme-light .tile-magenta h4 { color: #831843; }
        .theme-light .tile-magenta p { color: #DB2777; }
        .theme-light .tile-magenta svg { color: #DB2777; }

        .theme-light .tile-slate { background: #F8FAFC; border: 1px solid #CBD5E1; }
        .theme-light .tile-slate h4 { color: #0F172A; }
        .theme-light .tile-slate p { color: #475569; }
        .theme-light .tile-slate svg { color: #475569; }

        /* Light Sub-Views & Modals */
        .theme-light .view-header-row h2 { color: #0F172A; }
        .theme-light .view-header-row p { color: #64748B; }
        .theme-light .search-field-dark { background: #FFFFFF; border: 1px solid #CBD5E1; }
        .theme-light .search-field-dark input { color: #0F172A; }
        .theme-light .search-field-dark input::placeholder { color: #94A3B8; }
        .theme-light .code-pill.staff { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
        .theme-light .code-pill.student { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
        .theme-light .belt-badge { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
        .theme-light .status-pill.paid { background: #ECFDF5; color: #059669; }
        .theme-light .status-pill.due { background: #FEF2F2; color: #DC2626; }
        .theme-light .btn-action-edit { background: #FEF3C7; border: 1px solid #FDE68A; color: #B45309; }
        .theme-light .btn-action-edit:hover { background: #FDE68A; }
        .theme-light .btn-action-key { background: #EFF6FF; border: 1px solid #BFDBFE; color: #2563EB; }
        .theme-light .btn-action-key:hover { background: #DBEAFE; }
        .theme-light .btn-action-delete { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
        .theme-light .btn-action-delete:hover { background: #FEE2E2; }
        .theme-light .status-badge-amber { background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }
        .theme-light .status-badge-gray { background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; }
        .theme-light .att-choice-btn { background: #F8FAFC; border: 1px solid #CBD5E1; color: #475569; }
        .theme-light .att-choice-btn.selected-present { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }
        .theme-light .att-choice-btn.selected-absent { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }
        .theme-light .att-choice-btn.selected-late { background: #FFFBEB; color: #B45309; border-color: #FDE68A; }
        .theme-light .att-choice-btn.selected-excused { background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE; }
        .theme-light .att-choice-btn.selected-half-day { background: #ECFEFF; color: #0891B2; border-color: #A5F3FC; }
        .theme-light .att-choice-btn.selected-leave { background: #F5F3FF; color: #7C3AED; border-color: #DDD6FE; }

        .theme-light .dept-card-dark { background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .theme-light .dept-card-dark h3 { color: #0F172A; }
        .theme-light .dept-card-dark p { color: #475569; }
        .theme-light .dept-code-tag { background: #F1F5F9; color: #475569; }
        .theme-light .dept-stats-row { background: #F8FAFC; border: 1px solid #E2E8F0; color: #64748B; }
        .theme-light .dept-stats-row strong { color: #0F172A; }

        .theme-light .course-card-dark { background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .theme-light .course-card-body h3 { color: #0F172A; }
        .theme-light .course-card-body p { color: #475569; }
        .theme-light .course-specs-list { border-top: 1px solid #E2E8F0; color: #64748B; }
        .theme-light .course-specs-list strong { color: #0F172A; }
        .theme-light .fee-badge-dark { background: rgba(255, 255, 255, 0.95); color: #059669; border: 1px solid #A7F3D0; }

        .theme-light .pipeline-badge.status-new { background: #EFF6FF; color: #1D4ED8; }
        .theme-light .pipeline-badge.status-in-review { background: #FFFBEB; color: #B45309; }
        .theme-light .pipeline-badge.status-contacted { background: #FAF5FF; color: #7C3AED; }
        .theme-light .pipeline-badge.status-enrolled { background: #ECFDF5; color: #059669; }
        .theme-light .pipeline-badge.status-rejected { background: #FEF2F2; color: #DC2626; }
        .theme-light .status-dropdown-dark { background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A; }

        .theme-light .modal-backdrop-dark { background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(6px); }
        .theme-light .modal-card-dark { background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 20px 45px rgba(0,0,0,0.12); color: #0F172A; }
        .theme-light .modal-header-dark h3 { color: #0F172A; }
        .theme-light .close-btn-dark { background: #F1F5F9; color: #64748B; }
        .theme-light .close-btn-dark:hover { background: #E2E8F0; color: #0F172A; }
        .theme-light .form-group-dark label { color: #334155; }
        .theme-light .form-group-dark input,
        .theme-light .form-group-dark select,
        .theme-light .form-group-dark textarea {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #0F172A;
        }
        .theme-light .credential-summary-box { background: #F8FAFC; border: 1px solid #E2E8F0; color: #334155; }
        .theme-light .btn-cancel-dark { border: 1px solid #CBD5E1; color: #475569; }
        .theme-light .btn-cancel-dark:hover { background: #F1F5F9; }

        /* -------------------------------------------------------------
           DARK THEME SPECIFIC OVERRIDES
           ------------------------------------------------------------- */
        .erp-enterprise-root.theme-dark {
          background-color: #0B0F19;
          color: #E2E8F0;
        }

        .theme-dark .erp-main-area { background-color: #0B0F19; }
        .theme-dark .erp-sidebar { background-color: #0E131F; border-right: 1px solid #1A2338; }
        .theme-dark .sidebar-brand { border-bottom: 1px solid #1A2338; }
        .theme-dark .brand-title { color: #FFFFFF; }
        .theme-dark .brand-subtitle { color: #94A3B8; }
        .theme-dark .sidebar-collapse-toggle { background: #182033; border: 1px solid #24304D; color: #94A3B8; }
        .theme-dark .sidebar-search-box { background: #141A2B; border: 1px solid #24304D; }
        .theme-dark .sidebar-search-input { color: #FFFFFF; }
        .theme-dark .search-kbd { background: #1E273E; border: 1px solid #2E3B5C; color: #94A3B8; }
        .theme-dark .nav-item { color: #94A3B8; }
        .theme-dark .nav-item:hover { background-color: #161D2E; color: #FFFFFF; }
        .theme-dark .nav-item.active { background-color: #1A2338; color: #FFFFFF; border-left: 3px solid #DC2626; }
        .theme-dark .nav-badge.count { background: #24304D; color: #E2E8F0; }
        .theme-dark .nav-badge.live { background: #064E3B; color: #34D399; }
        .theme-dark .nav-badge.alert { background: #7F1D1D; color: #F87171; }
        .theme-dark .sidebar-footer { border-top: 1px solid #1A2338; }
        .theme-dark .sidebar-logout-btn { border: 1px solid #24304D; color: #EF4444; background: transparent; }
        .theme-dark .sidebar-logout-btn:hover { background: rgba(239, 68, 68, 0.12); }

        .theme-dark .erp-topbar { background-color: #0E131F; border-bottom: 1px solid #1A2338; }
        .theme-dark .notification-pill { background: #141A2B; border: 1px solid #24304D; color: #94A3B8; }
        .theme-dark .theme-mode-toggle-btn { background: #141A2B; border: 1px solid #24304D; color: #CBD5E1; }
        .theme-dark .theme-mode-toggle-btn:hover { background: #1A2338; color: #FFFFFF; }
        .theme-dark .punch-status-pill.punched-in { background-color: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.4); color: #34D399; }
        .theme-dark .punch-status-pill.punched-out { background-color: rgba(239, 68, 68, 0.18); border: 1px solid rgba(239, 68, 68, 0.4); color: #F87171; }
        .theme-dark .user-fullname { color: #FFFFFF; }
        .theme-dark .user-sub { color: #94A3B8; }

        .theme-dark .greeting-text h1 { color: #FFFFFF; }
        .theme-dark .greeting-text p { color: #94A3B8; }
        .theme-dark .date-display-pill { background: #13192B; border: 1px solid #1F2942; color: #CBD5E1; }
        .theme-dark .filter-select { background: #13192B; border: 1px solid #1F2942; color: #CBD5E1; }
        .theme-dark .refresh-btn { background: #13192B; border: 1px solid #1F2942; color: #94A3B8; }
        .theme-dark .refresh-btn:hover { color: #FFFFFF; }

        .theme-dark .kpi-metric-card {
          background-color: #121829;
          border: 1px solid #1B243B;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        .theme-dark .card-kpi-title { color: #94A3B8; }
        .theme-dark .card-main-stat { color: #FFFFFF; }
        .theme-dark .dots-indicator { color: #64748B; }
        .theme-dark .info-rate { color: #94A3B8; }
        .theme-dark .card-badges-row { border-top: 1px solid #1B243B; }
        .theme-dark .status-sub-pill { color: #94A3B8; }
        .theme-dark .status-text-muted { color: #64748B; }
        .theme-dark .card-link-action { color: #38BDF8; }
        .theme-dark .card-link-action.amber { color: #F59E0B; }

        .theme-dark .panel-box {
          background-color: #121829;
          border: 1px solid #1B243B;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        .theme-dark .panel-title-with-icon h3 { color: #FFFFFF; }
        .theme-dark .panel-subtitle { color: #94A3B8; }
        .theme-dark .control-btn { background: #182035; border: 1px solid #24304D; color: #94A3B8; }
        .theme-dark .control-btn.active { background: #24304D; color: #FFFFFF; }
        .theme-dark .control-date-input { background: #182035; border: 1px solid #24304D; color: #FFFFFF; }
        .theme-dark .control-btn-green { background: #064E3B; border: 1px solid #059669; color: #6EE7B7; }
        .theme-dark .sub-tab-pill { background: #182035; border: 1px solid #24304D; color: #94A3B8; }
        .theme-dark .sub-tab-pill.active { background: #064E3B; color: #34D399; border-color: #059669; }

        .theme-dark .table-wrapper-dark { background: #0F1424; border: 1px solid #1A2338; }
        .theme-dark .enterprise-table th { background: #131A2D; color: #94A3B8; border-bottom: 1px solid #1E273E; }
        .theme-dark .enterprise-table td { border-bottom: 1px solid #161D2E; color: #CBD5E1; }
        .theme-dark .enterprise-table tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
        .theme-dark .emp-name { color: #FFFFFF; }
        .theme-dark .emp-id { color: #64748B; }
        .theme-dark .punch-time-cell { color: #94A3B8; }
        .theme-dark .branch-tag { background: #182035; color: #94A3B8; }
        .theme-dark .status-badge-green { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }

        .theme-dark .link-all { color: #38BDF8; }
        .theme-dark .deliverable-item-card { background: #141B2D; border: 1px solid #1E273E; }
        .theme-dark .deliverable-info h4 { color: #FFFFFF; }
        .theme-dark .deliverable-meta { color: #94A3B8; }
        .theme-dark .deliverable-status-tag { background: rgba(139, 92, 246, 0.15); color: #A78BFA; }
        .theme-dark .new-initiation-btn { background: #1A2338; border: 1px dashed #2E3B5C; color: #94A3B8; }
        .theme-dark .new-initiation-btn:hover { background: #24304D; color: #FFFFFF; border-color: #3B82F6; }

        .theme-dark .task-feed-item { background: #141B2D; border: 1px solid #1E273E; }
        .theme-dark .task-title-text { color: #E2E8F0; }
        .theme-dark .task-dept-badge { color: #64748B; }

        /* Dark Quick Tiles */
        .theme-dark .tile-blue { background: #121F38; border: 1px solid #1E3560; color: #93C5FD; }
        .theme-dark .tile-teal { background: #0E292A; border: 1px solid #174849; color: #5EEAD4; }
        .theme-dark .tile-amber { background: #2D2214; border: 1px solid #4C371D; color: #FCD34D; }
        .theme-dark .tile-cyan { background: #102B3B; border: 1px solid #194660; color: #7DD3FC; }
        .theme-dark .tile-purple { background: #231B3D; border: 1px solid #382A61; color: #C4B5FD; }
        .theme-dark .tile-skyblue { background: #12283C; border: 1px solid #1E4263; color: #67E8F9; }
        .theme-dark .tile-magenta { background: #2D142A; border: 1px solid #4C1D47; color: #F472B6; }
        .theme-dark .tile-slate { background: #171E2B; border: 1px solid #273449; color: #94A3B8; }
        .theme-dark .quick-tile h4 { color: #FFFFFF; }
        .theme-dark .quick-tile p { color: #94A3B8; }

        /* Dark Sub-Views & Modals */
        .theme-dark .view-header-row h2 { color: #FFFFFF; }
        .theme-dark .view-header-row p { color: #94A3B8; }
        .theme-dark .search-field-dark { background: #121829; border: 1px solid #1B243B; }
        .theme-dark .search-field-dark input { color: #FFFFFF; }
        .theme-dark .code-pill.staff { background: #450A0A; color: #FCA5A5; border: 1px solid #7F1D1D; }
        .theme-dark .code-pill.student { background: #064E3B; color: #6EE7B7; border: 1px solid #047857; }
        .theme-dark .belt-badge { background: #2D2214; color: #FCD34D; border: 1px solid #4C371D; }
        .theme-dark .status-pill.paid { background: #064E3B; color: #34D399; }
        .theme-dark .status-pill.due { background: #450A0A; color: #F87171; }
        .theme-dark .btn-action-edit { background: #3B2A15; border: 1px solid #5A401D; color: #FCD34D; }
        .theme-dark .btn-action-edit:hover { background: #4C371D; }
        .theme-dark .btn-action-key { background: #182035; border: 1px solid #2E3B5C; color: #60A5FA; }
        .theme-dark .btn-action-delete { background: transparent; border: 1px solid #7F1D1D; color: #EF4444; }
        .theme-dark .status-badge-amber { background: rgba(245, 158, 11, 0.15); color: #FCD34D; border: 1px solid rgba(245, 158, 11, 0.3); }
        .theme-dark .status-badge-gray { background: rgba(148, 163, 184, 0.15); color: #94A3B8; border: 1px solid rgba(148, 163, 184, 0.3); }
        .theme-dark .att-choice-btn { background: #131A2D; border: 1px solid #24304D; color: #94A3B8; }
        .theme-dark .att-choice-btn.selected-present { background: #064E3B; color: #34D399; border-color: #059669; }
        .theme-dark .att-choice-btn.selected-absent { background: #7F1D1D; color: #FCA5A5; border-color: #DC2626; }
        .theme-dark .att-choice-btn.selected-late { background: #451A03; color: #FCD34D; border-color: #D97706; }
        .theme-dark .att-choice-btn.selected-excused { background: #1E1B4B; color: #C4B5FD; border-color: #6366F1; }
        .theme-dark .att-choice-btn.selected-half-day { background: #164E63; color: #67E8F9; border-color: #0891B2; }
        .theme-dark .att-choice-btn.selected-leave { background: #4C1D95; color: #C4B5FD; border-color: #7C3AED; }

        .theme-dark .dept-card-dark { background: #121829; border: 1px solid #1B243B; }
        .theme-dark .dept-card-dark h3 { color: #FFFFFF; }
        .theme-dark .dept-card-dark p { color: #94A3B8; }
        .theme-dark .dept-code-tag { background: #182035; color: #94A3B8; }
        .theme-dark .dept-stats-row { background: #0E131F; color: #94A3B8; }
        .theme-dark .dept-stats-row strong { color: #FFFFFF; }

        .theme-dark .course-card-dark { background: #121829; border: 1px solid #1B243B; }
        .theme-dark .course-card-body h3 { color: #FFFFFF; }
        .theme-dark .course-card-body p { color: #94A3B8; }
        .theme-dark .course-specs-list { border-top: 1px solid #1B243B; color: #94A3B8; }
        .theme-dark .course-specs-list strong { color: #FFFFFF; }
        .theme-dark .fee-badge-dark { background: rgba(14, 19, 31, 0.85); color: #34D399; border: 1px solid rgba(52, 211, 153, 0.3); }

        .theme-dark .pipeline-badge.status-new { background: #1E3A8A; color: #93C5FD; }
        .theme-dark .pipeline-badge.status-in-review { background: #451A03; color: #FCD34D; }
        .theme-dark .pipeline-badge.status-contacted { background: #3B0764; color: #E9D5FF; }
        .theme-dark .pipeline-badge.status-enrolled { background: #064E3B; color: #6EE7B7; }
        .theme-dark .pipeline-badge.status-rejected { background: #450A0A; color: #FCA5A5; }
        .theme-dark .status-dropdown-dark { background: #182035; border: 1px solid #24304D; color: #FFFFFF; }

        .theme-dark .modal-backdrop-dark { background: rgba(7, 9, 14, 0.78); backdrop-filter: blur(8px); }
        .theme-dark .modal-card-dark { background: #121829; border: 1px solid #24304D; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 38, 38, 0.2); color: #FFFFFF; }
        .theme-dark .modal-header-dark h3 { color: #FFFFFF; }
        .theme-dark .close-btn-dark { background: #1A2338; color: #94A3B8; }
        .theme-dark .form-group-dark label { color: #CBD5E1; }
        .theme-dark .form-group-dark input,
        .theme-dark .form-group-dark select,
        .theme-dark .form-group-dark textarea {
          background: #0E131F;
          border: 1px solid #24304D;
          color: #FFFFFF;
        }
        .theme-dark .credential-summary-box { background: #0E131F; border: 1px solid #1E273E; }
        .theme-dark .btn-cancel-dark { border: 1px solid #24304D; color: #94A3B8; }

        /* -------------------------------------------------------------
           SHARED STRUCTURAL STYLES
           ------------------------------------------------------------- */
        .erp-sidebar {
          width: 250px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 50;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .erp-sidebar.collapsed {
          width: 72px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          padding: 1.25rem 1rem;
          position: relative;
        }

        .brand-logo-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(220, 38, 38, 0.5);
        }

        .brand-text {
          margin-left: 0.75rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .brand-title {
          font-weight: 800;
          font-size: 0.98rem;
          letter-spacing: 0.08em;
        }

        .brand-subtitle {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .sidebar-collapse-toggle {
          margin-left: auto;
          border-radius: 6px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .sidebar-search-box {
          margin: 1rem;
          position: relative;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0.45rem 0.65rem;
        }

        .sidebar-search-input {
          background: transparent;
          border: none;
          font-size: 0.82rem;
          outline: none;
          margin-left: 0.5rem;
          width: 100%;
        }

        .search-icon {
          color: #64748B;
        }

        .search-kbd {
          font-size: 0.68rem;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .sidebar-nav {
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-grow: 1;
          overflow-y: auto;
        }

        .nav-section-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.75rem 0.65rem 0.35rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          background: transparent;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          text-align: left;
          text-decoration: none;
        }

        .nav-badge {
          margin-left: auto;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .sidebar-footer {
          padding: 1rem;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .erp-main-area {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .erp-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 2rem;
        }

        .notification-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.78rem;
        }

        .bell-icon {
          color: #EF4444;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .theme-mode-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .punch-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .punch-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: currentColor;
          box-shadow: 0 0 8px currentColor;
        }

        .role-pill {
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .role-pill.role-admin { background: #DC2626; color: #FFFFFF; }
        .role-pill.role-instructor { background: #7C3AED; color: #FFFFFF; }
        .role-pill.role-student { background: #059669; color: #FFFFFF; }

        .user-profile-chip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #DC2626;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          border: 1px solid #EF4444;
          overflow: hidden;
        }

        .user-names {
          display: flex;
          flex-direction: column;
        }

        .user-fullname {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .user-sub {
          font-size: 0.72rem;
        }

        /* Toast Alert */
        .toast-notification-banner {
          margin: 1.25rem 2rem 0;
          padding: 0.85rem 1.25rem;
          background: #064E3B;
          border: 1px solid #059669;
          border-radius: 8px;
          color: #A7F3D0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .toast-content { display: flex; align-items: center; gap: 0.65rem; }
        .toast-close-btn { background: none; border: none; color: #A7F3D0; cursor: pointer; }

        /* Greeting Bar */
        .erp-greeting-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 2rem 1.25rem;
          gap: 1.25rem;
        }

        .greeting-text h1 {
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 0.25rem;
        }

        .greeting-text p {
          font-size: 0.88rem;
          margin: 0;
        }

        .greeting-filters {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .date-display-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .filter-select {
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
        }

        .refresh-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* Flow Container */
        .dashboard-content-flow {
          padding: 0 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Top 4 KPI Cards Grid */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .kpi-metric-card {
          border-radius: 12px;
          padding: 1.25rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-kpi-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .card-icon-bubble {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon-bubble.green { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .card-icon-bubble.purple { background: rgba(139, 92, 246, 0.15); color: #8B5CF6; }
        .card-icon-bubble.blue { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
        .card-icon-bubble.amber { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }

        .card-main-stat {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .dots-indicator {
          letter-spacing: 2px;
          margin-right: 0.35rem;
        }

        .card-sub-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .info-rate strong { color: #10B981; }
        .info-tag-purple { background: rgba(139, 92, 246, 0.15); color: #7C3AED; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .info-tag-green { background: rgba(16, 185, 129, 0.15); color: #059669; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .info-tag-amber { background: rgba(245, 158, 11, 0.15); color: #D97706; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .info-tag-red { background: rgba(239, 68, 68, 0.15); color: #DC2626; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .info-tag-blue { background: rgba(59, 130, 246, 0.15); color: #2563EB; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }

        .card-badges-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          font-size: 0.75rem;
        }

        .card-link-action {
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        /* Middle Panels Split */
        .middle-panels-split {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 1080px) {
          .middle-panels-split { grid-template-columns: 1fr; }
        }

        .panel-box {
          border-radius: 12px;
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
        }

        .panel-header-split {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .panel-title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }

        .panel-title-with-icon h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
        }

        .panel-subtitle {
          font-size: 0.78rem;
          margin: 0;
        }

        .panel-header-controls {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .control-btn {
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .control-date-input {
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          outline: none;
        }

        .control-btn-green {
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .sub-filter-row {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .sub-tab-pill {
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Enterprise Table */
        .table-wrapper-dark {
          border-radius: 8px;
          overflow-x: auto;
        }

        .enterprise-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        .enterprise-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .enterprise-table td {
          padding: 0.75rem 1rem;
        }

        .employee-cell {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .avatar-mini {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #DC2626;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .emp-name { font-weight: 700; display: block; }
        .emp-id { font-size: 0.72rem; font-family: monospace; }
        .punch-time-cell { font-family: monospace; font-size: 0.82rem; }
        .branch-tag { font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; }
        .status-badge-green { padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; }
        .status-badge-amber { padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; }
        .status-badge-gray { padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; }

        /* Deliverables Panel */
        .link-all {
          background: none;
          border: none;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .deliverables-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .deliverable-item-card {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .deliverable-info h4 {
          font-size: 0.88rem;
          margin: 0 0 0.2rem;
        }

        .deliverable-meta {
          font-size: 0.74rem;
        }

        .deliverable-status-tag {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .new-initiation-btn {
          width: 100%;
          padding: 0.65rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* Bottom Panels Split */
        .bottom-panels-split {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 1.25rem;
        }

        @media (max-width: 1080px) {
          .bottom-panels-split { grid-template-columns: 1fr; }
        }

        /* Tasks Feed */
        .tasks-feed-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.75rem;
        }

        .task-feed-item {
          padding: 0.75rem 0.85rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .task-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .custom-check {
          accent-color: #DC2626;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .task-title-text {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .task-dept-badge {
          font-size: 0.72rem;
        }

        .priority-tag {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .priority-tag.high { background: rgba(239, 68, 68, 0.15); color: #DC2626; }
        .priority-tag.med { background: rgba(245, 158, 11, 0.15); color: #D97706; }
        .priority-tag.low { background: rgba(59, 130, 246, 0.15); color: #2563EB; }

        /* Quick Tiles Grid */
        .quick-tiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 0.85rem;
        }

        @media (max-width: 768px) {
          .quick-tiles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .quick-tile {
          padding: 1rem 0.85rem;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quick-tile:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .tile-icon-box { margin-bottom: 0.5rem; }
        .quick-tile h4 { font-size: 0.82rem; font-weight: 800; margin: 0 0 0.15rem; }
        .quick-tile p { font-size: 0.7rem; margin: 0; }

        /* Sub-Views Container */
        .sub-view-container {
          padding: 0 2rem 2.5rem;
          display: flex;
          flex-direction: column;
        }

        .view-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .view-header-row h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 0.25rem;
        }

        .view-header-row p { font-size: 0.85rem; margin: 0; }

        .view-header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

        .btn-primary-action {
          padding: 0.55rem 1.15rem;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          border: 1px solid #DC2626;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .table-search-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-field-dark {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          min-width: 280px;
        }

        .search-field-dark input {
          background: transparent;
          border: none;
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }

        .code-pill {
          font-family: monospace;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .belt-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .status-pill {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .btn-action-edit {
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-key {
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
        }

        .btn-action-delete {
          padding: 0.35rem 0.55rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .att-choice-btn {
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Departments View Grid */
        .departments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .dept-card-dark {
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .dept-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .dept-code-tag { font-family: monospace; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; }
        .dept-status-tag.active { background: #DCFCE7; color: #15803D; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .dept-status-tag.inactive { background: #FEE2E2; color: #DC2626; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }

        .dept-card-dark h3 { font-size: 1.15rem; margin: 0 0 0.4rem; }
        .dept-card-dark p { font-size: 0.82rem; margin-bottom: 1rem; flex-grow: 1; }

        .dept-stats-row {
          display: flex;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.78rem;
        }

        .dept-card-footer { display: flex; justify-content: flex-end; }
        .btn-danger-outline {
          background: transparent;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 0.3rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        /* Courses Grid */
        .courses-grid-dark {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .course-card-dark {
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .course-card-image {
          height: 140px;
          position: relative;
        }

        .course-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fee-badge-dark {
          position: absolute;
          top: 10px;
          right: 10px;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .course-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .course-card-body h3 { font-size: 1.1rem; margin: 0 0 0.35rem; }
        .course-card-body p { font-size: 0.8rem; margin-bottom: 1rem; flex-grow: 1; }

        .course-specs-list {
          padding-top: 0.75rem;
          font-size: 0.75rem;
          display: flex;
          justify-content: space-between;
        }

        /* Pipeline Badges */
        .pipeline-badge {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .status-dropdown-dark {
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          outline: none;
          cursor: pointer;
        }

        /* Modal Styles */
        .modal-backdrop-dark {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 1000;
        }

        .modal-card-dark {
          border-radius: 16px;
          padding: 2rem;
          max-width: 520px;
          width: 100%;
        }

        .modal-card-dark.wide { max-width: 660px; }

        .modal-header-dark {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header-dark h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
        }

        .close-btn-dark {
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group-dark {
          margin-bottom: 1.1rem;
          display: flex;
          flex-direction: column;
        }

        .form-group-dark label {
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }

        .form-group-dark input,
        .form-group-dark select,
        .form-group-dark textarea {
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group-dark input:focus,
        .form-group-dark select:focus,
        .form-group-dark textarea:focus {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }

        .help-text-muted {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 0.35rem;
        }

        .credential-summary-box {
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .password-peek-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
        }

        .modal-footer-dark {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-cancel-dark {
          padding: 0.6rem 1rem;
          background: transparent;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .btn-submit-dark {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          border: 1px solid #DC2626;
          border-radius: 8px;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.35);
        }
      `}</style>
          </div>
        );
};

        export default ERPDashboard;
