// src/app/submit/page.js
'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }

function getCookie(name) {
  if (typeof document === 'undefined') return null; // SSR safety check
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function SubmitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    date: "",
    endDate: "",
    location: "",
    organizer: "",
    category: '',
    desc: '',
  });

    const [loading, setLoading] = useState(true); // Prevent rendering until auth check

    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [studentId, setStudentId] = useState(null);

    // Check if user is logged in
  useEffect(() => {
    const id = getCookie("studentId");
    if (!id) {
      router.push("/login");
    } else {
      setStudentId(id);
      setLoading(false);
    }
  }, [router]);


  //  const studentId = getCookie("studentId");
  // useEffect(() => {
  //   if (!studentId) {
  //     router.push("/login");
  //   } else {
  //     setLoading(false);
  //   }
  // }, [router]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  let imageUrl = '';

  // If an image was selected, upload it to Cloudinary
  if (imageFile) {
    const data = new FormData();
    data.append('image', imageFile);
    
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });
    
    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Image upload failed");
      return;
    }

    imageUrl = uploadData.url;
  }

  // Combine form data with image URL (if any)
  const updatedForm = { ...form, image: imageUrl, 'studentId': studentId };

  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedForm),
  });

  if (!res.ok) {
    console.error("Error submitting event");
    return;
  }

  router.push("/");
};



  if (loading) return null; // Avoid rendering until auth check is done

  return (
    <div className="w-full bg-black" 
    //  style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'contain' }}
    
    >

    <div className="max-w-xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Event Title" onChange={handleChange} className="w-full p-2 border rounded" required />
      
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => {
            setSelectedDateTime(date);
            setSelectedEndDateTime(date);
            handleChange({
              target: {
                name: 'date',
                value: date ? date.toISOString() : '', // Includes both date and time in ISO format
              },
            });
          }}
          showTimeSelect
          className="w-full p-2 border rounded"
          wrapperClassName="w-full"
          dateFormat="Pp" // Shows something like: 05/30/2025, 10:45 PM
          placeholderText="Choose Start Date & Time"
          required
        />
        <DatePicker
          selected={selectedEndDateTime}
          onChange={(date) => {
            // Validate end > start
            if (selectedDateTime && date <= selectedDateTime) {
              alert('End time must be after the start time.');
              return;
            }

            setSelectedEndDateTime(date);
            handleChange({
              target: {
                name: 'endDate',
                value: date ? date.toISOString() : '',
              },
            });
          }}
          showTimeSelect
          className="w-full p-2 border rounded"
          wrapperClassName="w-full"
          dateFormat="Pp"
          placeholderText="Choose End Date & Time"
          required
        />

        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="organizer" placeholder="Organizing Club/Team" onChange={handleChange} className="w-full p-2 border rounded" required />
         <select
            name="category"
            onChange={handleChange}
            value={form.category}
            className={`w-full p-2 border rounded bg-black ${
                        form.category === '' ? 'text-neutral-500 border-white' : 'text-white'
                      }`} 
            
            
          >
            <option value="" disabled hidden>Select Event Category</option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Sports">Sports</option>
            <option value="Literary & Academic">Literary & Academic</option>
            <option value="Others">Others</option>
          </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full p-2 border rounded text-neutral-500 border-white"
        />


        <textarea
          name="desc"
          placeholder="Description of Event"
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 resize-none custom-scrollbar"
          required
        />
        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 cursor-pointer">
          Add Event
        </button>
      </form>
    </div>
    </div>

  );
}
