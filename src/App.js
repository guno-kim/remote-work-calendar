import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import moment from "moment";
import './App.css';
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";

function App() {
  const [checkDays, setCheckDays] = useState([]);
  const [vacationDays, setVacationDays] = useState([]);
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const days = moment().daysInMonth();

  useEffect(() => {
    let checkItems = localStorage.getItem("checkDays")?.split(',').filter(o => o);
    setCheckDays(checkItems || []);

    let vacationItems = localStorage.getItem("vacationDays")?.split(',').filter(o => o);
    setVacationDays(vacationItems || []);
  }, [])

  function isWeekday(year, month, day) {
    var day = new Date(year, month, day).getDay();
    return day != 0 && day != 6;
  }

  function getWeekdaysInMonth() {
    var weekdays = 0;
    for (var i = 0; i < days; i++) {
      if (isWeekday(year, month, i + 1)) {
        weekdays++;
      }
    }
    return weekdays;
  }

  const TileType = {
    check: 'Check',
    vacataion: 'vacataion',
  }

  function onClickDay(value, event) {
    let date = moment(value).format("YYYY/M/DD");
    let tileType = getTileType(date);

    if (tileType === null) {
      const newCheckDays = [...checkDays, date]
      localStorage.setItem('checkDays', newCheckDays);
      setCheckDays(newCheckDays);
    } else if (tileType === TileType.check) {
      const newCheckDays = checkDays.filter(day => day !== date);
      localStorage.setItem('checkDays', newCheckDays);

      const newVacationDays = [...vacationDays, date]
      localStorage.setItem('vacationDays', newVacationDays);

      setCheckDays(newCheckDays);
      setVacationDays(newVacationDays);
    } else if (tileType === TileType.vacataion) {
      const newVacationDays = vacationDays.filter(day => day !== date);
      localStorage.setItem('vacationDays', newVacationDays);
      setVacationDays(newVacationDays);
    }
  }

  function getTileType(date) {
    const formatDate = moment(date).format("YYYY/M/DD");
    if (checkDays.includes(formatDate)) {
      return TileType.check;
    } else if (vacationDays.includes(formatDate)) {
      return TileType.vacataion;
    }
    return null;
  }

  function getTileComponent(date) {
    let tileType = getTileType(date);
    if (tileType === TileType.check) {
      return <FaCheck style={{ color: 'green', width: 30, height: 30 }} />
    } else if (tileType === TileType.vacataion) {
      return <MdOutlineCancelPresentation
        style={{ color: 'red', width: 30, height: 30 }} />
    }
    return null;
  }

  return (
    <div className="App">
      <h2>
        {`${month}월 `}
        {checkDays.length}
        /
        {getWeekdaysInMonth() - vacationDays.length}
      </h2>
      <Calendar
        calendarType='US'
        formatDay={(locale, date) => moment(date).format("D")}
        minDetail="month"
        maxDetail="month"
        showNeighboringMonth={false}
        showNavigation={false}
        tileContent={({ date, view }) => {
          return (
            <>
              <div style={{ height: 60 }}>
                {getTileComponent(date)}
              </div>
            </>
          );
        }}
        onClickDay={onClickDay}
      />
    </div>
  );
}

export default App;