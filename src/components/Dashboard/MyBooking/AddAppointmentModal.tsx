/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { useState, useEffect, useMemo } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useGetClassOfferingsQuery } from "@/redux/service/userprofile/mylisting";
import { useAddBookingMutation } from "@/redux/service/booking/bookingApi";
import Swal from "sweetalert2";

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
    classId?: string;
  }) => void;
}

const AddAppointmentModal = ({
  visible,
  onCancel,
  // onOk,
}: AddAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    email: "",
    class: "Signature",
    note: "",
  });

  const { data: classTypes } = useGetClassOfferingsQuery();
  const [addBooking, { isLoading: isBookingLoading }] = useAddBookingMutation();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    id: string;
    startTime: string;
    endTime: string;
    classId: string;
    className: string;
  } | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const classOptions = [
    { label: "Signature", value: "Signature" },
    { label: "Membership", value: "Membership" }
  ];

  const getApiClassType = (staticType: string): string => {
    if (staticType === "Signature") return "SIGNATURE";
    if (staticType === "Membership") return "MEMBERSHIP";
    return "";
  };

  // ✅ Extract dates from TIME SLOTS, not schedule dates
  const availableData = useMemo(() => {
    if (!classTypes?.data?.result) {
      return { dates: new Set<string>(), months: new Set<string>() };
    }
    
    const apiClassType = getApiClassType(formData.class);
    const dates = new Set<string>();
    const months = new Set<string>();
    
    classTypes.data.result.forEach(offer => {
      if (offer.type === apiClassType) {
        offer.schedules.forEach(schedule => {
          schedule.classTimeSlot.forEach(timeSlot => {
            const datePart = timeSlot.startTime.split('T')[0];
            dates.add(datePart);
            const monthPart = datePart.substring(0, 7);
            months.add(monthPart);
          });
        });
      }
    });
    
    return { dates, months };
  }, [classTypes, formData.class]);

  const availableDates = availableData.dates;
  const availableMonths = availableData.months;

  // ✅ Match time slots by their actual date
  const timeSlotsForDate = useMemo(() => {
    if (!selectedDate || !classTypes?.data?.result) return [];
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const apiClassType = getApiClassType(formData.class);
    
    let slots: any[] = [];
    classTypes.data.result.forEach(offer => {
      if (offer.type === apiClassType) {
        offer.schedules.forEach(schedule => {
          schedule.classTimeSlot.forEach(slot => {
            const slotDate = slot.startTime.split('T')[0];
            if (slotDate === selectedDateStr) {
              slots.push({
                id: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                maxSpace: slot.maxSpace ?? offer.maxSpace,
                bookedSpace: slot.bookedSpace,
                classId: offer.id,
                className: offer.name
              });
            }
          });
        });
      }
    });
    
    return slots;
  }, [selectedDate, classTypes, formData.class]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'class') {
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      if (availableMonths.size > 0) {
        const firstMonth = Array.from(availableMonths).sort()[0];
        const [year, month] = firstMonth.split('-').map(Number);
        setCalendarDate(new Date(year, month - 1, 1));
      }
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (visible) {
      setCalendarDate(new Date());
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      
      if (availableMonths.size > 0) {
        const firstMonth = Array.from(availableMonths).sort()[0];
        const [year, month] = firstMonth.split('-').map(Number);
        setCalendarDate(new Date(year, month - 1, 1));
      }
    }
  }, [visible, availableMonths]);

  const canNavigatePrev = useMemo(() => {
    if (availableMonths.size === 0) return false;
    
    const currentMonth = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthIndex = Array.from(availableMonths).sort().indexOf(currentMonth);
    
    return currentMonthIndex > 0;
  }, [calendarDate, availableMonths]);

  const canNavigateNext = useMemo(() => {
    if (availableMonths.size === 0) return false;
    
    const currentMonth = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthIndex = Array.from(availableMonths).sort().indexOf(currentMonth);
    const sortedMonths = Array.from(availableMonths).sort();
    
    return currentMonthIndex < sortedMonths.length - 1;
  }, [calendarDate, availableMonths]);

  const goToPrev = () => {
    if (!canNavigatePrev) return;
    
    const currentMonth = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`;
    const sortedMonths = Array.from(availableMonths).sort();
    const currentIndex = sortedMonths.indexOf(currentMonth);
    
    if (currentIndex > 0) {
      const prevMonth = sortedMonths[currentIndex - 1];
      const [year, month] = prevMonth.split('-').map(Number);
      setCalendarDate(new Date(year, month - 1, 1));
    }
  };
  
  const goToNext = () => {
    if (!canNavigateNext) return;
    
    const currentMonth = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`;
    const sortedMonths = Array.from(availableMonths).sort();
    const currentIndex = sortedMonths.indexOf(currentMonth);
    
    if (currentIndex < sortedMonths.length - 1) {
      const nextMonth = sortedMonths[currentIndex + 1];
      const [year, month] = nextMonth.split('-').map(Number);
      setCalendarDate(new Date(year, month - 1, 1));
    }
  };

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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const isDateSelected = (day: number) => {
    return (
      !!selectedDate &&
      day === selectedDate.getDate() &&
      calendarDate.getMonth() === selectedDate.getMonth() &&
      calendarDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDateAvailable = (day: number) => {
    const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availableDates.has(dateStr);
  };

  const handleDateClick = (day: number) => {
    if (!isDateAvailable(day)) return;
    
    const newDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
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
    if (!formData.class) 
      newErrors.class = "Please select a class";
    if (!selectedTimeSlot)
      newErrors.timeSlot = "Please select a time slot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ FULLY UPDATED handleSubmit with EXACT backend payload
 const handleSubmit = () => {
  if (!validateForm() || !selectedTimeSlot) return;

  // Find the schedule and time slot IDs
  let classScheduleId = "";
  let classTimeSlotId = "";
  
  if (classTypes?.data?.result) {
    const selectedClass = classTypes.data.result.find(
      offer => offer.id === selectedTimeSlot.classId
    );
    
    if (selectedClass) {
      for (const schedule of selectedClass.schedules) {
        const timeSlot = schedule.classTimeSlot.find(
          ts => ts.id === selectedTimeSlot.id
        );
        if (timeSlot) {
          classScheduleId = schedule.id;
          classTimeSlotId = timeSlot.id;
          break;
        }
      }
    }
  }

  if (!classScheduleId || !classTimeSlotId) {
    setErrors({ timeSlot: "Could not find schedule or time slot" });
    return;
  }

  // 📋 EXACT PAYLOAD STRUCTURE YOUR BACKEND REQUIRES
  const bookingPayload = {
    adminBooking: {
      classOfferingId: selectedTimeSlot.classId,
      classScheduleId: classScheduleId,
      classTimeSlotId: classTimeSlotId,
      name: formData.patientName,
      phoneNumber: formData.contact,
      email: formData.email
    }
  };

  // ✅ SEND TO BACKEND with Swal alerts using res.message
  addBooking(bookingPayload)
    .unwrap()
    .then((res) => {
      console.log("Booking response:", res);
      
      if (res.success) {
        // ✅ Success alert with res.message
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Booking created successfully!',
          icon: 'success',
          confirmButtonColor: '#A7997D',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Reset form and close modal
        setFormData({
          patientName: "",
          contact: "",
          email: "",
          class: "Signature",
          note: "",
        });
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        onCancel();
      } else {
        // ❌ Backend returned success: false
        Swal.fire({
          title: 'Error!',
          text: res.message || 'Failed to create booking.',
          icon: 'error',
          confirmButtonColor: '#d33',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setErrors({ submit: res.message || 'Booking failed.' });
      }
    })
    .catch((error) => {
      console.error("Booking request failed:", error);
      
      // ❌ Network/Request error (not backend validation)
      let errorMessage = "Failed to create booking. Please try again.";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errorMessages?.[0]?.message) {
        errorMessage = error.data.errorMessages[0].message;
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#d33',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
      setErrors({ submit: errorMessage });
    });
};

  const formatTimeSlot = (startTime: string) => {
    return new Date(startTime).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-2xl bg-[#F3F3F3] shadow-xl p-8 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <CloseOutlined />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-[32px] font-medium text-[#4E4E4A]">
            Add an Appointment
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm md:text-base text-[#4E4E4A] font-medium">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="e.g emily"
                  className={`w-full rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3] px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
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
                <label className="text-sm md:text-base text-[#4E4E4A] font-medium">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="e.g +12 1245 1524"
                  className={`w-full rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3] px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm md:text-base text-[#4E4E4A] font-medium">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3] px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
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
                <label className="mb-1 block text-sm md:text-base text-[#4E4E4A] font-medium">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className={`w-full rounded-[12px] border border-[#D9D9D9]/50 bg-[#F3F3F3] px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.class
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#A7997D] focus:ring-[#A7997D]"
                  }`}
                >
                  {classOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p className="mt-1 text-xs text-red-500">{errors.class}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm md:text-base text-[#4E4E4A] font-medium">
                Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Write note here"
                rows={2}
                className="w-full px-3 py-2 text-sm focus:outline-none focus:border-[#A7997D] focus:ring-1 focus:ring-[#A7997D] rounded-[12px] border-[0.5px] border-[#D9D9D9] bg-[#F3F3F3]"
              ></textarea>
            </div>
          </div>

          {/* Date and Time Section */}
          <div>
            <label className="mb-1 block text-sm md:text-base text-[#4E4E4A] font-medium">
              Select Date and Time
            </label>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-[#4E4E4A]">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-[#4E4E4A]">Unavailable</span>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                {/* Calendar */}
                <div className="flex-1 w-1/2 border-r border-gray-200 pr-4">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      onClick={goToPrev}
                      disabled={!canNavigatePrev}
                      className={`rounded p-1 hover:bg-gray-200 ${!canNavigatePrev ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20 10C20 15.5229 15.5229 20 10 20C4.4772 20 0 15.5229 0 10C0 4.4772 4.4772 0 10 0C15.5229 0 20 4.4772 20 10ZM9.7071 7.7071C10.0976 7.3166 10.0976 6.6834 9.7071 6.2929C9.3166 5.9024 8.6834 5.9024 8.2929 6.2929L5.3799 9.2059C5.3649 9.2209 5.3503 9.2363 5.3363 9.252C5.13 9.4352 5 9.7024 5 10C5 10.2976 5.13 10.5648 5.3363 10.748C5.3503 10.7637 5.3649 10.7791 5.3799 10.7941L8.2929 13.7071C8.6834 14.0976 9.3166 14.0976 9.7071 13.7071C10.0976 13.3166 10.0976 12.6834 9.7071 12.2929L8.4142 11L14 11C14.5523 11 15 10.5523 15 10C15 9.4477 14.5523 9 14 9L8.4142 9L9.7071 7.7071Z"
                          fill="#A7997D"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                    </span>
                    <button
                      onClick={goToNext}
                      disabled={!canNavigateNext}
                      className={`rounded p-1 hover:bg-gray-200 ${!canNavigateNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
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
                        className="mb-1 h-8 flex items-center justify-center text-xs md:text-sm font-bold text-[#4E4E4A]"
                      >
                        {day}
                      </div>
                    ))}
                    {days.map((day, idx) =>
                      day ? (
                        <button
                          key={idx}
                          onClick={() => handleDateClick(day)}
                          disabled={!isDateAvailable(day)}
                          className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                            isDateSelected(day)
                              ? "bg-[#A7997D] text-white"
                              : isDateAvailable(day)
                              ? "text-gray-700 hover:bg-gray-200 cursor-pointer"
                              : "text-gray-300 cursor-not-allowed opacity-50"
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
                  {selectedDate ? (
                    <div>
                      <div className="mb-2 text-sm font-medium text-[#4E4E4A]">
                        Available Times for {selectedDate.toLocaleDateString()}
                      </div>
                      {timeSlotsForDate.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                          {timeSlotsForDate.map((slot) => {
                            const remaining = (slot.maxSpace || 0) - slot.bookedSpace;
                            const isAvailable = remaining > 0;
                            
                            return (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedTimeSlot(slot)}
                                disabled={!isAvailable}
                                className={`w-full px-3 py-2 text-sm font-medium transition-colors text-left ${
                                  selectedTimeSlot?.id === slot.id
                                    ? "bg-transparent border-2 border-[#A7997D] text-[#A7997D]"
                                    : isAvailable
                                    ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : "border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div>{slot.className}</div>
                                    <div className="text-xs">
                                      {formatTimeSlot(slot.startTime)} - {formatTimeSlot(slot.endTime)}
                                    </div>
                                  </div>
                                  <span className={`text-xs ${
                                    isAvailable ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {isAvailable ? `${remaining} spots` : 'Full'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No time slots available</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm h-full flex items-center justify-center">
                      Select a date to see available times
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={isBookingLoading}
            className="rounded-xl bg-[#A7997D] px-8 py-2 text-sm font-normal text-white hover:bg-[#8d7c68] transition-colors disabled:opacity-50"
          >
            {isBookingLoading ? 'Adding...' : 'Add To Booking'}
          </button>
          {errors.submit && (
            <p className="mt-2 text-xs text-red-500 text-center">{errors.submit}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;