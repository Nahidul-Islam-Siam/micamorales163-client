/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import {
  Modal,
  Button,
  Radio,
  Input,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  message,
} from "antd"
import { Calendar } from "antd"
import dayjs, { Dayjs } from "dayjs"
import {
  PlusOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import type { RadioChangeEvent } from "antd"

const { Title, Text } = Typography

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  color: string
  isCustom?: boolean
}

interface DateSchedule {
  date: Date
  slots: TimeSlot[]
}

interface DateTimePickerModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (schedules: DateSchedule[]) => void
  initialSchedules?: DateSchedule[]
}

const DATE_COLORS = [
  "#D4B483", // Yellow
  "#A7997D", // Brown
  "#8d7c68", // Dark Brown
  "#C0B090", // Light Brown
  "#B5A58F", // Gray-Brown
]

// Default time options
const DEFAULT_TIME_OPTIONS = [
  { label: '06:01am to 07:01am', start: '06:01', end: '07:01' },
  { label: '07:01am to 08:01am', start: '07:01', end: '08:01' },
  { label: '09:01am to 10:01am', start: '09:01', end: '10:01' },
]

export default function DateTimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialSchedules = [],
}: DateTimePickerModalProps) {
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([])
  const [timePeriod, setTimePeriod] = useState<"AM" | "PM">("AM")
  const [dateSchedules, setDateSchedules] = useState<Record<string, TimeSlot[]>>({})
  const [editingDate, setEditingDate] = useState<Dayjs | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs("2025-12-01"))

  // Custom time inputs
  const [customStartHour, setCustomStartHour] = useState<string>("06")
  const [customStartMinute, setCustomStartMinute] = useState<string>("01")
  const [customEndHour, setCustomEndHour] = useState<string>("07")
  const [customEndMinute, setCustomEndMinute] = useState<string>("01")

  // Dynamic time options
  const [timeOptions, setTimeOptions] = useState(DEFAULT_TIME_OPTIONS)
  const [newTimeOptionLabel, setNewTimeOptionLabel] = useState<string>("")

  const customTimeInputRef = useRef<HTMLDivElement>(null)

  // Initialize with existing schedules
  useEffect(() => {
    if (initialSchedules.length > 0) {
      const newSelectedDates: Dayjs[] = []
      const newDateSchedules: Record<string, TimeSlot[]> = {}

      initialSchedules.forEach((schedule) => {
        const date = dayjs(schedule.date)
        const dateKey = date.format('YYYY-MM-DD')

        if (!newSelectedDates.some(d => d.format('YYYY-MM-DD') === dateKey)) {
          newSelectedDates.push(date)
        }

        newDateSchedules[dateKey] = schedule.slots.map(slot => ({ ...slot }))
      })

      setSelectedDates(newSelectedDates)
      setDateSchedules(newDateSchedules)
    }
  }, [initialSchedules])

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }

  // Format time display - SIMPLIFIED
  const formatTimeDisplay = (hour: string, minute: string, period: "AM" | "PM") => {
    const hourNum = parseInt(hour)
    if (hourNum === 0) return `12:${minute.padStart(2, '0')}${period.toLowerCase()}`
    if (hourNum > 12) return `${hourNum - 12}:${minute.padStart(2, '0')}${period.toLowerCase()}`
    return `${hourNum}:${minute.padStart(2, '0')}${period.toLowerCase()}`
  }

  // Parse time string like "06:01am" - SIMPLIFIED
  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)(am|pm)/i)
    if (!match) return null
    const [, h, m, p] = match
    return { 
      hour: h, 
      minute: m.padStart(2, '0'), 
      period: p.toUpperCase() as "AM" | "PM" 
    }
  }

  // Get next available color
  const getNextColor = (dateKey: string) => {
    const existingSlots = dateSchedules[dateKey] || []
    const usedColors = existingSlots.map(slot => slot.color)
    const availableColor = DATE_COLORS.find(c => !usedColors.includes(c))
    return availableColor || DATE_COLORS[existingSlots.length % DATE_COLORS.length]
  }

  // Add time slot to selected dates
  const addTimeSlotToDates = (startTime: string, endTime: string, isCustom: boolean = false) => {
    if (selectedDates.length === 0) {
      message.warning('Please select at least one date')
      return
    }

    const newDateSchedules = { ...dateSchedules }
    const timeSlotId = generateId()

    selectedDates.forEach(date => {
      const dateKey = date.format('YYYY-MM-DD')
      const color = getNextColor(dateKey)

      const newSlot: TimeSlot = {
        id: timeSlotId,
        startTime,
        endTime,
        color,
        isCustom
      }

      if (!newDateSchedules[dateKey]) {
        newDateSchedules[dateKey] = [newSlot]
      } else {
        const exists = newDateSchedules[dateKey].some(
          s => s.startTime === startTime && s.endTime === endTime
        )
        if (!exists) {
          newDateSchedules[dateKey] = [...newDateSchedules[dateKey], newSlot]
        }
      }
    })

    setDateSchedules(newDateSchedules)
  }

  // Handle adding custom time - FIXED LOGIC
  const handleAddCustomTime = () => {
    const startHour = customStartHour || "06"
    const startMin = customStartMinute || "01"
    const endHour = customEndHour || "07"
    const endMin = customEndMinute || "01"

    if (!/^\d{1,2}$/.test(startHour) || !/^\d{1,2}$/.test(startMin)) {
      message.error("Invalid start time")
      return
    }

    // Validate hour ranges
    const startHourNum = parseInt(startHour)
    const endHourNum = parseInt(endHour)
    const startMinNum = parseInt(startMin)
    const endMinNum = parseInt(endMin)
    
    if (startHourNum < 1 || startHourNum > 12 || endHourNum < 1 || endHourNum > 12) {
      message.error("Hours must be between 1-12")
      return
    }
    if (startMinNum < 0 || startMinNum > 59 || endMinNum < 0 || endMinNum > 59) {
      message.error("Minutes must be between 0-59")
      return
    }

    // Create start time with current period
    const startTime = formatTimeDisplay(startHour, startMin, timePeriod)

    // Determine end period based on time logic
    let endPeriod: "AM" | "PM" = timePeriod
    
    // Simple logic: if end hour < start hour, it's next period
    if (endHourNum < startHourNum) {
      endPeriod = timePeriod === "AM" ? "PM" : "AM"
    } 
    // Special case: 12am to 1am should stay AM
    else if (timePeriod === "AM" && startHourNum === 12 && endHourNum === 1) {
      endPeriod = "AM"
    }
    // Special case: 12pm to 1pm should stay PM  
    else if (timePeriod === "PM" && startHourNum === 12 && endHourNum === 1) {
      endPeriod = "PM"
    }

    const endTime = formatTimeDisplay(endHour, endMin, endPeriod)

    addTimeSlotToDates(startTime, endTime, true)

    // Reset inputs
    setCustomStartHour("06")
    setCustomStartMinute("01")
    setCustomEndHour("07")
    setCustomEndMinute("01")
  }

  // Add from preset option
  const handleAddTimeOption = (option: typeof DEFAULT_TIME_OPTIONS[0]) => {
    const startTimeRaw = parseTime(option.start + timePeriod.toLowerCase())
    const endTimeRaw = parseTime(option.end + timePeriod.toLowerCase())

    if (!startTimeRaw || !endTimeRaw) {
      message.error("Failed to parse time")
      return
    }

    const startTime = formatTimeDisplay(startTimeRaw.hour, startTimeRaw.minute, startTimeRaw.period)
    const endTime = formatTimeDisplay(endTimeRaw.hour, endTimeRaw.minute, endTimeRaw.period)

    addTimeSlotToDates(startTime, endTime, false)
  }

  // Add new time option
  const handleAddNewTimeOption = () => {
    if (!newTimeOptionLabel.trim()) {
      message.warning('Enter a valid time range')
      return
    }

    const regex = /(\d{1,2}):(\d{2})(am|pm)\s+to\s+(\d{1,2}):(\d{2})(am|pm)/i
    if (!regex.test(newTimeOptionLabel)) {
      message.error('Format: "06:01am to 07:01am"')
      return
    }

    const newOpt = {
      label: newTimeOptionLabel.trim(),
      start: newTimeOptionLabel.split(' to ')[0],
      end: newTimeOptionLabel.split(' to ')[1]
    }

    setTimeOptions(prev => [...prev, newOpt])
    setNewTimeOptionLabel("")
    message.success('Added new time option')
  }

  // Remove time slot
  const handleRemoveTimeSlot = (dateKey: string, slotId: string) => {
    const newSchedules = { ...dateSchedules }
    const filteredSlots = newSchedules[dateKey].filter(s => s.id !== slotId)

    if (filteredSlots.length === 0) {
      delete newSchedules[dateKey]
      setSelectedDates(prev => prev.filter(d => d.format('YYYY-MM-DD') !== dateKey))
    } else {
      newSchedules[dateKey] = filteredSlots
    }

    setDateSchedules(newSchedules)
  }

  // Clear all for one date
  const handleRemoveAllSchedulesForDate = (dateKey: string) => {
    const newSchedules = { ...dateSchedules }
    delete newSchedules[dateKey]
    setDateSchedules(newSchedules)
    setSelectedDates(prev => prev.filter(d => d.format('YYYY-MM-DD') !== dateKey))
  }

  // Handle date selection
  const handleDateSelect = (date: Dayjs) => {
    const dateKey = date.format('YYYY-MM-DD')
    const isSelected = selectedDates.some(d => d.format('YYYY-MM-DD') === dateKey)

    if (isSelected) {
      setSelectedDates(prev => prev.filter(d => d.format('YYYY-MM-DD') !== dateKey))
    } else {
      setSelectedDates(prev => [...prev, date])
    }
    setEditingDate(date)
  }

  // Double-click handler
  const handleDateDoubleClick = (date: Dayjs) => {
    setEditingDate(date)
  }

  // Full cell render with dot indicators and double-click
  const fullCellRender = (value: Dayjs) => {
    const dateKey = value.format('YYYY-MM-DD')
    const hasSchedule = dateSchedules[dateKey]?.length > 0
    const isSelected = selectedDates.some(d => d.format('YYYY-MM-DD') === dateKey)

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => handleDateSelect(value)}
        onDoubleClick={(e) => {
          e.preventDefault()
          handleDateDoubleClick(value)
        }}
      >
        {/* Show the date number (1, 2, 3...) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#000',
            padding: '4px 0',
            pointerEvents: 'none',
          }}
        >
          {value.date()}
        </div>

        {/* Small colored dots for each time slot */}
        {hasSchedule && (
          <div style={{ position: 'absolute', top: '26px', left: '2px', display: 'flex', gap: '1px' }}>
            {dateSchedules[dateKey].map((slot) => (
              <div
                key={slot.id}
                style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: slot.color,
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
        )}

        {/* Faint overlay for selected but not scheduled */}
        {isSelected && !hasSchedule && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '4px',
              background: '#333',
              opacity: 0.2,
            }}
          />
        )}
      </div>
    )
  }

  // Confirm
  const handleConfirm = () => {
    const schedules = Object.entries(dateSchedules).map(([dateStr, slots]) => ({
      date: dayjs(dateStr).toDate(),
      slots,
    }))
    onConfirm(schedules)
    onClose()
  }

  const currentDateSchedules = editingDate ? dateSchedules[editingDate.format('YYYY-MM-DD')] || [] : []

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      className="date-time-picker-modal"
    >
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>Select Date</Title>
          <Text type="secondary">December 2025</Text>
        </div>

        <Row gutter={24}>
          {/* Left: Calendar */}
          <Col span={12}>
            <Calendar
              value={selectedMonth}
              onChange={setSelectedMonth}
              onSelect={handleDateSelect}
              fullCellRender={fullCellRender}
              fullscreen={false}
              style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px' }}
            />

            {selectedDates.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f6f6f6', borderRadius: '6px' }}>
                <Text strong>{selectedDates.length}</Text> date(s) selected
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Click to select/deselect • Double-click to focus
                </Text>
              </div>
            )}
          </Col>

          {/* Right: Scheduler */}
          <Col span={12}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Title level={5}>Choose Your Schedule</Title>

              {/* AM/PM Toggle */}
              <Radio.Group
                value={timePeriod}
                onChange={(e: RadioChangeEvent) => setTimePeriod(e.target.value)}
                buttonStyle="solid"
                style={{ marginBottom: '16px' }}
              >
                <Radio.Button value="AM">AM</Radio.Button>
                <Radio.Button value="PM">PM</Radio.Button>
              </Radio.Group>

              {/* Custom Time Input */}
              <div ref={customTimeInputRef} style={{ marginBottom: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Custom Time:</Text>
                <Row align="middle" gutter={8}>
                  <Col>
                    <Space>
                      <Input
                        value={customStartHour}
                        onChange={(e) => setCustomStartHour(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="HH"
                        style={{ width: 60, textAlign: 'center' }}
                        maxLength={2}
                      />
                      <Text>:</Text>
                      <Input
                        value={customStartMinute}
                        onChange={(e) => setCustomStartMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="MM"
                        style={{ width: 60, textAlign: 'center' }}
                        maxLength={2}
                      />
                      <Text>to</Text>
                      <Input
                        value={customEndHour}
                        onChange={(e) => setCustomEndHour(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="HH"
                        style={{ width: 60, textAlign: 'center' }}
                        maxLength={2}
                      />
                      <Text>:</Text>
                      <Input
                        value={customEndMinute}
                        onChange={(e) => setCustomEndMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="MM"
                        style={{ width: 60, textAlign: 'center' }}
                        maxLength={2}
                      />
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddCustomTime}
                      style={{ backgroundColor: '#A7997D', borderColor: '#A7997D' }}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Quick Options */}
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Quick Time Options:</Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {timeOptions.map((opt, idx) => (
                    <Button
                      key={idx}
                      block
                      icon={<ClockCircleOutlined />}
                      onClick={() => handleAddTimeOption(opt)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderColor: '#d9d9d9'
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Space>
              </div>

              {/* Add New Option */}
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Add New Time Option:</Text>
                <Row gutter={8}>
                  <Col flex="auto">
                    <Input
                      value={newTimeOptionLabel}
                      onChange={(e) => setNewTimeOptionLabel(e.target.value)}
                      placeholder="e.g., 06:01am to 07:01am"
                    />
                  </Col>
                  <Col>
                    <Button type="default" onClick={handleAddNewTimeOption}>
                      Save
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Editing Panel */}
              {editingDate && (
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <Text strong>Schedules for {editingDate.format('MMM DD, YYYY')}:</Text>
                    {currentDateSchedules.length > 0 && (
                      <Button size="small" danger onClick={() => handleRemoveAllSchedulesForDate(editingDate.format('YYYY-MM-DD'))}>
                        Clear All
                      </Button>
                    )}
                  </div>

                  {currentDateSchedules.length === 0 ? (
                    <Text type="secondary">No schedules added</Text>
                  ) : (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {currentDateSchedules.map(slot => (
                        <div
                          key={slot.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            backgroundColor: `${slot.color}15`,
                            borderLeft: `3px solid ${slot.color}`,
                            borderRadius: '4px'
                          }}
                        >
                          <div>
                            <Text strong>{slot.startTime} to {slot.endTime}</Text>
                            {slot.isCustom && <Tag color="blue" style={{ marginLeft: 8 }}>Custom</Tag>}
                          </div>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveTimeSlot(editingDate.format('YYYY-MM-DD'), slot.id)}
                          />
                        </div>
                      ))}
                    </Space>
                  )}
                </div>
              )}

              {/* Bulk Apply Info */}
              {selectedDates.length > 1 && (
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                  Selected time will apply to all {selectedDates.length} selected dates.
                </Text>
              )}
            </div>
          </Col>
        </Row>

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #d9d9d9',
          display: 'flex',
          gap: '12px'
        }}>
          <Button onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={Object.keys(dateSchedules).length === 0}
            style={{
              flex: 1,
              backgroundColor: '#A7997D',
              borderColor: '#A7997D'
            }}
          >
            Done ({Object.keys(dateSchedules).length} dates)
          </Button>
        </div>
      </div>
    </Modal>
  )
}