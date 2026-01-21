import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "./style.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "" });
  const [login, setLogin] = useState({ email: "", password: "", show: false });
  const [register, setRegister] = useState({ name: "", email: "", password: "", show: false });
  const [appointments, setAppointments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState({ status: "", date: "", user: "" });
  const chartRef = useRef(null);

  useEffect(() => {
    setAppointments(JSON.parse(localStorage.getItem("appointments")) || []);
  }, [page]);

  useEffect(() => {
    if (page === "dashboard" && chartRef.current) {
      new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: appointments.map(a => a.date),
          datasets: [{ label: "Appointments", data: appointments.map(() => 1), backgroundColor: "#1abc9c" }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: "white" } } },
          scales: { x: { ticks: { color: "white" }, grid: { color: '#ffffff22' } }, y: { ticks: { color: "white" }, grid: { color: '#ffffff22' }, beginAtZero: true } }
        }
      });
    }
  }, [appointments, page]);

  const handleBooking = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.date || !form.time) return alert("من فضلك اكمل كل البيانات");
    const data = [...appointments, { ...form, status: "pending", id: Date.now() }];
    localStorage.setItem("appointments", JSON.stringify(data));
    setAppointments(data);
    alert("✅ تم حجز الموعد بنجاح");
    setForm({ name: "", email: "", date: "", time: "" });
  };

  const handleRegister = () => {
    if (!register.name || !register.email || !register.password) return alert("املأ كل الحقول");
    if (localStorage.getItem(register.email)) return alert("هذا البريد مسجل بالفعل!");
    localStorage.setItem(register.email, JSON.stringify({ name: register.name, password: register.password }));
    alert("تم إنشاء الحساب ✅");
    setRegister({ name: "", email: "", password: "", show: false });
    setPage("login");
  };

  const handleLogin = () => {
    if (login.email === "admin@admin.com" && login.password === "admin") {
      setIsAdmin(true);
      setPage("admin");
      return;
    }
    const user = JSON.parse(localStorage.getItem(login.email));
    if (!user || user.password !== login.password) return alert("خطأ في البيانات");
    alert("تم تسجيل الدخول ✅");
    setPage("dashboard");
  };

  const changeStatus = (id, status) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem("appointments", JSON.stringify(updated));
    setAppointments(updated);
    alert(`✅ تم تحديث الحالة: ${status}`);
  };

  const filtered = appointments.filter(a =>
    (!filter.status || a.status === filter.status) &&
    (!filter.date || a.date === filter.date) &&
    (!filter.user || a.name.includes(filter.user))
  );

  return (
    <>
      <nav className="navbar">
        <h2>Smart Appointment</h2>
        <div className="nav-links">
          {["home","booking","dashboard","login","register"].map(p => (
            <a key={p} href="#" onClick={e => { e.preventDefault(); setPage(p); }}>{p.charAt(0).toUpperCase() + p.slice(1)}</a>
          ))}
          {isAdmin && <a href="#" onClick={e => { e.preventDefault(); setPage("admin"); }}>Admin Panel</a>}
        </div>
      </nav>

      <div id="content" style={{ paddingTop: "100px", maxWidth: "900px", margin: "auto" }}>

        {page==="home" && (
          <section className="home">
            <h1>Welcome to Smart Appointment System</h1>
            <p>Book, manage and track your appointments easily</p>
          </section>
        )}

        {page==="booking" && (
          <div className="booking-container">
            <h2>Book Appointment</h2>
            <form onSubmit={handleBooking}>
              <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
              <input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/>
              <input type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})}/>
              <button type="submit" className="btn">Book Now</button>
            </form>
          </div>
        )}

        {page==="dashboard" && (
          <div className="dashboard-main">
            <h1>Appointments Overview</h1>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
            <h2>Upcoming Appointments</h2>
            <table className="dashboard-table">
              <thead><tr><th>Name</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map(a=>(<tr key={a.id}><td>{a.name}</td><td>{a.date}</td><td>{a.time}</td><td>{a.status}</td></tr>))}
              </tbody>
            </table>
          </div>
        )}

        {page==="login" && (
          <div className="booking-container">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={login.email} onChange={e => setLogin({...login,email:e.target.value})}/>
            <div className="password-box">
              <input type={login.show ? "text" : "password"} placeholder="Password" value={login.password} onChange={e => setLogin({...login,password:e.target.value})}/>
              <span className="toggle" onClick={()=>setLogin({...login,show:!login.show})}>👁️</span>
            </div>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}

        {page==="register" && (
          <div className="booking-container">
            <h2>Register</h2>
            <input type="text" placeholder="Name" value={register.name} onChange={e => setRegister({...register,name:e.target.value})}/>
            <input type="email" placeholder="Email" value={register.email} onChange={e => setRegister({...register,email:e.target.value})}/>
            <div className="password-box">
              <input type={register.show ? "text" : "password"} placeholder="Password" value={register.password} onChange={e => setRegister({...register,password:e.target.value})}/>
              <span className="toggle" onClick={()=>setRegister({...register,show:!register.show})}>👁️</span>
            </div>
            <button onClick={handleRegister}>Register</button>
          </div>
        )}

        {page==="admin" && isAdmin && (
          <div className="dashboard-main">
            <h1>Admin Panel</h1>
            <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
              <select onChange={e => setFilter({...filter,status:e.target.value})}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <input type="date" onChange={e => setFilter({...filter,date:e.target.value})}/>
              <input placeholder="Search User" onChange={e => setFilter({...filter,user:e.target.value})}/>
            </div>
            <table className="dashboard-table">
              <thead><tr><th>Name</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                    <td>
                      <button onClick={()=>changeStatus(a.id,"accepted")}>✔</button>
                      <button onClick={()=>changeStatus(a.id,"rejected")}>✖</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
}
