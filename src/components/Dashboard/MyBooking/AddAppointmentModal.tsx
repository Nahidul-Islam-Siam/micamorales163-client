/* eslint-disable prefer-const */
"use client";

import { useState } from "react";

interface AddAppointmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: {
    patientName: string;
    contact: string;
    email: string;
    class: string;
    note?: string;
    appointmentDateTime?: Date | null;
  }) => void;
}

const AddAppointmentModal = ({ visible, onOk }: AddAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    email: "",
    class: "",
    note: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    "07:00am", "07:30am",
    "08:00am", "08:30am",
    "09:00am", "09:30am",
    "10:00am", "10:30am",
    "11:00am", "11:30am",
    "12:00pm", "12:30pm"
  ];

  const classOptions = ["Hot Yoga", "Vinyasa", "Hatha", "Power Yoga", "Restorative"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) newErrors.patientName = "Please enter patient name";
    if (!formData.contact.trim()) newErrors.contact = "Please enter contact number";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.class) newErrors.class = "Please select a class";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    let appointmentDateTime: Date | null = null;
    if (selectedDate && selectedTime) {
      const [timePart, meridiem] = selectedTime.match(/(\d{2}:\d{2})(am|pm)/)?.slice(1, 3) || [];
      let [hours, minutes] = timePart.split(":").map(Number);

      if (meridiem === "pm" && hours !== 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;

      appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
    }

    onOk({ ...formData, appointmentDateTime });
  };

  // Calendar logic
  const [calendarDate, setCalendarDate] = useState(new Date());

  const generateDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const days = generateDays(calendarDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const goToPrev = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1));
  const goToNext = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1));

  const isDateSelected = (day: number) => {
    return !!selectedDate &&
      day === selectedDate.getDate() &&
      calendarDate.getMonth() === selectedDate.getMonth() &&
      calendarDate.getFullYear() === selectedDate.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal */}
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 text-center">
          <h2 className="text-2xl font-medium text-[#A7997D]">Add an Appointment</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: Form Fields */}
            <div className="space-y-5">
              {/* Patient Name & Contact */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="e.g emily"
                    className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.patientName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                    }`}
                  />
                  {errors.patientName && <p className="mt-1 text-xs text-red-500">{errors.patientName}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="e.g +12 1245 1524"
                    className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.contact
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                    }`}
                  />
                  {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
                </div>
              </div>

              {/* Email & Class */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.class
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                    }`}
                  >
                    <option value="">Hot Yoga</option>
                    {classOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.class && <p className="mt-1 text-xs text-red-500">{errors.class}</p>}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Write note here"
                  rows={2}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#A7997D] focus:ring-1 focus:ring-[#A7997D]"
                ></textarea>
              </div>
            </div>

            {/* Right: Calendar & Time */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span>Unavailable</span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Calendar */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center justify-between">
                    <button onClick={goToPrev} className="rounded p-1 hover:bg-gray-200">&lt;</button>
                    <span className="text-sm font-medium text-gray-700">
                      {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                    </span>
                    <button onClick={goToNext} className="rounded p-1 hover:bg-gray-200">&gt;</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayNames.map(day => (
                      <div key={day} className="mb-1 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {days.map((day, idx) =>
                      day ? (
                        <button
                          key={idx}
                          onClick={() => handleDateClick(day)}
                          className={`h-8 rounded text-sm font-medium transition-colors ${
                            isDateSelected(day)
                              ? "bg-[#A7997D] text-white"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div key={idx} className="h-8"></div>
                      )
                    )}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                          selectedTime === time
                            ? "bg-[#A7997D] text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 text-center">
          <button
            onClick={handleSubmit}
            className="rounded bg-[#A7997D] px-8 py-2 text-sm font-medium text-white hover:bg-[#8d7c68] transition-colors"
          >
            Add To Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;