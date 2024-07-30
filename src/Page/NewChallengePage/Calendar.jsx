import React from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css'; 
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 

const YEARS = Array.from({ length: 2026 - 2000 + 1 }, (_, i) => 2026 - i);
const MONTHS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

const Calendar = ({ dateRange, setDateRange, placeholderText }) => {
  const [startDate, endDate] = dateRange;
  const today = new Date();

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    if (!end || start > end) {
      setDateRange([start, null]);
    } else {
      setDateRange([start, end]);
    }
  };

  return (
    <div className="datePickerWrapper">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        locale={ko}
        dateFormat="yyyy.MM.dd"
        placeholderText={placeholderText}
        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        minDate={today}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="customHeaderContainer">
            <div>
              <select
                value={getYear(date)}
                className="year"
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}년
                  </option>
                ))}년
              </select>
              <select
                value={getMonth(date)}
                className="month"
                onChange={({ target: { value } }) => changeMonth(+value)}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={decreaseMonth}
                className="monthButton"
                disabled={prevMonthButtonDisabled}
              >
                <FaChevronLeft fill="#000000" />
              </button>
              <button
                type="button"
                onClick={increaseMonth}
                className="monthButton"
                disabled={nextMonthButtonDisabled}
              >
                <FaChevronRight fill="#000000" />
              </button>
            </div>
          </div>
        )}
        dayClassName={date => {
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
          const isStartDate = date.getDate() === startDate?.getDate() && date.getMonth() === startDate?.getMonth() && date.getFullYear() === startDate?.getFullYear();
          return isToday ? "today" : isStartDate ? "start-date" : undefined;
        }}
      />
    </div>
  );
};

export default Calendar;
