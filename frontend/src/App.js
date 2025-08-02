// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Login            from './pages/Login';
import Register         from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import FinanceDashboard   from './pages/FinanceDashboard';
import VCDashboard     from './pages/VCDashboard';

import FeesPayment       from './pages/FeesPayment';
import ResultsManagement from './pages/ResultsManagement';
import ResultsApproval   from './pages/ResultsApproval';

import StudentCourses from './pages/StudentCourses';
import StudentFees    from './pages/StudentFees';
import StudentResults from './pages/StudentResults';
import CalendarViewer from './pages/CalendarViewer';

import CourseApprovals    from './pages/CourseApprovals';
import CourseManagement   from './pages/CourseManagement';
import CalendarManagement from './pages/CalendarManagement';

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  try {
    const { role, exp } = jwtDecode(token);
    if (Date.now() >= exp*1000) throw new Error();
    if (!allowedRoles.includes(role)) throw new Error();
    return children;
  } catch {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/finance/*" element={<PrivateRoute allowedRoles={['Finance']}><FinanceDashboard/></PrivateRoute>}>
          <Route index element={<FeesPayment/>}/>
          <Route path="fees" element={<FeesPayment/>}/>
          <Route path="courses-manage" element={<CourseManagement/>}/>
          <Route path="calendar-manage" element={<CalendarManagement/>}/>
        </Route>

        <Route path="/dashboard/student/*" element={<PrivateRoute allowedRoles={['Student']}><StudentDashboard/></PrivateRoute>}>
          <Route index element={<h1 className="text-3xl">Welcome, Student</h1>}/>
          <Route path="courses" element={<StudentCourses/>}/>
          <Route path="fees" element={<StudentFees/>}/>
          <Route path="results" element={<StudentResults/>}/>
          <Route path="calendar" element={<CalendarViewer/>}/>
        </Route>

        <Route path="/dashboard/professor/*" element={<PrivateRoute allowedRoles={['Professor']}><ProfessorDashboard/></PrivateRoute>}>
          <Route index element={<h1 className="text-3xl">Welcome, Professor</h1>}/>
          <Route path="results" element={<ResultsManagement/>}/>
          <Route path="course-approvals" element={<CourseApprovals/>}/>
          <Route path="calendar" element={<CalendarViewer/>}/>
        </Route>

        <Route path="/dashboard/vc/*" element={<PrivateRoute allowedRoles={['VC']}><VCDashboard/></PrivateRoute>}>
          <Route index element={<h1 className="text-3xl">Welcome, HoD/VC</h1>}/>
          <Route path="results-approve" element={<ResultsApproval/>}/>
          <Route path="course-approvals" element={<CourseApprovals/>}/>
          <Route path="calendar" element={<CalendarViewer/>}/>
        </Route>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </Router>
  );
}
