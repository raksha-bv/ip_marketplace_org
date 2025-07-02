import React, { useState } from 'react';

const RegisterIP = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ipType: 'Patent',
    licenseType: 'Exclusive',
    jurisdiction: '',
    termsUrl: '',
    document: ''
  });

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register New IP</h2>
      <input className="input" placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="input" placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
      <input className="input" placeholder="Jurisdiction" onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
      <select className="input" onChange={(e) => setForm({ ...form, ipType: e.target.value })}>
        <option>Patent</option>
        <option>Copyright</option>
        <option>Trademark</option>
      </select>
      <input className="input" placeholder="Terms URL" onChange={(e) => setForm({ ...form, termsUrl: e.target.value })} />
      <input type="file" className="input" onChange={(e) => setForm({ ...form, document: e.target.files?.[0] })} />

      <button
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
        onClick={() => onSubmit(form)}
      >
        Register
      </button>
    </div>
  );
};

export default RegisterIP;