/* eslint-disable prefer-const */
"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

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

const AddAppointmentModal = ({
  visible,
  onCancel,
  onOk,
}: AddAppointmentModalProps) => {
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
    "07:00am",
    "07:30am",
    "08:00am",
    "08:30am",
    "09:00am",
    "09:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
  ];

  const classOptions = [
    "Hot Yoga",
    "Vinyasa",
    "Hatha",
    "Power Yoga",
    "Restorative",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim())
      newErrors.patientName = "Please enter patient name";
    if (!formData.contact.trim())
      newErrors.contact = "Please enter contact number";
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
      const [timePart, meridiem] =
        selectedTime.match(/(\d{2}:\d{2})(am|pm)/)?.slice(1, 3) || [];
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
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const goToPrev = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1)
    );
  const goToNext = () =>
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1)
    );

  const isDateSelected = (day: number) => {
    return (
      !!selectedDate &&
      day === selectedDate.getDate() &&
      calendarDate.getMonth() === selectedDate.getMonth() &&
      calendarDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  if (!visible) return null;

  return (
    <div className="fixed font-arial inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal */}
      <div className="w-full max-w-4xl rounded-2xl bg-[#F3F3F3] shadow-xl p-8 relative">
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <CloseOutlined />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-[32px] font-normal text-[#A7997D]">
            Add an Appointment
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6">
          {/* Left: Form Fields */}
          <div className="space-y-5">
            {/* Patient Name & Contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm md:text-base  text-[#4E4E4A] font-medium">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="e.g emily"
                  className={`w-full  rounded-[12px]  border border-[#D9D9D9]/50 bg-[#F3F3F3]  px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.patientName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                  }`}
                />
                {errors.patientName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.patientName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm md:text-base  text-[#4E4E4A] font-medium">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="e.g +12 1245 1524"
                  className={`w-full  rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3]  px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.contact
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                  }`}
                />
                {errors.contact && (
                  <p className="mt-1 text-xs text-red-500">{errors.contact}</p>
                )}
              </div>
            </div>

            {/* Email & Class */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm md:text-base  text-[#4E4E4A] font-medium">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full  rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3]  px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm md:text-base  text-[#4E4E4A] font-medium">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className={`w-full  rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3]  px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.class
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                  }`}
                >
                  <option value="">Hot Yoga</option>
                  {classOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p className="mt-1 text-xs text-red-500">{errors.class}</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="mb-1 block text-sm md:text-base  text-[#4E4E4A] font-medium">
                Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Write note here"
                rows={2}
                className="w-full px-3 py-2 text-sm focus:outline-none focus:border-[#A7997D] focus:ring-1 focus:ring-[#A7997D]  rounded-[12px] border-[0.5px] border-[#D9D9D9] bg-[#F3F3F3]"
              ></textarea>
            </div>
          </div>

          {/* Date and Time Section */}
          <div>
            <label className="mb-1 block text-sm md:text-base  text-[#4E4E4A] font-medium">
              Select Date and Time
            </label>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-[#4E4E4A] ">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-[#4E4E4A] ">Unavailable</span>
                </div>
              </div>

              <div className="flex gap-4 font-arial w-full">
                {/* Calendar */}
                <div className="flex-1 w-1/2 border-r border-gray-200 stroke-[0.5px] stroke-[rgba(11,18,27,0)] pr-4">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      onClick={goToPrev}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20 10C20 15.5229 15.5229 20 10 20C4.4772 20 0 15.5229 0 10C0 4.4772 4.4772 0 10 0C15.5229 0 20 4.4772 20 10ZM9.7071 7.7071C10.0976 7.3166 10.0976 6.6834 9.7071 6.2929C9.3166 5.9024 8.6834 5.9024 8.2929 6.2929L5.3799 9.2059C5.3649 9.2209 5.3503 9.2363 5.3363 9.252C5.13 9.4352 5 9.7024 5 10C5 10.2976 5.13 10.5648 5.3363 10.748C5.3503 10.7637 5.3649 10.7791 5.3799 10.7941L8.2929 13.7071C8.6834 14.0976 9.3166 14.0976 9.7071 13.7071C10.0976 13.3166 10.0976 12.6834 9.7071 12.2929L8.4142 11L14 11C14.5523 11 15 10.5523 15 10C15 9.4477 14.5523 9 14 9L8.4142 9L9.7071 7.7071Z"
                          fill="#A7997D"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {monthNames[calendarDate.getMonth()]}{" "}
                      {calendarDate.getFullYear()}
                    </span>
                    <button
                      onClick={goToNext}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10.2929 12.2929C9.9024 12.6834 9.9024 13.3166 10.2929 13.7071C10.6834 14.0976 11.3166 14.0976 11.7071 13.7071L14.6201 10.7941C14.6351 10.7791 14.6497 10.7637 14.6637 10.748C14.87 10.5648 15 10.2976 15 10C15 9.7024 14.87 9.4352 14.6637 9.252C14.6497 9.2363 14.6351 9.2209 14.6201 9.2059L11.7071 6.29289C11.3166 5.90237 10.6834 5.90237 10.2929 6.29289C9.9024 6.68342 9.9024 7.31658 10.2929 7.70711L11.5858 9H6C5.44772 9 5 9.4477 5 10C5 10.5523 5.44772 11 6 11H11.5858L10.2929 12.2929Z"
                          fill="#A7997D"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="mb-1 h-8 flex  items-center justify-center text-xs md:text-sm  font-bold text-[#4E4E4A]"
                      >
                        {day}
                      </div>
                    ))}
                    {days.map((day, idx) =>
                      day ? (
                        <button
                          key={idx}
                          onClick={() => handleDateClick(day)}
                          className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
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
                <div className="flex-1 w-1/2 pl-4">
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full rounded-md px-3 py-2  text-sm font-medium  ${
                          selectedTime === time
                            ? " border-2 border-[#A7997D]  text-[#A7997D]"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#A7997D] px-8 py-2 text-sm font-normal text-white hover:bg-[#8d7c68] transition-colors"
          >
            Add To Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;