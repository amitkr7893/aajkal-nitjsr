"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDialog from "../components/CustomDialog";
import NProgress from "nprogress";

function getCookie(name) {
  if (typeof document === "undefined") return null; // SSR safety check
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function Submit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id"); // Detect edit mode
  const [form, setForm] = useState({
    title: "",
    date: "",
    endDate: "",
    location: "",
    organizer: "",
    category: "",
    desc: "",
    image: "",
  });
  const [loading, setLoading] = useState(true); // Prevent rendering until auth check
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [studentId, setStudentId] = useState(null);

  const [dialogMessage, setDialogMessage] = useState("");
  const showError = (msg) => {
    setDialogMessage(msg);
    NProgress.done();
    setLoading(false);
  };

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

  // Fetch event details if editing
  useEffect(() => {
    if (eventId) {
      const saved = sessionStorage.getItem("editingEvent");
      if (!saved) return;

      try {
        const data = JSON.parse(saved);

        setForm({
          title: data.title || "",
          date: data.date || "",
          endDate: data.endDate || "",
          location: data.location || "",
          organizer: data.organizer || "",
          category: data.category || "",
          desc: data.desc || "",
          image: data.image || "",
        });

        if (data.date) setSelectedDateTime(new Date(data.date));
        if (data.endDate) setSelectedEndDateTime(new Date(data.endDate));
      } catch (err) {
        console.error("Failed to load event from sessionStorage", err);
      }
    }
  }, [eventId]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    NProgress.start();
    setLoading(true);

    try {
      let imageUrl = form.image;

      // If an image was selected, upload it to Cloudinary
      if (imageFile) {
        const data = new FormData();
        data.append("image", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          showError("Image upload failed");
          return;
        }

        imageUrl = uploadData.url;
      }

      const payload = {
        ...form,
        image: imageUrl,
        studentId,
        id: eventId,
      };

      const res = await fetch("/api/events", {
        method: eventId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showError("Error submitting event");
        return;
      }

      sessionStorage.removeItem("editingEvent");

      NProgress.done();
      router.push(eventId ? "/dashboard" : "/");
    } catch (error) {
      console.error(error);
      showError("An unexpected error occurred");
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  if (loading && !dialogMessage) return null; // Avoid rendering until auth check is done

  return (
    <div className="w-full bg-black">
      <CustomDialog message={dialogMessage} onClose={() => setDialogMessage("")} />

      <div className="max-w-xl mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {eventId ? "Update Event" : "Add New Event"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <DatePicker
            selected={selectedDateTime}
            onChange={(date) => {
              if (date <= new Date()) {
                showError("Date & time can't be from past");
                return;
              }
              setSelectedDateTime(date);
              handleChange({
                target: {
                  name: "date",
                  value: date ? date.toISOString() : "",
                },
              });
            }}
            showTimeSelect
            className="w-full p-2 border rounded"
            wrapperClassName="w-full"
            dateFormat="Pp"
            placeholderText="Choose Start Date & Time"
            required
          />
          <DatePicker
            selected={selectedEndDateTime}
            onChange={(date) => {
              if (selectedDateTime && date <= selectedDateTime) {
                showError("End time must be after the start time.");
                return;
              }
              setSelectedEndDateTime(date);
              handleChange({
                target: {
                  name: "endDate",
                  value: date ? date.toISOString() : "",
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

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="organizer"
            placeholder="Organizing Club/Team"
            value={form.organizer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="category"
            onChange={handleChange}
            value={form.category}
            className={`w-full p-2 border rounded bg-black ${
              form.category === "" ? "text-neutral-500 border-white" : "text-white"
            }`}
            required
          >
            <option value="" disabled hidden>
              Select Event Category
            </option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Sports">Sports</option>
            <option value="Literary & Academic">Literary & Academic</option>
            <option value="Others">Others</option>
          </select>

          <div className="p-1 h-10 flex items-center border rounded text-neutral-500 border-white">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full p-2"
            />

            {form.image && !imageFile && (
              <div className="">
                <img
                  src={form.image}
                  alt="Current Event"
                  className="h-8 w-30 object-cover border rounded"
                />
              </div>
            )}
          </div>

          <textarea
            name="desc"
            placeholder="Description of Event"
            onChange={handleChange}
            value={form.desc}
            className="w-full p-2 border rounded h-32 resize-none custom-scrollbar"
            required
          />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 cursor-pointer"
          >
            {eventId ? "Update Event" : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
